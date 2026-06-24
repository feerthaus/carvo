import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarDays,
  Car,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const featuredCars = [
  {
    name: "Perodua Alza Premium",
    segment: "Family airport mover",
    rating: "4.9",
    price: "RM168/day",
    availability: "KLIA2 now",
  },
  {
    name: "Honda City RS",
    segment: "Business travel",
    rating: "4.8",
    price: "RM145/day",
    availability: "Subang today",
  },
  {
    name: "Toyota Vellfire",
    segment: "Executive transfer",
    rating: "5.0",
    price: "RM520/day",
    availability: "KLIA pre-book",
  },
];

const availability = [
  ["KLIA", "42 cars", "High demand"],
  ["KLIA2", "37 cars", "Fast pickup"],
  ["Subang", "18 cars", "Business peak"],
  ["Cyberjaya", "22 cars", "Weekend deals"],
  ["Johor", "31 cars", "Holiday surge"],
  ["Sabah", "16 cars", "Adventure trips"],
  ["Sarawak", "14 cars", "Long-term demand"],
];

const discoveryFeeds = [
  "Trending cars",
  "Popular destinations",
  "Family trips",
  "Business travel",
  "Airport rentals",
];

const companies = [
  ["Putra Auto Rental", "4.9", "86 cars", "Top Rated"],
  ["AeroDrive Malaysia", "4.8", "53 cars", "Fast Response"],
  ["LuxeMove Rentals", "4.8", "34 cars", "Most Booked"],
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-screen px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_center,rgba(245,185,66,0.18),transparent_42rem)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="gold-gradient flex size-10 items-center justify-center rounded-2xl text-sm font-black text-black">
              C
            </span>
            <span className="text-lg font-semibold tracking-[0.32em] text-white">
              CARVO
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-stone-300 md:flex">
            <a href="#discover">Discover</a>
            <a href="#marketplace">Marketplace</a>
            <Link href="/putra-auto-rental">Putra Auto Rental</Link>
            <Link href="/command-center">Command Center</Link>
          </div>
          <Link
            href="/putra-auto-rental"
            className="rounded-full border border-amber-300/40 px-4 py-2 text-sm font-medium text-amber-100 transition hover:border-amber-200 hover:bg-amber-200/10"
          >
            Book now
          </Link>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 py-16 lg:grid-cols-[1.03fr_0.97fr] lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-amber-100">
              <Plane className="size-4" />
              Flight-aware mobility for Southeast Asia
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              Discover cars like a marketplace. Operate like an airline.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              Carvo gives rental companies a premium white-label SaaS platform,
              while customers search, compare, book, and hand over vehicles with
              real-time confidence.
            </p>

            <div className="glass-panel mt-10 rounded-[2rem] p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                <SearchField icon={<MapPin />} label="Location" value="KLIA, KLIA2, Subang" />
                <SearchField icon={<CalendarDays />} label="Dates" value="Jun 28 - Jul 1" />
                <SearchField icon={<Plane />} label="Flight" value="MH 721 optional" />
                <button className="gold-gradient rounded-2xl px-6 py-4 font-semibold text-black transition hover:scale-[1.01]">
                  Search
                </button>
              </div>
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
                <Bot className="mt-0.5 size-5 shrink-0" />
                <p>
                  Try AI Search: &quot;I am travelling with 6 people from KLIA for
                  3 days under RM500.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 -z-10 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="glass-panel rounded-[2.5rem] p-5">
              <div className="relative h-[34rem] overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-900 via-black to-amber-950">
                <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                    Featured vehicle
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-black/50 px-4 py-2 text-sm text-amber-100">
                    <Star className="size-4 fill-amber-300 text-amber-300" />
                    4.9
                  </span>
                </div>
                <div className="absolute left-8 right-8 top-32 h-44 rounded-[4rem] bg-gradient-to-r from-stone-800 via-stone-950 to-stone-700 shadow-2xl">
                  <div className="absolute -bottom-10 left-10 size-24 rounded-full border-[18px] border-black bg-stone-700" />
                  <div className="absolute -bottom-10 right-10 size-24 rounded-full border-[18px] border-black bg-stone-700" />
                  <div className="absolute left-28 top-8 h-20 w-52 rounded-t-[4rem] bg-gradient-to-br from-amber-200/25 to-white/5" />
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-200">
                    Putra Auto Rental
                  </p>
                  <h2 className="mt-2 text-4xl font-semibold text-white">
                    Alza Premium
                  </h2>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <Metric label="Price" value="RM168/day" />
                    <Metric label="Seats" value="7" />
                    <Metric label="Pickup" value="KLIA2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Live marketplace"
          title="Featured cars, real availability, and trust signals in one premium flow."
          body="Carvo starts with Putra Auto Rental and grows into a marketplace where verified operators compete on availability, service, and trust."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featuredCars.map((car) => (
            <article key={car.name} className="glass-panel rounded-[2rem] p-5">
              <div className="h-52 rounded-[1.5rem] bg-gradient-to-br from-stone-800 via-black to-amber-950" />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{car.name}</h3>
                  <p className="mt-1 text-sm text-stone-400">{car.segment}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-amber-100">
                  <Star className="size-4 fill-amber-300 text-amber-300" />
                  {car.rating}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-lg font-semibold text-amber-200">{car.price}</span>
                <span className="text-sm text-stone-300">{car.availability}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div className="glass-panel rounded-[2rem] p-6">
          <SectionHeading
            eyebrow="Malaysia map"
            title="Fleet distribution and demand hotspots."
            body="Airport demand, long-term rental patterns, and destination surges become visible before they become operational pressure."
          />
          <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-black/40 p-5">
            <div className="grid gap-3">
              {availability.map(([place, cars, signal]) => (
                <div key={place} className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4">
                  <div>
                    <p className="font-medium text-white">{place}</p>
                    <p className="text-sm text-stone-400">{signal}</p>
                  </div>
                  <span className="text-sm font-semibold text-amber-200">{cars}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="marketplace" className="grid gap-5">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <TrendingUp className="size-5" />
              <span className="text-sm uppercase tracking-[0.24em]">Top rated operators</span>
            </div>
            <div className="mt-6 grid gap-4">
              {companies.map(([name, rating, fleet, badge]) => (
                <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="mt-1 text-sm text-stone-400">{fleet} fleet size</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-amber-200">{badge}</p>
                    <p className="mt-1 text-sm text-stone-300">{rating} rating</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <TrustCard icon={<ShieldCheck />} label="Successful handover rate" value="98.7%" />
            <TrustCard icon={<Car />} label="Total cars" value="268" />
            <TrustCard icon={<Users />} label="Total bookings" value="18.4k" />
            <TrustCard icon={<Sparkles />} label="Average rating" value="4.9" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="glass-panel rounded-[2.5rem] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
                <Zap className="size-4" />
                AI Travel Assistant
              </div>
              <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                The booking experience should feel alive before the customer lands.
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-300">
                Flight-aware booking lets Carvo recommend vehicles, pickup doors,
                upgrades, and runner timing based on real trip context.
              </p>
            </div>
            <div className="grid gap-4">
              {discoveryFeeds.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-black/35 p-5">
                  <span className="text-lg font-medium text-white">{item}</span>
                  <ArrowRight className="size-5 text-amber-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-20 hidden rounded-full border border-amber-300/40 bg-black/80 px-5 py-3 text-sm font-medium text-amber-100 shadow-2xl shadow-black/50 backdrop-blur md:flex">
        <Bot className="mr-2 size-4" />
        Ask Carvo
      </div>
    </main>
  );
}

function SearchField({
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
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-500">
        <span className="text-amber-200 [&>svg]:size-4">{icon}</span>
        {label}
      </div>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-amber-200">
        <BadgeCheck className="size-4" />
        {eyebrow}
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl leading-7 text-stone-300">{body}</p>
    </div>
  );
}

function TrustCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <div className="text-amber-200 [&>svg]:size-6">{icon}</div>
      <p className="mt-5 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-stone-400">{label}</p>
    </div>
  );
}
