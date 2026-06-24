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
import { BookingRequestForm } from "./booking-request-form";
import { getPutraStorefront } from "@/lib/carvo/storefront";

const badges = ["Verified Operator", "Top Rated", "Fast Response", "Most Booked"];

export const dynamic = "force-dynamic";

export default async function PutraAutoRentalPage({
  searchParams,
}: {
  searchParams?: Promise<{
    vehicle?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : {};
  const storefront = await getPutraStorefront();
  const featuredVehicle = storefront.vehicles[0];
  const primaryLocation = storefront.locations[0];
  const selectedVehicleId = storefront.vehicles.some(
    (vehicle) => vehicle.id === params.vehicle,
  )
    ? params.vehicle
    : featuredVehicle?.id;

  return (
    <main className="min-h-screen overflow-hidden px-5 py-5 sm:px-8 lg:px-12">
      <div className="absolute inset-x-0 top-0 -z-10 h-[44rem] bg-[radial-gradient(circle_at_76%_8%,rgba(245,185,66,0.24),transparent_28rem),radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.08),transparent_22rem)]" />

      <nav className="showroom-panel mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="gold-gradient flex size-10 items-center justify-center rounded-xl text-sm font-black text-black">
            P
          </span>
          <div>
            <span className="block text-[0.65rem] font-bold uppercase tracking-[0.28em] text-amber-200">
              Carvo tenant
            </span>
            <span className="text-lg font-bold text-white">
              {storefront.brand.displayName}
            </span>
          </div>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-stone-300 lg:flex">
          <a href="#book">Booking</a>
          <a href="#fleet">Fleet</a>
          <a href="#trust">Trust</a>
          <Link href="/command-center/login">Owner Login</Link>
        </div>
        <a
          href="#book"
          className="gold-gradient rounded-xl px-5 py-3 text-sm font-bold text-black shadow-lg shadow-amber-950/40"
        >
          Book Now
        </a>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
            <Plane className="size-4" />
            KLIA and KLIA2 airport rental specialist
          </div>
          <h1 className="text-balance text-5xl font-black uppercase leading-[0.92] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">
            Elevate your <span className="gold-text">arrival.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            {storefront.brand.tagline} Premium airport rentals, clean cars,
            fast response and flight-aware handover powered by Carvo.
          </p>

          <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-300">
            Data source:{" "}
            <span className="ml-1 text-amber-200">
              {storefront.source === "supabase"
                ? "Supabase live tenant data"
                : "Preview data until migration is applied"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-stone-200"
              >
                <BadgeCheck className="size-4 text-amber-200" />
                {badge}
              </span>
            ))}
          </div>

          <div className="showroom-panel mt-8 rounded-[2rem] p-4">
            <div className="grid gap-3 md:grid-cols-4">
              <SearchTile
                icon={<MapPin />}
                label="Pickup"
                value={primaryLocation?.name ?? "KLIA2 Door 3"}
              />
              <SearchTile icon={<CalendarDays />} label="Dates" value="This weekend" />
              <SearchTile icon={<Users />} label="People" value="6 passengers" />
              <a
                href="#book"
                className="gold-gradient rounded-2xl px-5 py-4 text-center font-bold text-black"
              >
                Check cars
              </a>
            </div>
          </div>
        </div>

        <div className="showroom-panel rounded-[2.5rem] p-4">
          <div className="car-stage">
            <div className="absolute left-6 top-6 z-10 rounded-full bg-black/45 px-4 py-2 text-sm text-amber-100">
              Featured by Putra
            </div>
            <div className="absolute right-6 top-6 z-10 flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              <Star className="size-4 fill-amber-300 text-amber-300" />
              {featuredVehicle?.rating?.toFixed(1) ?? "4.9"}
            </div>
            <div className="car-silhouette" />
            <div className="headlight" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                {featuredVehicle?.features[0] ?? "Airport ready"}
              </p>
              <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">
                {featuredVehicle?.name ?? "Perodua Alza Premium"}
              </h2>
              <p className="mt-3 max-w-lg text-stone-300">
                Recommended for airport arrivals, family trips and business
                transfers with premium handover support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureStrip icon={<ShieldCheck />} title="Verified" body="Marketplace trust profile" />
        <FeatureStrip icon={<Plane />} title="Flight-aware" body="KLIA handover ready" />
        <FeatureStrip icon={<Clock />} title="Fast response" body="Airport timing support" />
        <FeatureStrip icon={<Sparkles />} title="Premium feel" body="Mobile-first booking" />
      </section>

      <BookingRequestForm
        key={selectedVehicleId ?? "default-booking-form"}
        source={storefront.source}
        vehicles={storefront.vehicles}
        locations={storefront.locations}
        selectedVehicleId={selectedVehicleId}
      />

      <section id="fleet" className="mx-auto max-w-7xl py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200">
              Available fleet
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">
              Choose the right arrival car.
            </h2>
          </div>
          <p className="max-w-lg text-stone-400">
            Live tenant inventory rendered as premium marketplace cards.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {storefront.vehicles.map((vehicle) => (
            <article key={vehicle.id} className="premium-card rounded-[2rem] p-5">
              <div className="service-image" />
              <div className="relative mt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{vehicle.name}</h3>
                    <p className="mt-1 text-sm text-stone-400">
                      {vehicle.seats} seats · {vehicle.homeLocationName}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-amber-300/10 px-3 py-1 text-sm text-amber-100">
                    <Star className="size-4 fill-amber-300 text-amber-300" />
                    {vehicle.rating?.toFixed(1) ?? "New"}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-xl font-black text-amber-200">
                    RM{vehicle.dailyRateMyr}/day
                  </span>
                  <Link
                    href={`/putra-auto-rental?vehicle=${vehicle.id}#book`}
                    className="text-sm font-semibold text-white"
                  >
                    Book this car
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="trust" className="mx-auto grid max-w-7xl gap-5 py-10 lg:grid-cols-3">
        <TrustPanel icon={<ShieldCheck />} value="98.7%" label="Successful handover rate" />
        <TrustPanel
          icon={<Car />}
          value={String(storefront.vehicles.length)}
          label="Published fleet"
        />
        <TrustPanel
          icon={<Sparkles />}
          value={averageRating(storefront.vehicles)}
          label="Average rating"
        />
      </section>
    </main>
  );
}

function averageRating(vehicles: Array<{ rating: number | null }>) {
  const ratings = vehicles
    .map((vehicle) => vehicle.rating)
    .filter((rating): rating is number => typeof rating === "number");

  if (ratings.length === 0) {
    return "New";
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return (total / ratings.length).toFixed(1);
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

function FeatureStrip({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="showroom-panel rounded-[2rem] p-4">
      <div className="flex items-center gap-4">
        <span className="gold-gradient flex size-12 shrink-0 items-center justify-center rounded-2xl text-black [&>svg]:size-5">
          {icon}
        </span>
        <div>
          <p className="font-bold text-white">{title}</p>
          <p className="mt-1 text-sm text-stone-400">{body}</p>
        </div>
      </div>
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
    <div className="premium-card rounded-[2rem] p-6">
      <div className="relative">
        <div className="text-amber-200 [&>svg]:size-6">{icon}</div>
        <p className="mt-5 text-4xl font-black text-white">{value}</p>
        <p className="mt-2 text-stone-400">{label}</p>
      </div>
    </div>
  );
}
