'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="rounded-md w-7 h-7 flex items-center justify-center transition-all"
      >
        <span className="sr-only">Toggle mode</span>
        {theme === 'dark' ? (
          <SunIcon/>
        ) : (
          <MoonIcon/>
        )}
      </button>
    </div>
  );
}