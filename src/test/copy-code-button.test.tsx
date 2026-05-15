import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyCodeButton } from "@/components/copy-code-button";

describe("CopyCodeButton", () => {
  let originalClipboard: typeof navigator.clipboard;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      configurable: true,
    });
  });

  it("renders the copy button", () => {
    render(<CopyCodeButton text="some code" />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("copies text and changes icon temporarily on click", async () => {
    const { container } = render(<CopyCodeButton text="some code" />);
    const button = screen.getByRole("button");

    expect(container.querySelector(".lucide-copy")).not.toBeNull();
    expect(container.querySelector(".lucide-check")).toBeNull();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("some code");
    expect(container.querySelector(".lucide-check")).not.toBeNull();
    expect(container.querySelector(".lucide-copy")).toBeNull();
  });

  it("changes the icon back after the timeout", async () => {
    const { container } = render(<CopyCodeButton text="some code" />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(container.querySelector(".lucide-check")).not.toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    expect(container.querySelector(".lucide-check")).toBeNull();
    expect(container.querySelector(".lucide-copy")).not.toBeNull();
  });
});
