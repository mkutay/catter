export default function RssSvg({ width, height}: { width: number, height: number }) {
  return (
    <svg
      width={`${width}`}
      height={`${height}`}
      viewBox={`-5 -5 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className="dark:fill-[#cdd6f4] fill-[#4c4f69] hover:fill-[#1e66f5] hover:dark:fill-[#89b4fa]"
    >
      <path d='M1.996 15.97a1.996 1.996 0 1 1 0-3.992 1.996 1.996 0 0 1 0 3.992zM1.12 7.977a.998.998 0 0 1-.247-1.98 8.103 8.103 0 0 1 9.108 8.04v.935a.998.998 0 1 1-1.996 0v-.934a6.108 6.108 0 0 0-6.865-6.06zM0 1.065A.998.998 0 0 1 .93.002C8.717-.517 15.448 5.374 15.967 13.16c.042.626.042 1.254 0 1.88a.998.998 0 1 1-1.992-.133c.036-.538.036-1.077 0-1.614C13.53 6.607 7.75 1.548 1.065 1.994A.998.998 0 0 1 0 1.064z'/>
    </svg>
  );
}