import Link from "next/link";
import { redirect } from "next/navigation";
import { CommandCenterLoginForm } from "./login-form";
import { getPutraCommandCenterAccess } from "@/lib/carvo/access";

export const dynamic = "force-dynamic";

export default async function CommandCenterLoginPage() {
  const access = await getPutraCommandCenterAccess();

  if (access.status === "authorized") {
    redirect("/command-center");
  }

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="gold-gradient flex size-10 items-center justify-center rounded-2xl text-sm font-black text-black">
            C
          </span>
          <span className="text-lg font-semibold tracking-[0.32em] text-white">
            CARVO
          </span>
        </Link>
        <Link
          href="/putra-auto-rental"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/10"
        >
          Storefront
        </Link>
      </nav>

      <section className="flex min-h-[calc(100vh-6rem)] items-center py-12">
        <CommandCenterLoginForm />
      </section>
    </main>
  );
}
