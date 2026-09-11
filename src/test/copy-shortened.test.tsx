import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyShortened } from "@/components/copy-shortened";

const { mockToast } = vi.hoisted(() => ({
  mockToast: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: mockToast,
}));

describe("CopyShortened", () => {
  let originalClipboard: typeof navigator.clipboard;

  beforeEach(() => {
    vi.clearAllMocks();
    originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      configurable: true,
    });
  });

  it("renders the share button", () => {
    render(<CopyShortened shortened="test-slug" />);
    expect(screen.getByText("Share")).toBeDefined();
  });

  it("copies the shortened link to clipboard and shows toast on click", async () => {
    render(<CopyShortened shortened="test-slug" />);
    const button = screen.getByText("Share");

    fireEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `https://www.mkutay.dev/test-slug`,
    );
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Copied to clipboard!");
    });
  });
});
