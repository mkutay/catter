import * as React from 'react';
import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="286 300 1400 1400"
    width={size || width}
    {...props}
  >
    <g clipPath="url(#ArtboardFrame)">
      <path d="M1949.61 48.7391L1949.61 1950.77L1293.66 1950.77L1293.66 48.7391L1949.61 48.7391Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="miter" strokeWidth="120"/>
      <path d="M678.17 48.7391L678.17 1950.77L50.2695 1950.77L50.2695 48.7391L678.17 48.7391Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="miter" strokeWidth="120"/>
        <path d="M999.997 1176.75L648.478 822.756" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
        <path d="M356.343 1169.82L714.94 822.99" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
        <path d="M971.827 823.375L1324.59 1176.14" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
        <path d="M1615.5 828.052L1258.13 1176.14" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
    </g>
  </svg>
);