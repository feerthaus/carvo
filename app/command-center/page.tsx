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
import { redirect } from "next/navigation";
import { updateBookingStatus } from "./actions";
import { signOutCommandCenter } from "./login/actions";
import type { ManagedBooking } from "@/lib/carvo/command-center";
import { getPutraCommandCenterAccess } from "@/lib/carvo/access";
import { getPutraCommandCenter } from "@/lib/carvo/command-center";

export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const access = await getPutraCommandCenterAccess();

  if (access.status === "unauthenticated") {
    redirect("/command-center/login");
  }

  if (access.status === "forbidden") {
    return <AccessPending tenantName={access.tenantName} userEmail={access.userEmail} />;
  }

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
              Signed in as {access.userEmail}. Role: {access.role}. Supabase
              live tenant queries are active.
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
                      <p className="text-sm text-stone-400">Reference</p>
                      <p className="mt-1 font-semibold text-white">
                        {operation.reference}
                      </p>
                    </div>
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
                    <div className="rounded-2xl bg-amber-300/10 p-4 text-amber-100">
                      {operation.status} at {operation.eta}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No upcoming booking summaries are available yet." />
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

        <section className="glass-panel mt-5 rounded-[2.5rem] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200">
                Booking management
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                Protected requests, customer contacts, and status controls.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-400">
              These details are only rendered after an active Putra tenant
              membership is verified.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {commandCenter.managedBookings.length > 0 ? (
              commandCenter.managedBookings.map((booking) => (
                <BookingManagementCard key={booking.id} booking={booking} />
              ))
            ) : (
              <EmptyState message="No protected booking rows are visible for this tenant member yet." />
            )}
          </div>
        </section>

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

function BookingManagementCard({ booking }: { booking: ManagedBooking }) {
  const nextStatuses = getNextStatuses(booking.status);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-100">
              {booking.reference}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-stone-300">
              {booking.status}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            {booking.customerName}
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-stone-300 md:grid-cols-2">
            <Detail label="Email" value={booking.customerEmail} />
            <Detail label="Phone" value={booking.customerPhone} />
            <Detail label="Flight" value={booking.flightNumber} />
            <Detail
              label="Passengers"
              value={booking.passengerCount ? String(booking.passengerCount) : "Not provided"}
            />
            <Detail label="Vehicle" value={booking.vehicleName} />
            <Detail label="Pickup" value={booking.pickupLocationName} />
            <Detail label="Pickup time" value={formatDateTime(booking.startsAt)} />
            <Detail label="Return time" value={formatDateTime(booking.endsAt)} />
          </div>
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm leading-6 text-stone-300">
            <span className="text-stone-500">AI intent:</span>{" "}
            {booking.aiSearchPrompt}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
            Quote
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {booking.quotedTotalMyr != null
              ? `RM${Number(booking.quotedTotalMyr).toLocaleString("en-MY")}`
              : "Pending"}
          </p>

          <div className="mt-6 space-y-3">
            {nextStatuses.length > 0 ? (
              nextStatuses.map((status) => (
                <form key={status} action={updateBookingStatus}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <input type="hidden" name="nextStatus" value={status} />
                  <button className="w-full rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20">
                    Mark {status}
                  </button>
                </form>
              ))
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-stone-400">
                No further status transitions available.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

function getNextStatuses(status: string) {
  if (status === "requested") {
    return ["quoted", "confirmed", "cancelled"];
  }

  if (status === "quoted") {
    return ["confirmed", "cancelled"];
  }

  if (status === "confirmed") {
    return ["completed", "cancelled"];
  }

  return [];
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AccessPending({
  tenantName,
  userEmail,
}: {
  tenantName: string;
  userEmail: string;
}) {
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
        <form action={signOutCommandCenter}>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/10">
            Sign out
          </button>
        </form>
      </nav>

      <section className="flex min-h-[calc(100vh-6rem)] items-center py-12">
        <div className="glass-panel mx-auto max-w-2xl rounded-[2.5rem] p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
            <Activity className="size-4" />
            Access pending
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            {tenantName} Command Center is protected.
          </h1>
          <p className="mt-5 leading-7 text-stone-300">
            You are signed in as <span className="text-white">{userEmail}</span>,
            but this account does not have an active Putra tenant membership yet.
          </p>
          <div className="mt-6 rounded-3xl border border-white/10 bg-black/35 p-5 text-sm leading-6 text-stone-400">
            Ask a platform admin or tenant owner to create a pending invite for
            this email in <span className="text-stone-200">tenant_member_invites</span>.
            The next magic-link sign-in will automatically claim the invite.
          </div>
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
