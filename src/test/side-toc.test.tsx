import { render, screen, within } from "@testing-library/react";
import { evaluate } from "next-mdx-remote-client/rsc";
import type { TocItem } from "remark-flexible-toc";
import { describe, expect, it } from "vitest";
import {
  buildHierarchy,
  hasActiveDescendant,
  SideTOC,
  type TocSection,
} from "@/components/side-toc";
import { components, options, type Scope } from "@/config/mdx-settings";

// Minimal IntersectionObserver stub to prevent crash in JSDOM.
if (typeof window !== "undefined" && !window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}

describe("SideTOC Helpers", () => {
  const mockItem = (depth: number, href: string): TocItem =>
    ({
      depth,
      href,
      value: href.replace("#", ""),
    }) as TocItem;

  describe("buildHierarchy", () => {
    it("builds a flat hierarchy for same-level headings", () => {
      const items = [mockItem(2, "#h1"), mockItem(2, "#h2")];
      const hierarchy = buildHierarchy(items);
      expect(hierarchy).toHaveLength(2);
      expect(hierarchy[0].children).toHaveLength(0);
      expect(hierarchy[1].children).toHaveLength(0);
    });

    it("builds a nested hierarchy for different-level headings", () => {
      const items = [
        mockItem(2, "#h1"),
        mockItem(3, "#h1-1"),
        mockItem(2, "#h2"),
      ];
      const hierarchy = buildHierarchy(items);
      expect(hierarchy).toHaveLength(2);
      expect(hierarchy[0].children).toHaveLength(1);
      expect(hierarchy[0].children[0].item.href).toBe("#h1-1");
      expect(hierarchy[1].children).toHaveLength(0);
    });

    it("handles deeply nested headings", () => {
      const items = [
        mockItem(2, "#h1"),
        mockItem(3, "#h1-1"),
        mockItem(4, "#h1-1-1"),
      ];
      const hierarchy = buildHierarchy(items);
      expect(hierarchy).toHaveLength(1);
      expect(hierarchy[0].children[0].children[0].item.href).toBe("#h1-1-1");
    });

    it("handles skipped levels in hierarchy", () => {
      const items = [mockItem(2, "#h1"), mockItem(4, "#h1-skipped")];
      const hierarchy = buildHierarchy(items);
      expect(hierarchy).toHaveLength(1);
      expect(hierarchy[0].children[0].item.href).toBe("#h1-skipped");
    });
  });

  describe("hasActiveDescendant", () => {
    const section: TocSection = {
      index: 0,
      item: mockItem(2, "#parent"),
      children: [
        {
          index: 1,
          item: mockItem(3, "#child"),
          children: [
            {
              index: 2,
              item: mockItem(4, "#grandchild"),
              children: [],
            },
          ],
        },
      ],
    };

    it("returns true if a direct child is active", () => {
      expect(hasActiveDescendant(section, "child")).toBe(true);
    });

    it("returns true if a deep descendant is active", () => {
      expect(hasActiveDescendant(section, "grandchild")).toBe(true);
    });

    it("returns false if no descendant is active", () => {
      expect(hasActiveDescendant(section, "parent")).toBe(false);
      expect(hasActiveDescendant(section, "other")).toBe(false);
    });
  });
});

describe("SideTOC Integration", () => {
  const compileMDX = async (source: string): Promise<TocItem[]> => {
    const { scope } = await evaluate<never, Scope>({
      source,
      options,
      components,
    });
    return scope.toc ?? [];
  };

  it("renders null when toc is empty", async () => {
    const { container } = render(<SideTOC toc={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders correct heading structure from markdown", async () => {
    const source = `
## Section 1
### Subsection 1.1
#### Deep section
## Section 2
    `;
    const toc = await compileMDX(source);
    render(<SideTOC toc={toc} />);

    // Check for Section 1 and its nested children:
    const section1Link = screen.getByRole("link", { name: "Section 1" });
    expect(section1Link).toBeDefined();

    const section1Item = section1Link.closest("li");
    expect(section1Item).not.toBeNull();

    if (section1Item) {
      expect(within(section1Item).getByText("Subsection 1.1")).toBeDefined();
      expect(within(section1Item).getByText("Deep section")).toBeDefined();
    }

    expect(screen.getByRole("link", { name: "Section 2" })).toBeDefined();
  });

  it("handles long TOC with compact accordion view", async () => {
    const source = Array.from({ length: 11 }, (_, i) => `## Section ${i}`).join(
      "\n",
    );
    const toc = await compileMDX(source);
    render(<SideTOC toc={toc} />);

    // Should show "Contents" trigger (it's an accordion trigger when toc.length > 10):
    const trigger = screen.getByRole("button", { name: /contents/i });
    expect(trigger).toBeDefined();

    // Verify headings are present inside the compact view:
    expect(screen.getByText("Section 0")).toBeDefined();
    expect(screen.getByText("Section 10")).toBeDefined();
  });

  it("uses ScrollArea for long TOCs", async () => {
    // shouldUseScrollArea = toc.length > 12:
    const source = Array.from({ length: 13 }, (_, i) => `## Section ${i}`).join(
      "\n",
    );
    const toc = await compileMDX(source);
    const { container } = render(<SideTOC toc={toc} />);

    // ScrollArea from shadcn/radix renders a viewport with specific attributes.
    const scrollAreaViewport = container.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    expect(scrollAreaViewport).not.toBeNull();
  });
});
