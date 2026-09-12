import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from "@/components/ui/number-input";

describe("NumberInput", () => {
  it("renders with defaultValue and responds to increment/decrement buttons", () => {
    const handleChange = vi.fn();
    render(
      <NumberInput
        defaultValue={10}
        stepper={2}
        onValueChange={handleChange}
        aria-label="test-number-input"
      />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("10");

    const increaseBtn = screen.getByRole("button", {
      name: "Increase value",
    });
    const decreaseBtn = screen.getByRole("button", {
      name: "Decrease value",
    });

    fireEvent.click(increaseBtn);
    expect(handleChange).toHaveBeenCalledWith(12);

    fireEvent.click(decreaseBtn);
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it("handles ArrowUp and ArrowDown keys", () => {
    const handleChange = vi.fn();
    render(
      <NumberInput defaultValue={5} stepper={1} onValueChange={handleChange} />,
    );

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(handleChange).toHaveBeenCalledWith(6);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith(5);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("respects min and max bounds", () => {
    const handleChange = vi.fn();
    render(
      <NumberInput
        value={10}
        min={0}
        max={10}
        stepper={1}
        onValueChange={handleChange}
      />,
    );

    const increaseBtn = screen.getByRole("button", {
      name: "Increase value",
    });
    expect(increaseBtn).toBeDisabled();

    const decreaseBtn = screen.getByRole("button", {
      name: "Decrease value",
    });
    expect(decreaseBtn).not.toBeDisabled();
  });

  it("formats with prefix and decimalScale", () => {
    render(
      <NumberInput value={5.5} prefix="$" decimalScale={2} fixedDecimalScale />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("$5.50");
  });
});
