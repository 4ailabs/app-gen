import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
const KEY = 'genograma-theme';

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('light', theme === 'light');
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem(KEY) as Theme) || 'dark';
  });

  useEffect(() => {
    apply(theme);
    try { localStorage.setItem(KEY, theme); } catch { /* almacenamiento no disponible */ }
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle };
}
