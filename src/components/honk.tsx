"use client";

import { useState } from "react";

export function Honk() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <button onClick={handleClick} className="px-4 py-3 border-2 border-background rounded-xl hover:bg-background/20 transition-all">
      Honk!
    </button>
  );
}