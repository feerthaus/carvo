import {
  Activity,
  AlertTriangle,
  Bot,
  Gauge,
  MapPinned,
  Plane,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { getPutraCommandCenter } from "@/lib/carvo/command-center";

export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const commandCenter = await getPutraCommandCenter();

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

      <section className="mx-auto max-w-7xl py-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
              <Activity className="size-4" />
              {commandCenter.tenantName} Operations Command Center
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl">
              Today&apos;s live fleet, booking signals, airport operations, and
              alerts.
            </h1>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <p className="text-sm text-stone-400">Data source</p>
            <p className="mt-2 max-w-sm text-lg text-white">
              Supabase live queries.{" "}
              {commandCenter.hasTenantSession
                ? "Tenant session detected."
                : "Private booking metrics require tenant login."}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {commandCenter.metrics.map((metric) => (
            <div key={metric.label} className="glass-panel rounded-[2rem] p-5">
              <p className="text-sm text-stone-400">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">
                {metric.value}
              </p>
              <p className="mt-3 text-sm text-amber-200">{metric.delta}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-amber-200">
                  Fleet radar
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  Vehicle status is live, visual, and actionable.
                </h2>
              </div>
              <Gauge className="size-8 text-amber-200" />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-5">
              {commandCenter.fleetRadar.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-black/35 p-4">
                  <div className={`mb-6 size-3 rounded-full ${item.color}`} />
                  <p className="text-3xl font-semibold text-white">
                    {item.count}
                  </p>
                  <p className="mt-1 text-sm text-stone-400">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <Bot className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Business signals</p>
            </div>
            <div className="mt-6 space-y-4">
              {commandCenter.insights.map((insight) => (
                <AdvisorCard
                  key={insight.title}
                  icon={<Sparkles />}
                  title={insight.title}
                  body={insight.body}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <section className="glass-panel rounded-[2.5rem] p-6 xl:col-span-2">
            <div className="flex items-center gap-3 text-amber-200">
              <Plane className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Airport operations</p>
            </div>
            <div className="mt-6 grid gap-4">
              {commandCenter.airportOperations.length > 0 ? (
                commandCenter.airportOperations.map((operation) => (
                  <div key={operation.id} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-4 md:items-center">
                    <div>
                      <p className="text-sm text-stone-400">Pickup</p>
                      <p className="mt-1 font-semibold text-white">
                        {operation.pickup}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-400">Vehicle</p>
                      <p className="mt-1 font-semibold text-white">
                        {operation.vehicle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-400">Customer</p>
                      <p className="mt-1 font-semibold text-white">
                        {operation.customer}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-amber-300/10 p-4 text-amber-100">
                      ETA {operation.eta}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No accessible pickup bookings for today. Tenant login is required for private booking operations." />
              )}
            </div>
          </section>

          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <Trophy className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Runner leaderboard</p>
            </div>
            <EmptyState message="Runner performance needs a staff or runner_tasks table before it can be real data." />
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <MapPinned className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Fleet heatmap</p>
            </div>
            <div className="mt-6 grid min-h-80 gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-5">
              {commandCenter.locationHeatmap.length > 0 ? (
                commandCenter.locationHeatmap.map((location) => (
                  <div key={location.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-white">{location.name}</span>
                      <span className="text-amber-200">{location.count} cars</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-amber-300"
                        style={{
                          width: `${Math.min(100, Math.max(8, location.count * 24))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No public pickup locations were returned by Supabase." />
              )}
            </div>
          </section>

          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <AlertTriangle className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Alerts</p>
            </div>
            <div className="mt-6 space-y-4">
              {commandCenter.activityEvents.length > 0 ? (
                commandCenter.activityEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">{event.title}</p>
                      <span className="text-xs text-stone-500">{event.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-stone-300">{event.body}</p>
                  </div>
                ))
              ) : (
                <EmptyState message="No accessible activity events. Tenant login is required by current RLS policies." />
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/35 p-5 text-sm leading-6 text-stone-400">
      {message}
    </div>
  );
}

function AdvisorCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
      <div className="text-amber-200 [&>svg]:size-5">{icon}</div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-300">{body}</p>
    </div>
  );
}
