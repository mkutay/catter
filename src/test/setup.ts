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

vi.mock("ioredis", () => {
  class RedisMock {
    set = vi.fn(async () => "OK");
    mget = vi.fn(async (...keys: string[]) => keys.map(() => null));
    get = vi.fn(async () => null);
    on = vi.fn(() => this);
    quit = vi.fn(async () => undefined);
    disconnect = vi.fn();
  }

  return { default: RedisMock };
});
