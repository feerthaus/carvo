import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Car,
  Gauge,
  MapPinned,
  Plane,
  Sparkles,
  Trophy,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const metrics = [
  ["Revenue today", "RM12,840", "+18%"],
  ["Occupancy rate", "87%", "+9%"],
  ["Active rentals", "42", "Live"],
  ["Available cars", "31", "Ready"],
  ["Upcoming returns", "14", "Today"],
];

const activities = [
  ["New booking", "Alza Premium reserved for KLIA2 arrival", "2 min ago"],
  ["Flight delayed", "MH721 moved by 38 minutes", "7 min ago"],
  ["Runner assigned", "Aiman to KLIA1 Door 1", "12 min ago"],
  ["Vehicle returned", "Honda City RS returned clean", "18 min ago"],
];

const radar = [
  ["Available", "31", "bg-emerald-400"],
  ["Cleaning", "8", "bg-sky-400"],
  ["Delivery", "12", "bg-amber-300"],
  ["Maintenance", "5", "bg-rose-400"],
  ["Returning", "14", "bg-violet-400"],
];

const pickups = [
  ["KLIA1 Door 1", "Toyota Vellfire", "Runner: Aiman", "ETA 14:20"],
  ["KLIA2 Door 3", "Perodua Alza", "Runner: Sara", "ETA 15:05"],
  ["Subang", "Honda City RS", "Runner: Hafiz", "ETA 16:10"],
];

export default function CommandCenterPage() {
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
              Putra Auto Rental Operations Command Center
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl">
              Today&apos;s fleet, revenue, runners, flights, and AI actions.
            </h1>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <p className="text-sm text-stone-400">Carvo Copilot</p>
            <p className="mt-2 max-w-sm text-lg text-white">
              "Occupancy is forecast to hit 90%. Increase Bezza pricing by RM20
              and promote Alza weekend inventory."
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map(([label, value, delta]) => (
            <div key={label} className="glass-panel rounded-[2rem] p-5">
              <p className="text-sm text-stone-400">{label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
              <p className="mt-3 text-sm text-amber-200">{delta}</p>
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
              {radar.map(([label, count, color]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-black/35 p-4">
                  <div className={`mb-6 size-3 rounded-full ${color}`} />
                  <p className="text-3xl font-semibold text-white">{count}</p>
                  <p className="mt-1 text-sm text-stone-400">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <Bot className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">AI business advisor</p>
            </div>
            <div className="mt-6 space-y-4">
              <AdvisorCard
                icon={<Sparkles />}
                title="Promote Alza inventory"
                body="Family trip searches are 34% above normal for this weekend."
              />
              <AdvisorCard
                icon={<Wrench />}
                title="Service alert"
                body="Myvi WXY 4182 is due for tyres before the next long-term booking."
              />
              <AdvisorCard
                icon={<ArrowUpRight />}
                title="Pricing move"
                body="Airport SUV demand supports a RM35 daily uplift today."
              />
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
              {pickups.map(([location, vehicle, runner, eta]) => (
                <div key={`${location}-${vehicle}`} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-4 md:items-center">
                  <div>
                    <p className="text-sm text-stone-400">Pickup</p>
                    <p className="mt-1 font-semibold text-white">{location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">Vehicle</p>
                    <p className="mt-1 font-semibold text-white">{vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">Runner</p>
                    <p className="mt-1 font-semibold text-white">{runner}</p>
                  </div>
                  <div className="rounded-2xl bg-amber-300/10 p-4 text-amber-100">
                    {eta}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <Trophy className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Runner leaderboard</p>
            </div>
            <div className="mt-6 space-y-4">
              {["Aiman", "Sara", "Hafiz"].map((name, index) => (
                <div key={name} className="flex items-center justify-between rounded-2xl bg-black/35 p-4">
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="text-sm text-stone-400">
                      {index === 0 ? "99%" : index === 1 ? "97%" : "95%"} on-time
                    </p>
                  </div>
                  <span className="text-amber-200">#{index + 1}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <MapPinned className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Fleet heatmap</p>
            </div>
            <div className="mt-6 h-80 rounded-[2rem] bg-[radial-gradient(circle_at_20%_35%,rgba(245,185,66,0.45),transparent_8rem),radial-gradient(circle_at_65%_45%,rgba(255,255,255,0.16),transparent_10rem),radial-gradient(circle_at_80%_75%,rgba(245,185,66,0.28),transparent_7rem),#070707]" />
          </section>

          <section className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <AlertTriangle className="size-5" />
              <p className="text-sm uppercase tracking-[0.24em]">Alerts</p>
            </div>
            <div className="mt-6 space-y-4">
              {activities.map(([title, body, time]) => (
                <div key={`${title}-${time}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{title}</p>
                    <span className="text-xs text-stone-500">{time}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-300">{body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
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
