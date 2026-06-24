import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Car,
  Clock,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Airport Rentals",
    body: "Flight-aware pickup at KLIA, KLIA2 and Subang with runner handover.",
    icon: <Plane />,
  },
  {
    title: "Family Trips",
    body: "7-seat MPVs, luggage-friendly options and easy weekend packages.",
    icon: <Users />,
  },
  {
    title: "Business Travel",
    body: "Clean sedans, fast response, corporate billing and priority support.",
    icon: <Trophy />,
  },
  {
    title: "AI Search",
    body: "Tell Carvo your budget, passengers and flight. It recommends the fit.",
    icon: <Bot />,
  },
];

const featuredCars = [
  ["Honda City RS", "Business class sedan", "RM145/day", "4.8"],
  ["Perodua Alza Premium", "Family airport mover", "RM168/day", "4.9"],
  ["Toyota Vellfire", "Executive arrival", "RM520/day", "5.0"],
];

const signals = [
  ["Trusted operators", "Verified rental companies"],
  ["Fast handover", "Airport pickup workflows"],
  ["Live availability", "Real fleet signals"],
  ["Secure booking", "Tenant-isolated data"],
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative px-5 py-5 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(circle_at_72%_16%,rgba(245,185,66,0.24),transparent_28rem),radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_24rem)]" />

        <nav className="showroom-panel mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="gold-gradient flex size-10 items-center justify-center rounded-xl text-sm font-black text-black">
              C
            </span>
            <span className="text-lg font-semibold tracking-[0.28em] text-white">
              CARVO
            </span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-stone-300 lg:flex">
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#marketplace">Marketplace</a>
            <Link href="/command-center/login">Owner Login</Link>
          </div>
          <Link
            href="/putra-auto-rental#book"
            className="gold-gradient rounded-xl px-5 py-3 text-sm font-bold text-black shadow-lg shadow-amber-950/40 transition hover:scale-[1.02]"
          >
            Book Now
          </Link>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
              <ShieldCheck className="size-4" />
              Premium mobility marketplace
            </div>

            <h1 className="max-w-4xl text-balance text-5xl font-black uppercase leading-[0.92] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">
              Premium cars for{" "}
              <span className="gold-text">every arrival.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              Discover, compare and book verified rental cars with flight-aware
              pickup, AI recommendations and a premium mobile-first handover
              experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/putra-auto-rental#book"
                className="gold-gradient inline-flex items-center justify-center rounded-2xl px-6 py-4 font-bold text-black transition hover:scale-[1.02]"
              >
                Book your ride
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="#fleet"
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-4 font-semibold text-white transition hover:bg-white/[0.08]"
              >
                View fleet
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Proof icon={<Star />} label="Avg rating" value="4.9" />
              <Proof icon={<Car />} label="Live cars" value="268+" />
              <Proof icon={<Clock />} label="Handover" value="98.7%" />
            </div>
          </div>

          <div className="showroom-panel p-4 sm:rounded-[2.5rem]">
            <div className="car-stage">
              <div className="absolute left-6 top-6 z-10 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm text-amber-100">
                Featured operator: Putra Auto Rental
              </div>
              <div className="absolute right-6 top-6 z-10 flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                <Star className="size-4 fill-amber-300 text-amber-300" />
                4.9
              </div>
              <div className="car-silhouette" />
              <div className="headlight" />
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                  Flight-ready recommendation
                </p>
                <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">
                  Honda City RS
                </h2>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Metric label="Price" value="RM145" />
                  <Metric label="Pickup" value="KLIA" />
                  <Metric label="Status" value="Ready" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="showroom-panel mx-auto grid max-w-7xl gap-4 rounded-[2rem] p-4 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map(([title, body]) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl bg-white/[0.035] p-4">
              <span className="gold-gradient flex size-12 shrink-0 items-center justify-center rounded-2xl text-black">
                <BadgeCheck className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-stone-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <SectionIntro
          eyebrow="Our platform"
          title="Complete mobility care for your trip."
          body="Carvo is built as a marketplace experience, not a generic rental admin panel."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="premium-card rounded-[2rem] p-5">
              <div className="service-image mb-5" />
              <div className="relative">
                <div className="mb-4 text-amber-200 [&>svg]:size-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-400">{service.body}</p>
                <p className="mt-5 inline-flex items-center text-sm font-semibold text-amber-200">
                  Learn more <ArrowRight className="ml-2 size-4" />
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="fleet" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="showroom-panel rounded-[2.5rem] p-6 sm:p-8">
          <SectionIntro
            eyebrow="Featured fleet"
            title="Cars that feel selected, not listed."
            body="Large editorial cards, trust indicators and live availability make the experience feel premium from the first click."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featuredCars.map(([name, segment, price, rating]) => (
              <article key={name} className="rounded-[2rem] border border-white/10 bg-black/35 p-4">
                <div className="service-image" />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{name}</h3>
                    <p className="mt-1 text-sm text-stone-400">{segment}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-amber-300/10 px-3 py-1 text-sm text-amber-100">
                    <Star className="size-4 fill-amber-300 text-amber-300" />
                    {rating}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-xl font-bold text-amber-200">{price}</span>
                  <Link href="/putra-auto-rental#book" className="text-sm font-semibold text-white">
                    Book now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="showroom-panel rounded-[2rem] p-6">
            <SectionIntro
              eyebrow="AI search"
              title="Ask for the trip, not the filter."
              body="Example: I am travelling with 6 people from KLIA for 3 days under RM500."
            />
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
              <Bot className="mt-0.5 size-5 shrink-0" />
              <p>Carvo recommends vehicles, upgrades, pickup doors and operator fit.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TrustCard icon={<ShieldCheck />} label="Successful handover rate" value="98.7%" />
            <TrustCard icon={<Zap />} label="Fast response operators" value="24/7" />
            <TrustCard icon={<Users />} label="Bookings prepared" value="18.4k" />
            <TrustCard icon={<Sparkles />} label="Marketplace rating" value="4.9" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Proof({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 text-amber-200 [&>svg]:size-5">{icon}</div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}

function SectionIntro({
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
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-3xl text-balance text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl leading-7 text-stone-400">{body}</p>
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
    <div className="premium-card rounded-[2rem] p-6">
      <div className="relative">
        <div className="text-amber-200 [&>svg]:size-6">{icon}</div>
        <p className="mt-5 text-4xl font-black text-white">{value}</p>
        <p className="mt-2 text-sm text-stone-400">{label}</p>
      </div>
    </div>
  );
}
