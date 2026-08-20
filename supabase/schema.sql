-- Panel Eonesia — esquema inicial de Supabase (borrador)
--
-- Cubre: perfiles de usuario, sistema de permisos granular (pestaña/sector),
-- notificaciones y su estado de lectura por usuario, las tablas de Finanzas
-- (previsión y deuda bancaria), favoritos, el libro editable de Facturación
-- ("Holded propio"), métricas manuales de RRSS y los enlaces embebidos de
-- Biblioteca — es decir, la contrapartida en base de datos de todo lo que hoy
-- vive en localStorage en el frontend (ver apps/web/src/lib/*.tsx).
--
-- LXP se modelará cuando se decida el mecanismo de conexión con AWS
-- (spec §9); de momento el frontend usa datos mock y no depende de estas tablas.

-- ============================================================
-- Perfiles
-- ============================================================

create type public.user_role as enum ('socio', 'empleado', 'becario');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  initials text not null,
  role public.user_role not null default 'empleado',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cualquier usuario autenticado puede ver los perfiles (para el selector de avatares,
-- asignación de responsables, etc.) pero solo puede editar el suyo propio.
create policy "profiles_select_authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ============================================================
-- Permisos granulares (pestaña / sector)
-- ============================================================
-- subject_type + subject_id permiten definir el permiso por rol (aplica a todos los
-- usuarios de ese rol) o por usuario concreto (excepción/override individual).
-- sector_id NULL = el permiso aplica a toda la pestaña.

create type public.permission_subject as enum ('role', 'user');

create table public.tab_permissions (
  id uuid primary key default gen_random_uuid(),
  subject_type public.permission_subject not null,
  subject_role public.user_role,
  subject_user_id uuid references auth.users (id) on delete cascade,
  tab_id text not null,
  sector_id text,
  can_view boolean not null default true,
  created_at timestamptz not null default now(),
  constraint subject_matches_type check (
    (subject_type = 'role' and subject_role is not null and subject_user_id is null) or
    (subject_type = 'user' and subject_user_id is not null and subject_role is null)
  )
);

alter table public.tab_permissions enable row level security;

-- Los socios (dueños del panel) son los únicos que pueden gestionar permisos.
create policy "tab_permissions_select_authenticated" on public.tab_permissions
  for select using (auth.role() = 'authenticated');

create policy "tab_permissions_manage_socios" on public.tab_permissions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'socio')
  );

-- Nota: los 4 socios tienen acceso completo por definición de producto — esto se
-- aplica en la capa de aplicación (si role = 'socio', se ignoran las restricciones
-- de tab_permissions) además de reforzarse aquí vía RLS en las tablas sensibles.

-- ============================================================
-- Notificaciones
-- ============================================================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  tab_id text not null,
  sector_id text not null,
  tag_id text not null,
  title text not null,
  body text,
  created_at timestamptz not null default now()
);

create table public.notification_reads (
  notification_id uuid not null references public.notifications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;

create policy "notifications_select_authenticated" on public.notifications
  for select using (auth.role() = 'authenticated');

create policy "notification_reads_own" on public.notification_reads
  for all using (auth.uid() = user_id);

-- ============================================================
-- Finanzas — previsión y deuda bancaria
-- ============================================================
-- Acceso restringido: solo socios, y empleados/becarios con permiso explícito
-- en tab_permissions para la pestaña "finanzas".

create table public.forecast_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('ingreso', 'gasto')),
  category text not null,
  channel text,
  amount numeric(12, 2) not null,
  period date not null,
  note text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.bank_debts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  principal_total numeric(12, 2) not null,
  principal_amortized numeric(12, 2) not null default 0,
  monthly_payment numeric(12, 2) not null,
  interest_rate numeric(5, 2),
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now()
);

alter table public.forecast_entries enable row level security;
alter table public.bank_debts enable row level security;

-- Reutilizada por todas las tablas restringidas a Finanzas (evita repetir el
-- mismo exists()/join en cada policy — ver invoices más abajo, que la usa también).
create function public.has_tab_access(check_tab_id text)
returns boolean
language sql
security definer
stable
as $$
  select
    exists (select 1 from public.profiles where id = auth.uid() and role = 'socio')
    or exists (
      select 1 from public.tab_permissions p
      join public.profiles pr on pr.id = auth.uid()
      where p.tab_id = check_tab_id
        and p.can_view
        and (
          (p.subject_type = 'role' and p.subject_role = pr.role) or
          (p.subject_type = 'user' and p.subject_user_id = auth.uid())
        )
    );
$$;

create policy "forecast_entries_finanzas_access" on public.forecast_entries
  for all using (public.has_tab_access('finanzas'));

create policy "bank_debts_finanzas_access" on public.bank_debts
  for all using (public.has_tab_access('finanzas'));

-- ============================================================
-- Facturación — "Holded propio" (libro editable de facturas)
-- ============================================================
-- Contrapartida de apps/web/src/components/panel/EditableLedger.tsx,
-- usado hoy por Finanzas > Facturación > Facturas con almacenamiento local.

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  numero text not null,
  cliente text not null,
  categoria text,
  importe numeric(12, 2) not null,
  estado text not null default 'Pendiente' check (estado in ('Pendiente', 'Cobrada', 'Anulada')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "invoices_finanzas_access" on public.invoices
  for all using (public.has_tab_access('finanzas'));

-- ============================================================
-- RRSS — métricas manuales
-- ============================================================
-- Contrapartida de ManualEntryForm en Métricas > RRSS. Cuando se conecten las
-- APIs de cada plataforma (ver apps/api/.env.example), esta tabla pasa de
-- alimentarse a mano a alimentarse por un job programado, sin cambiar el
-- resto del modelo.

create table public.social_metrics (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('web', 'linkedin', 'instagram', 'facebook', 'tiktok')),
  metric_date date not null,
  followers integer,
  interactions integer,
  visits integer,
  entered_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.social_metrics enable row level security;

create policy "social_metrics_select_authenticated" on public.social_metrics
  for select using (auth.role() = 'authenticated');

create policy "social_metrics_insert_authenticated" on public.social_metrics
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- Biblioteca — enlaces embebidos
-- ============================================================
-- Contrapartida de EmbedSlot.tsx (Drive/FTPs/Trello/Miro y cualquier otro tag
-- con slot de embed). Un registro por tag_id — conectar/desconectar es un
-- upsert/delete, igual que hoy en localStorage.

create table public.embeds (
  tag_id text primary key,
  url text not null,
  connected_by uuid references auth.users (id),
  connected_at timestamptz not null default now()
);

alter table public.embeds enable row level security;

create policy "embeds_select_authenticated" on public.embeds
  for select using (auth.role() = 'authenticated');

create policy "embeds_manage_authenticated" on public.embeds
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- Favoritos
-- ============================================================
-- Contrapartida de lib/favorites.tsx — personal de cada usuario, no
-- compartido entre perfiles.

create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  tab_id text not null,
  sector_id text not null,
  tag_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, tab_id, sector_id, tag_id)
);

alter table public.favorites enable row level security;

create policy "favorites_own_only" on public.favorites
  for all using (auth.uid() = user_id);
