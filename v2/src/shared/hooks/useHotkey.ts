import { useEffect } from 'react';

interface Options {
  /** lowercase key, e.g. 'k' */
  key: string;
  /** require ⌘ (mac) or Ctrl (win/linux) */
  meta?: boolean;
}

/** Global keydown hotkey. Ignores keystrokes while typing in inputs (unless meta). */
export function useHotkey({ key, meta = false }: Options, handler: () => void): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key) return;
      if (meta && !(e.metaKey || e.ctrlKey)) return;
      if (!meta) {
        const el = e.target as HTMLElement | null;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      }
      e.preventDefault();
      handler();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, meta, handler]);
}
