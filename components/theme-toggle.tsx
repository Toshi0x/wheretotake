"use client";
import { useTheme } from 'next-themes';

export function ThemeToggle(){
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      onClick={()=> setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="focus-ring rounded-xl bg-muted text-text px-3 py-2 hover:opacity-90 transition"
    >
      {isLight ? '🌙 Light' : '☀️ Dark'}
    </button>
  );
}

