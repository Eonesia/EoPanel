import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Wrapped in useCallback so the setter is referentially stable across renders,
  // matching useState's own contract — callers that memoize with [] deps (the
  // usual assumption for a "setX" function) stay correct instead of silently
  // depending on this closure never actually needing to change.
  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // almacenamiento no disponible (modo privado, cuota llena…) — se ignora, la sesión sigue en memoria
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
