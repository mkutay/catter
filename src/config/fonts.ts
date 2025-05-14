import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const plex = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: '400',
});

export const zodiak = localFont({
  src: [
    {
      path: '../styles/fonts/zodiak/Zodiak-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../styles/fonts/zodiak/Zodiak-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-body',
});