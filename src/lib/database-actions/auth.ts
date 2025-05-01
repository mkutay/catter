"use server";

import { auth } from "@/lib/auth";

export const getUserEmail = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return null;
  }
  return session.user.email;
}