import { useEffect } from 'react';

interface Options {

  key: string;

  meta?: boolean;
}

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
