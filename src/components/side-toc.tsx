"use client";

import { DashIcon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { TocItem } from "remark-flexible-toc";
import { cn } from "@/lib/utils";
import { TypographyH2 } from "./typography/headings";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface TocSection {
  item: TocItem;
  children: TocSection[];
  index: number;
}

export function SideTOC({ toc }: { toc: TocItem[] }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  // Build hierarchical structure
  const buildHierarchy = (items: TocItem[]): TocSection[] => {
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
  };

  const hierarchicalToc = buildHierarchy(toc);

  // Track active section based on scroll position
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

  const toggleSection = (href: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(href)) {
      newCollapsed.delete(href);
    } else {
      newCollapsed.add(href);
    }
    setCollapsedSections(newCollapsed);
  };

  const renderTocSection = (
    section: TocSection,
    level: number = 0,
  ): React.ReactElement => {
    const { item, children } = section;
    const isActive = activeSection === item.href.replace("#", "");
    const hasChildren = children.length > 0;
    const isCollapsedSection = collapsedSections.has(item.href);

    // Check if any child is active (for highlighting collapsed parents)
    const isChildActive = children.some((child) => {
      const checkChildActive = (childSection: TocSection): boolean => {
        if (activeSection === childSection.item.href.replace("#", ""))
          return true;
        return childSection.children.some(checkChildActive);
      };
      return checkChildActive(child);
    });

    const shouldHighlight =
      isActive || (hasChildren && isCollapsedSection && isChildActive);

    const indentClasses = [
      "pl-0",
      "pl-7",
      "pl-14",
      "pl-[84px]",
      "pl-[112px]",
      "pl-[140px]",
    ];

    const textSizes = [
      "text-base font-medium",
      "text-sm font-medium",
      "text-sm",
      "text-xs",
      "text-xs",
      "text-xs",
    ];

    return (
      <li
        key={section.index}
        className={cn(
          "transition-all duration-200",
          indentClasses[Math.min(level, 5)],
        )}
      >
        <div className="flex items-center group">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-7 mr-1"
              onClick={() => toggleSection(item.href)}
              aria-label={
                isCollapsedSection ? "Expand section" : "Collapse section"
              }
            >
              {isCollapsedSection ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-7 h-8 mr-1 items-center flex justify-center">
              <DashIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}

          <Link
            href={item.href}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-r-md transition-all duration-200 hover:bg-muted/50",
              "border-l-2 border-transparent hover:border-l-primary/20",
              shouldHighlight &&
                "bg-primary/10 border-l-primary text-primary font-medium",
            )}
          >
            <span
              className={cn(
                "block leading-tight transition-colors",
                textSizes[Math.min(item.depth - 1, 5)],
                shouldHighlight
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              {item.value}
            </span>
          </Link>
        </div>

        {hasChildren && !isCollapsedSection && (
          <ul className="mt-1 space-y-0.5">
            {children.map((child) => renderTocSection(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (toc.length === 0) return null;

  const shouldShowCompactView = toc.length > 12;
  const shouldUseScrollArea = toc.length > 15; // Use scroll area for many items

  const tocContent = (
    <div className="p-2">
      <ul className="space-y-0.5">
        {hierarchicalToc.map((section) => renderTocSection(section))}
      </ul>
    </div>
  );

  return (
    <div className="w-1/3 sticky top-16 h-full lg:flex hidden flex-col mt-5">
      <div className="flex w-full items-center justify-between mb-3">
        <TypographyH2 className="flex items-center gap-2">
          Contents
        </TypographyH2>

        {shouldShowCompactView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={
              isCollapsed
                ? "Expand table of contents"
                : "Collapse table of contents"
            }
          >
            {isCollapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </Button>
        )}
      </div>

      {!isCollapsed && (
        <div className="border rounded-lg bg-card border-border backdrop-blur-xs">
          {shouldUseScrollArea ? (
            <ScrollArea className="h-[70vh]">{tocContent}</ScrollArea>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">{tocContent}</div>
          )}

          {toc.length > 8 && (
            <div className="px-3 py-2 border-t border-border text-xs text-muted-foreground">
              {toc.length} sections
            </div>
          )}
        </div>
      )}
    </div>
  );
}
