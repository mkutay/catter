import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: {
      GET: vi.fn(),
      POST: vi.fn(),
    },
    auth: vi.fn(async () => null),
    signIn: vi.fn(),
    signOut: vi.fn(),
    unstable_update: vi.fn(),
  })),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}));
