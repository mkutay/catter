'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { MoonFilledIcon, SunFilledIcon } from '@/components/icons';

let numOfChanges = 0;

function getRandomInt(max: number) {
  numOfChanges += 1;
  return Math.floor(Math.random() * max);
}

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
        className="rounded-md w-7 h-7 flex items-center justify-center"
      >
        <span className="sr-only">Toggle mode</span>
        {getRandomInt(2) !== 1 ? (
          <SunFilledIcon/>
        ) : (
          <MoonFilledIcon/>
        )}
      </button>
    </div>
  );
}