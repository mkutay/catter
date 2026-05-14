import { describe, expect, it } from "vitest";
import { z } from "zod";
import { cn, humanReadable, parseSchema } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges tailwind classes correctly", () => {
      expect(cn("px-2 py-2", "px-4")).toBe("py-2 px-4");
    });

    it("handles conditional classes", () => {
      expect(cn("px-2", true && "py-2", false && "m-2")).toBe("px-2 py-2");
    });
  });

  describe("humanReadable", () => {
    it("converts hyphenated strings to human readable format", () => {
      expect(humanReadable("hello-world")).toBe("Hello World");
      expect(humanReadable("some-tag-name")).toBe("Some Tag Name");
    });

    it("handles single words", () => {
      expect(humanReadable("hello")).toBe("Hello");
    });

    it("converts to lowercase first then capitalizes", () => {
      expect(humanReadable("HELLO-WORLD")).toBe("Hello World");
    });
  });

  describe("parseSchema", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    it("returns ok result for valid values", () => {
      const result = parseSchema(schema, { name: "John", age: 30 });
      expect(result.isOk()).toBe(true);
    });

    it("returns err result for invalid values", () => {
      // @ts-expect-error: testing invalid input
      const result = parseSchema(schema, { name: "John", age: "30" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe("INVALID_VALUES");
        expect(result.error.message).toContain("Invalid values for schema");
      }
    });
  });
});
