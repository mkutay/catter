import { describe, expect, it } from "vitest";
import {
  commentsFormSchema,
  deleteGuestbookEntryDataFormSchema,
  guestbookDialogFormSchema,
  guestbookFormSchema,
} from "@/config/schema";

describe("schemas", () => {
  describe("guestbookDialogFormSchema", () => {
    it("validates valid input", () => {
      const validData = {
        color: "blue",
        username: "testuser",
        message: "hello world",
      };
      const result = guestbookDialogFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails on invalid color", () => {
      const invalidData = {
        color: "invalid-color",
        username: "testuser",
        message: "hello world",
      };
      const result = guestbookDialogFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("fails on short username", () => {
      const invalidData = {
        color: "blue",
        username: "",
        message: "hello world",
      };
      const result = guestbookDialogFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("fails on long message", () => {
      const invalidData = {
        color: "blue",
        username: "user",
        message: "a".repeat(501),
      };
      const result = guestbookDialogFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("guestbookFormSchema", () => {
    it("validates valid message", () => {
      const result = guestbookFormSchema.safeParse({
        message: "valid message",
      });
      expect(result.success).toBe(true);
    });

    it("fails on empty message", () => {
      const result = guestbookFormSchema.safeParse({ message: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("commentsFormSchema", () => {
    it("validates valid comment", () => {
      const result = commentsFormSchema.safeParse({ message: "valid comment" });
      expect(result.success).toBe(true);
    });

    it("fails on empty comment", () => {
      const result = commentsFormSchema.safeParse({ message: "" });
      expect(result.success).toBe(false);
    });

    it("fails on too long comment", () => {
      const result = commentsFormSchema.safeParse({
        message: "a".repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("deleteGuestbookEntryDataFormSchema", () => {
    it("validates when at least one item is selected", () => {
      const result = deleteGuestbookEntryDataFormSchema.safeParse({
        items: [1],
      });
      expect(result.success).toBe(true);
    });

    it("fails when no items are selected", () => {
      const result = deleteGuestbookEntryDataFormSchema.safeParse({
        items: [],
      });
      expect(result.success).toBe(false);
    });
  });
});
