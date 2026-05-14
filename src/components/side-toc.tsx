"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TocItem } from "remark-flexible-toc";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export interface TocSection {
  item: TocItem;
  children: TocSection[];
  index: number;
}

/**
 * Converts a flat list of TOC items into a nested hierarchy based on heading depth.
 */
export function buildHierarchy(items: TocItem[]): TocSection[] {
  const result: TocSection[] = [];
  const stack: TocSection[] = [];

  items.forEach((item, index) => {
    const section: TocSection = { item, children: [], index };

    while (
      stack.length > 0 &&
      stack[stack.length - 1].item.depth >= item.depth
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(section);
    } else {
      stack[stack.length - 1].children.push(section);
    }

    stack.push(section);
  });

  return result;
}

/**
 * Recursively checks if any child of a section is the currently active section.
 *
 * This is used to highlight parent sections when a child is active and the parent is collapsed.
 */
export function hasActiveDescendant(
  section: TocSection,
  activeSection: string,
): boolean {
  return section.children.some(
    (child) =>
      activeSection === child.item.href.replace("#", "") ||
      hasActiveDescendant(child, activeSection),
  );
}

export interface TocSectionItemProps {
  section: TocSection;
  activeSection: string;
  collapsedSections: Set<string>;
  setSectionOpen: (href: string, isOpen: boolean) => void;
  setActiveSection: (id: string) => void;
}

/**
 * A single item in the Table of Contents, which may have nested children.
 *
 * Uses an Accordion to toggle visibility of nested sub-sections.
 */
export function TocSectionItem({
  section,
  activeSection,
  collapsedSections,
  setSectionOpen,
  setActiveSection,
}: TocSectionItemProps) {
  const { item, children } = section;
  const isActive = activeSection === item.href.replace("#", "");
  const hasChildren = children.length > 0;
  const isCollapsed = collapsedSections.has(item.href);
  const isChildActive = hasActiveDescendant(section, activeSection);
  const highlight = isActive || (hasChildren && isCollapsed && isChildActive);

  const linkClass = cn(
    "block flex-1 rounded-sm py-1 pl-1.5 text-sm leading-4 transition-colors duration-150 hover:text-foreground",
    highlight ? "font-medium text-primary" : "text-muted-foreground",
  );

  const rowClass = cn(
    "flex items-center gap-0.5 rounded-md px-2 py-1 transition-colors duration-150",
    highlight ? "bg-primary/10" : "hover:bg-muted/50",
  );

  if (!hasChildren) {
    return (
      <li>
        <div className={rowClass}>
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              highlight ? "text-primary/60" : "text-muted-foreground/25",
            )}
          />
          <Link
            href={item.href}
            className={linkClass}
            onClick={() => setActiveSection(item.href.replace("#", ""))}
          >
            {item.value}
          </Link>
        </div>
      </li>
    );
  }

  return (
    <li>
      <AccordionPrimitive.Root
        type="single"
        collapsible
        value={isCollapsed ? "" : item.href}
        onValueChange={(value) =>
          setSectionOpen(item.href, value === item.href)
        }
      >
        <AccordionPrimitive.Item value={item.href} className="border-none">
          <div className={rowClass}>
            <AccordionPrimitive.Trigger
              aria-label={isCollapsed ? "Expand section" : "Collapse section"}
              className={cn(
                "shrink-0 text-muted-foreground/60 transition-all duration-150 hover:text-muted-foreground [&[data-state=open]>svg]:rotate-90",
                highlight && "text-primary/60",
              )}
            >
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>

            <Link
              href={item.href}
              className={linkClass}
              onClick={() => setActiveSection(item.href.replace("#", ""))}
            >
              {item.value}
            </Link>
          </div>

          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <ul className="mt-1 space-y-1 pl-4.5">
              {children.map((child) => (
                <TocSectionItem
                  key={child.index}
                  section={child}
                  activeSection={activeSection}
                  collapsedSections={collapsedSections}
                  setSectionOpen={setSectionOpen}
                  setActiveSection={setActiveSection}
                />
              ))}
            </ul>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    </li>
  );
}

/**
 * A sticky Table of Contents sidebar component.
 *
 * - Nested hierarchy based on heading levels.
 * - Automatic active section highlighting using IntersectionObserver.
 * - Collapsible sections with smooth animations.
 * - Compact view for long TOCs.
 */
export function SideTOC({ toc }: { toc: TocItem[] }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  const hierarchicalToc = useMemo(() => buildHierarchy(toc), [toc]);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" },
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.href.replace("#", ""));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const setSectionOpen = useCallback((href: string, isOpen: boolean) => {
    setCollapsedSections((current) => {
      const next = new Set(current);
      if (isOpen) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
  }, []);

  if (toc.length === 0) return null;

  const shouldShowCompactView = toc.length > 10;
  const shouldUseScrollArea = toc.length > 12;

  const tocList = (
    <ul className="space-y-1 px-1">
      {hierarchicalToc.map((section) => (
        <TocSectionItem
          key={section.index}
          section={section}
          activeSection={activeSection}
          collapsedSections={collapsedSections}
          setSectionOpen={setSectionOpen}
          setActiveSection={setActiveSection}
        />
      ))}
    </ul>
  );

  const tocContent = shouldUseScrollArea ? (
    <ScrollArea className="max-h-[70vh] overflow-y-auto">{tocList}</ScrollArea>
  ) : (
    <div className="max-h-[70vh] overflow-y-auto">{tocList}</div>
  );

  return (
    <div className="rounded-lg border border-border/60 bg-card/70 ">
      {shouldShowCompactView ? (
        <AccordionPrimitive.Root
          type="single"
          collapsible
          value={isCollapsed ? "" : "contents"}
          onValueChange={(value) => setIsCollapsed(value !== "contents")}
        >
          <AccordionPrimitive.Item value="contents" className="border-none">
            <AccordionPrimitive.Trigger className="flex w-full items-center justify-between px-3 py-3 text-sm uppercase font-mono tracking-normal font-medium text-muted-foreground transition-colors hover:text-foreground [&[data-state=open]>svg]:rotate-90">
              Contents
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>

            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="border-t border-border/50 py-1">{tocContent}</div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
      ) : (
        <>
          <p className="border-b border-border/50 px-3 py-3 text-sm font-medium font-mono uppercase tracking-normal text-muted-foreground">
            Contents
          </p>
          <div className="py-1">{tocContent}</div>
        </>
      )}
    </div>
  );
}
