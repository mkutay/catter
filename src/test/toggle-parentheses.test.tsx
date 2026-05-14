import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ToggleParentheses,
  ToggleParenthesesContextToggleButton,
  ToggleParenthesesProvider,
} from "@/components/toggle-parentheses";

describe("ToggleParentheses", () => {
  it("shows dots initially when context is closed and it is not individually open", () => {
    render(
      <ToggleParenthesesProvider defaultOpen={false}>
        <ToggleParentheses>Hidden Content</ToggleParentheses>
      </ToggleParenthesesProvider>,
    );

    expect(screen.queryByText("Hidden Content")).toBeNull();
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("shows content when context is open", () => {
    render(
      <ToggleParenthesesProvider defaultOpen={true}>
        <ToggleParentheses>Visible Content</ToggleParentheses>
      </ToggleParenthesesProvider>,
    );

    expect(screen.getByText("(Visible Content)")).toBeDefined();
  });

  it("toggles individual content on click", () => {
    render(
      <ToggleParenthesesProvider defaultOpen={false}>
        <ToggleParentheses>Toggled Content</ToggleParentheses>
      </ToggleParenthesesProvider>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("(Toggled Content)")).toBeDefined();
  });

  it("toggles all via ToggleParenthesesContextToggleButton", () => {
    render(
      <ToggleParenthesesProvider defaultOpen={false}>
        <ToggleParenthesesContextToggleButton />
        <ToggleParentheses>Global Content</ToggleParentheses>
      </ToggleParenthesesProvider>,
    );

    expect(screen.queryByText("Global Content")).toBeNull();

    const toggleAllButton = screen.getByText("Show");
    fireEvent.click(toggleAllButton);

    expect(screen.getByText("(Global Content)")).toBeDefined();
    expect(screen.getByText("Hide")).toBeDefined();
  });
});
