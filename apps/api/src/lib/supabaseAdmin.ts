import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && serviceRoleKey);

// Cliente con service_role: solo para uso en el servidor, nunca exponer al frontend.
export const supabaseAdmin: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, serviceRoleKey as string)
  : null;
