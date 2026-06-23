import {
  BadgeCheck,
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

const fleet = [
  ["Perodua Alza Premium", "7 seats", "RM168/day", "KLIA2 available"],
  ["Honda City RS", "5 seats", "RM145/day", "Subang available"],
  ["Toyota Vellfire", "7 seats", "RM520/day", "KLIA pre-book"],
  ["Perodua Bezza", "5 seats", "RM95/day", "Cyberjaya ready"],
];

const badges = ["Verified Operator", "Top Rated", "Fast Response", "Most Booked"];

export default function PutraAutoRentalPage() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="gold-gradient flex size-10 items-center justify-center rounded-2xl text-sm font-black text-black">
            P
          </span>
          <div>
            <span className="block text-sm uppercase tracking-[0.28em] text-amber-200">
              Carvo tenant
            </span>
            <span className="text-lg font-semibold text-white">Putra Auto Rental</span>
          </div>
        </Link>
        <Link
          href="/command-center"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/10"
        >
          Operations
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
            <Plane className="size-4" />
            KLIA and KLIA2 airport rental specialist
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl">
            Premium airport car rental, ready when your flight lands.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            Putra Auto Rental is the first Carvo tenant storefront: branded,
            marketplace-ready, flight-aware, and optimized for mobile booking.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200">
                <BadgeCheck className="size-4 text-amber-200" />
                {badge}
              </span>
            ))}
          </div>

          <div className="glass-panel mt-8 rounded-[2rem] p-4">
            <div className="grid gap-3 md:grid-cols-4">
              <SearchTile icon={<MapPin />} label="Pickup" value="KLIA2 Door 3" />
              <SearchTile icon={<CalendarDays />} label="Dates" value="This weekend" />
              <SearchTile icon={<Users />} label="People" value="6 passengers" />
              <button className="gold-gradient rounded-2xl px-5 py-4 font-semibold text-black">
                Check cars
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-5">
          <div className="h-[34rem] rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(245,185,66,0.35),transparent_12rem),linear-gradient(135deg,#1c1917,#030303_50%,#4a2f0a)] p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-black/45 px-4 py-2 text-sm text-amber-100">
                Featured by Putra
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                <Star className="size-4 fill-amber-300 text-amber-300" />
                4.9
              </span>
            </div>
            <div className="mt-24 h-44 rounded-[4rem] bg-gradient-to-r from-stone-800 via-black to-stone-700 shadow-2xl">
              <div className="relative top-32 mx-12 flex justify-between">
                <div className="size-24 rounded-full border-[18px] border-black bg-stone-700" />
                <div className="size-24 rounded-full border-[18px] border-black bg-stone-700" />
              </div>
            </div>
            <div className="mt-28">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200">
                Family airport mover
              </p>
              <h2 className="mt-2 text-4xl font-semibold text-white">
                Perodua Alza Premium
              </h2>
              <p className="mt-3 text-stone-300">
                Recommended for 6 travelers from KLIA for 3 days under RM500.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200">
              Available fleet
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
              Marketplace-grade vehicle cards.
            </h2>
          </div>
          <p className="max-w-lg text-stone-300">
            Each card can later be powered by tenant-isolated inventory and
            public marketplace projections from Supabase.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {fleet.map(([name, seats, price, status]) => (
            <article key={name} className="glass-panel rounded-[2rem] p-5">
              <div className="h-44 rounded-[1.5rem] bg-gradient-to-br from-stone-800 via-black to-amber-950" />
              <h3 className="mt-5 text-xl font-semibold text-white">{name}</h3>
              <div className="mt-4 space-y-3 text-sm text-stone-300">
                <p className="flex items-center gap-2">
                  <Users className="size-4 text-amber-200" />
                  {seats}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="size-4 text-amber-200" />
                  {status}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="font-semibold text-amber-200">{price}</span>
                <span className="text-sm text-stone-400">View</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 py-10 lg:grid-cols-3">
        <TrustPanel icon={<ShieldCheck />} value="98.7%" label="Successful handover rate" />
        <TrustPanel icon={<Car />} value="86" label="Fleet size" />
        <TrustPanel icon={<Sparkles />} value="4.9" label="Average rating" />
      </section>
    </main>
  );
}

function SearchTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
        <span className="text-amber-200 [&>svg]:size-4">{icon}</span>
        {label}
      </div>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}

function TrustPanel({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <div className="text-amber-200 [&>svg]:size-6">{icon}</div>
      <p className="mt-5 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-stone-400">{label}</p>
    </div>
  );
}
