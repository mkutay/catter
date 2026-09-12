import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeltaGammaCalculator } from "@/components/delta-gamma-calculator";

describe("DeltaGammaCalculator", () => {
  it("renders initial scenario correctly in trainer mode", () => {
    render(<DeltaGammaCalculator />);

    expect(screen.getByText("$5.00")).toBeDefined();
    expect(screen.getByText("$100 → $102")).toBeDefined();
    expect(screen.getByText("+0.50")).toBeDefined();
    expect(screen.getByText("0.08")).toBeDefined();
  });

  it("evaluates a correct submission and increments streak", () => {
    render(<DeltaGammaCalculator />);

    const input = screen.getByPlaceholderText("e.g. 6.16");
    fireEvent.change(input, { target: { value: "6.16" } });

    const checkButton = screen.getByRole("button", { name: /Check Price/i });
    fireEvent.click(checkButton);

    expect(screen.getByText(/Correct!/i)).toBeDefined();
    expect(screen.getByText(/Next Problem/i)).toBeDefined();
  });

  it("evaluates an incorrect submission and displays expected target price", () => {
    render(<DeltaGammaCalculator />);

    const input = screen.getByPlaceholderText("e.g. 6.16");
    fireEvent.change(input, { target: { value: "10.00" } });

    const checkButton = screen.getByRole("button", { name: /Check Price/i });
    fireEvent.click(checkButton);

    expect(screen.getByText(/Incorrect/i)).toBeDefined();
    expect(screen.getAllByText(/6\.16/).length).toBeGreaterThan(0);
  });

  it("switches to sandbox mode and displays live calculation", () => {
    render(<DeltaGammaCalculator />);

    const sandboxTab = screen.getByRole("button", { name: "Sandbox" });
    fireEvent.click(sandboxTab);

    expect(screen.getByText("$6.16")).toBeDefined();
  });
});
