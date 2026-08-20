import { useEffect, useState } from "react";
import { useAuth, type MfaFactor } from "../lib/auth";
import { useToast } from "../lib/toast";
import { AppShell } from "../components/layout/AppShell";
import { Icon } from "../components/ui/Icon";

type EnrollDraft = { factorId: string; qrCode: string; secret: string };

export function SecurityPage() {
  const { isDemo, listMfaFactors, enrollMfa, confirmMfaEnrollment, unenrollMfa } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(!isDemo);
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [enrollDraft, setEnrollDraft] = useState<EnrollDraft | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isDemo) return;
    listMfaFactors().then(({ factors }) => {
      setFactors(factors);
      setLoading(false);
    });
  }, [isDemo, listMfaFactors]);

  async function startEnroll() {
    setError(null);
    setBusy(true);
    const res = await enrollMfa();
    setBusy(false);
    if (res.error || !res.factorId || !res.qrCode || !res.secret) {
      setError(res.error ?? "No se pudo iniciar la activación.");
      return;
    }
    setEnrollDraft({ factorId: res.factorId, qrCode: res.qrCode, secret: res.secret });
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollDraft) return;
    setError(null);
    setBusy(true);
    const res = await confirmMfaEnrollment(enrollDraft.factorId, code);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      setCode("");
      return;
    }
    setFactors((prev) => [...prev, { id: enrollDraft.factorId }]);
    setEnrollDraft(null);
    setCode("");
    showToast("Verificación en dos pasos activada");
  }

  async function handleUnenroll(factorId: string) {
    setBusy(true);
    const res = await unenrollMfa(factorId);
    setBusy(false);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    setFactors((prev) => prev.filter((f) => f.id !== factorId));
    showToast("Verificación en dos pasos desactivada", "info");
  }

  return (
    <AppShell crumbs={[{ label: "Seguridad" }]}>
      <div className="mx-auto max-w-xl">
        <header className="mb-6">
          <h1 className="font-display text-xl font-bold text-ink md:text-2xl">Seguridad</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Verificación en dos pasos (TOTP) para tu cuenta — además de la contraseña, se pedirá un código de una
            app de autenticación (Google Authenticator, 1Password, Authy…) al iniciar sesión.
          </p>
        </header>

        {isDemo ? (
          <div className="surface-card flex flex-col items-center gap-2 px-6 py-12 text-center">
            <Icon name="ti-plug-connected-x" className="text-2xl text-ink-faint" />
            <p className="text-sm font-semibold text-ink">No disponible en modo demo</p>
            <p className="max-w-sm text-xs text-ink-faint">
              La verificación en dos pasos usa Supabase Auth de verdad — conecta el proyecto real
              (<code className="rounded bg-surface-2 px-1 py-0.5">VITE_SUPABASE_URL</code> /{" "}
              <code className="rounded bg-surface-2 px-1 py-0.5">VITE_SUPABASE_ANON_KEY</code>) para activarla.
            </p>
          </div>
        ) : loading ? (
          <div className="surface-card flex items-center justify-center px-6 py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-100 border-t-brand-500" />
          </div>
        ) : enrollDraft ? (
          <form onSubmit={confirmEnroll} className="surface-card flex flex-col items-center gap-4 p-6 text-center">
            <p className="text-sm font-semibold text-ink">Escanea el código QR</p>
            <p className="max-w-sm text-xs text-ink-faint">
              Ábrelo con tu app de autenticación. Si no puedes escanearlo, introduce este código a mano:
            </p>
            <img src={enrollDraft.qrCode} alt="Código QR para activar la verificación en dos pasos" className="h-44 w-44" />
            <code className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold tracking-wide text-ink">
              {enrollDraft.secret}
            </code>
            <div className="flex w-full max-w-[220px] flex-col gap-1.5">
              <label htmlFor="enroll-code" className="text-xs font-semibold text-ink-soft">
                Código de 6 dígitos
              </label>
              <input
                id="enroll-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-center text-lg tracking-[0.4em] text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                placeholder="000000"
              />
            </div>
            {error && (
              <p role="alert" className="w-full rounded-lg bg-danger-bg px-3 py-2 text-xs font-medium text-danger">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEnrollDraft(null);
                  setCode("");
                  setError(null);
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" disabled={busy || code.length !== 6} className="btn btn-primary">
                {busy ? "Confirmando…" : "Confirmar"}
              </button>
            </div>
          </form>
        ) : factors.length > 0 ? (
          <div className="surface-card flex flex-col gap-4 p-6">
            {factors.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-bg text-[15px] text-success">
                    <Icon name="ti-shield-lock" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{f.friendlyName ?? "Autenticador"}</p>
                    <p className="text-xs text-ink-faint">Verificación en dos pasos activada</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnenroll(f.id)}
                  disabled={busy}
                  className="text-xs font-medium text-ink-faint transition-colors hover:text-danger"
                >
                  Desactivar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-card flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-lg text-ink-faint">
              <Icon name="ti-shield-lock" />
            </span>
            <p className="text-sm font-semibold text-ink">Verificación en dos pasos desactivada</p>
            <p className="mx-auto max-w-sm text-xs text-ink-faint">
              Añade una capa extra de seguridad a tu cuenta: además de la contraseña, se pedirá un código de tu app
              de autenticación al iniciar sesión.
            </p>
            {error && (
              <p role="alert" className="w-full max-w-sm rounded-lg bg-danger-bg px-3 py-2 text-xs font-medium text-danger">
                {error}
              </p>
            )}
            <button onClick={startEnroll} disabled={busy} className="btn btn-primary mt-1">
              {busy ? "Preparando…" : "Activar verificación en dos pasos"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
