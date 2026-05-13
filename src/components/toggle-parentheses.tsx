"use client";

import { createContext, useContext, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ToggleParenthesesContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

/**
 * A context to force all "ToggleParentheses" components to use the same toggle state.
 *
 * @param open Whether all of the parentheses are open or closed.
 * @param setOpen A function to set the open state of the parentheses.
 * @param toggle A function to toggle the open state of the parentheses.
 */
export const ToggleParenthesesContext =
  createContext<ToggleParenthesesContextValue>({
    open: false,
    setOpen: () => {},
    toggle: () => {},
  });

/**
 * A provider for the {@link ToggleParenthesesContext}.
 *
 * It provides a toggle function to all children.
 *
 * @param children The children to render.
 * @param defaultOpen The default open state of the parentheses.
 */
export function ToggleParenthesesProvider({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => {
    setOpen((currentOpen) => !currentOpen);
  };

  return (
    <ToggleParenthesesContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </ToggleParenthesesContext.Provider>
  );
}

/**
 * A toggle button that uses the {@link ToggleParenthesesContext} to toggle
 * the open state of the parentheses.
 */
export function ToggleParenthesesContextToggleButton({
  className,
}: {
  className?: string;
}) {
  const { open, toggle } = useContext(ToggleParenthesesContext);

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          onClick={toggle}
          aria-pressed={open}
          variant="outline"
          size="sm"
          className={className}
          suppressHydrationWarning
        >
          {open ? "Hide" : "Show"}
        </Button>
      </TooltipTrigger>
      <TooltipContent suppressHydrationWarning>
        {open ? <p>Close all parentheses.</p> : <p>Show all parentheses.</p>}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * A component that wraps its children in parentheses and toggles their visibility
 * using the {@link ToggleParenthesesContext}.
 *
 * @note This component is intended to be used within a Remark plugin.
 */
export function ToggleParentheses({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(ToggleParenthesesContext);

  if (context.open) {
    return <span>({children})</span>;
  }

  const handleToggle = () => {
    setIsOpen((currentOpen) => !currentOpen);
  };

  return isOpen ? (
    // biome-ignore lint/a11y/noStaticElementInteractions: needed
    // biome-ignore lint/a11y/useKeyWithClickEvents: needed
    <span onClick={handleToggle}>({children})</span>
  ) : (
    <button
      type="button"
      onClick={handleToggle}
      className="hover:text-primary/80 transition-colors text-primary cursor-pointer font-semibold flex-row items-center inline-flex gap-0.5"
    >
      ( <BsThreeDots /> )
    </button>
  );
}
