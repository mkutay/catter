'use client';

import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";

export function ToggleParentheses({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return isOpen ? (
    <span onClick={handleToggle}>
      ({children})
    </span>
  ) : (
    <button onClick={handleToggle} className="text-primary font-semibold flex-row items-center inline-flex gap-0.5">
      ( <BsThreeDots /> )
    </button>
  );
}