"use server";

import { headers } from "next/headers";
import type { LoginState } from "./login-state";
import { createClient } from "@/lib/supabase/server";

export async function requestCommandCenterLogin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return {
      status: "error",
      message: "Enter a valid staff email address.",
    };
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/command-center`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  return {
    status: "success",
    message:
      "Check your email for a secure Carvo Command Center login link. If your email has a pending Putra invite, access will be activated automatically.",
  };
}

export async function signOutCommandCenter() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
