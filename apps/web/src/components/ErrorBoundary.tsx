import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Panel Eonesia] error no controlado:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-page px-4">
          <div className="surface-card flex max-w-md flex-col items-center gap-4 px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-bg text-xl text-danger">
              !
            </span>
            <div>
              <h1 className="font-display text-lg font-bold text-ink">Algo ha ido mal</h1>
              <p className="mt-1.5 text-sm text-ink-soft">
                Ha ocurrido un error inesperado en el panel. Prueba a recargar la página; si sigue pasando, avisa al
                equipo técnico.
              </p>
            </div>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
