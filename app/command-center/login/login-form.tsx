"use client";

import { Loader2, Mail, Plane, ShieldCheck } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestCommandCenterLogin } from "./actions";
import { initialLoginState } from "./login-state";

export function CommandCenterLoginForm() {
  const [state, formAction] = useActionState(
    requestCommandCenterLogin,
    initialLoginState,
  );

  return (
    <div className="glass-panel mx-auto max-w-xl rounded-[2.5rem] p-5 sm:p-8">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
        <ShieldCheck className="size-4" />
        Tenant staff access
      </div>

      <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
        Sign in to Putra Auto Rental Command Center.
      </h1>
      <p className="mt-4 leading-7 text-stone-300">
        Carvo uses secure email magic links. Invited Putra owner emails are
        converted into active tenant memberships after sign-in.
      </p>

      {state.status !== "idle" ? (
        <div
          className={`mt-6 rounded-3xl border p-4 text-sm leading-6 ${
            state.status === "success"
              ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-50"
              : "border-rose-300/30 bg-rose-300/10 text-rose-50"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <label>
          <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
            <Mail className="size-4 text-amber-200" />
            Staff email
          </span>
          <input
            name="email"
            type="email"
            required
            className="form-control"
            placeholder="owner@putra-auto-rental.example"
          />
        </label>

        <SubmitButton />
      </form>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-stone-400">
        <div className="mb-2 flex items-center gap-2 text-amber-200">
          <Plane className="size-4" />
          Seeded first-owner invite
        </div>
        The initial Putra owner invite is seeded for{" "}
        <span className="text-stone-200">owner@putra-auto-rental.example</span>.
        Update or add invites in Supabase for real staff emails.
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="gold-gradient inline-flex min-h-14 w-full items-center justify-center rounded-2xl px-6 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Sending secure link
        </>
      ) : (
        "Send magic link"
      )}
    </button>
  );
}
