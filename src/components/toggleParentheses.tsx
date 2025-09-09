"use client";

import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ToggleParentheses({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return isOpen ? (
    <span onClick={handleToggle}>
      {/* <span className="text-primary font-semibold mr-[1px]">(</span>{children}<span className="text-primary font-semibold ml-[1px]">)</span> */}
      ({children})
    </span>
  ) : (
    <button onClick={handleToggle} className="hover:text-primary/80 transition-colors text-primary cursor-pointer font-semibold flex-row items-center inline-flex gap-0.5">
      ( <BsThreeDots /> )
    </button>
  );
}

export function ToggleParenthesesPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger className="text-primary hover:text-primary/80 transition-colors cursor-pointer font-semibold inline-flex items-center gap-0.5">
        (<BsThreeDots />)
      </PopoverTrigger>
      <PopoverContent className="w-fit sm:max-w-sm max-w-xs p-2">
        {children}
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
}