"use server"

import { createSession, deleteSession } from "@/lib/session";
import { signUpSchema, signInSchema } from "@/schemas/auth";
import { trpc } from "@/trpc/server";

export async function signUp(name: string, email: string, password: string, confirmPassword: string) {
  const validated = signUpSchema.parse({ name, email, password, confirmPassword });
  const response = await trpc.auth.localSignUp(validated);
  if ("error" in response) return { error: response.error };
  await createSession(response.userId, response.expiresAt);
  return { success: "welcome!" }
}

export async function signIn(email: string, password: string) {
  const validated = signInSchema.parse({ email, password });
  const response = await trpc.auth.localSignIn(validated);
  if (!response) return { error: "Invalid credentials!" };
  await createSession(response.userId, response.expiresAt);
  return { success: "is logged!" }
}

export async function logout() {
  await deleteSession();
}