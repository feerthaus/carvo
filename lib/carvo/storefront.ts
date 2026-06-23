import { createClient } from "@/lib/supabase/server";

export type StorefrontVehicle = {
  id: string;
  name: string;
  seats: number;
  dailyRateMyr: number;
  status: string;
  rating: number | null;
  features: string[];
  homeLocationName: string;
};

export type StorefrontLocation = {
  id: string;
  name: string;
  city: string;
  airportCode: string | null;
};

export type PutraStorefront = {
  source: "supabase" | "preview";
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    displayName: string;
    tagline: string;
  };
  locations: StorefrontLocation[];
  vehicles: StorefrontVehicle[];
};

const previewStorefront: PutraStorefront = {
  source: "preview",
  tenant: {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Putra Auto Rental",
    slug: "putra-auto-rental",
  },
  brand: {
    displayName: "Putra Auto Rental",
    tagline: "Premium airport car rental for KLIA and KLIA2.",
  },
  locations: [
    {
      id: "klia1-door-1",
      name: "KLIA1 Door 1",
      city: "Sepang",
      airportCode: "KUL",
    },
    {
      id: "klia2-door-3",
      name: "KLIA2 Door 3",
      city: "Sepang",
      airportCode: "KUL",
    },
    {
      id: "subang-airport",
      name: "Subang Airport",
      city: "Subang",
      airportCode: "SZB",
    },
  ],
  vehicles: [
    {
      id: "preview-alza",
      name: "Perodua Alza Premium",
      seats: 7,
      dailyRateMyr: 168,
      status: "available",
      rating: 4.9,
      features: ["7 seats", "Airport pickup", "Family luggage"],
      homeLocationName: "KLIA2 Door 3",
    },
    {
      id: "preview-city",
      name: "Honda City RS",
      seats: 5,
      dailyRateMyr: 145,
      status: "available",
      rating: 4.8,
      features: ["Business travel", "Fuel efficient", "Compact sedan"],
      homeLocationName: "Subang Airport",
    },
    {
      id: "preview-vellfire",
      name: "Toyota Vellfire",
      seats: 7,
      dailyRateMyr: 520,
      status: "available",
      rating: 5,
      features: ["Executive transfer", "Captain seats", "Airport VIP"],
      homeLocationName: "KLIA1 Door 1",
    },
    {
      id: "preview-bezza",
      name: "Perodua Bezza",
      seats: 5,
      dailyRateMyr: 95,
      status: "available",
      rating: 4.7,
      features: ["Value pick", "Fuel efficient", "City driving"],
      homeLocationName: "Cyberjaya",
    },
  ],
};

type VehicleRow = {
  id: string;
  name: string;
  seats: number;
  daily_rate_myr: number;
  status: string;
  rating: number | null;
  features: string[];
  home_location_id: string | null;
};

export async function getPutraStorefront(): Promise<PutraStorefront> {
  try {
    const supabase = await createClient();

    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id, name, slug")
      .eq("slug", "putra-auto-rental")
      .eq("status", "active")
      .maybeSingle();

    if (tenantError || !tenant) {
      return previewStorefront;
    }

    const [{ data: brand }, { data: locations }, { data: vehicles }] =
      await Promise.all([
        supabase
          .from("tenant_brands")
          .select("display_name, tagline")
          .eq("tenant_id", tenant.id)
          .maybeSingle(),
        supabase
          .from("fleet_locations")
          .select("id, name, city, airport_code")
          .eq("tenant_id", tenant.id)
          .eq("is_public", true)
          .order("name"),
        supabase
          .from("vehicles")
          .select(
            "id, name, seats, daily_rate_myr, status, rating, features, home_location_id",
          )
          .eq("tenant_id", tenant.id)
          .eq("marketplace_status", "published")
          .order("daily_rate_myr"),
      ]);

    const publicLocations = locations ?? [];
    const locationNames = new Map(
      publicLocations.map((location) => [location.id, location.name]),
    );

    return {
      source: "supabase",
      tenant,
      brand: {
        displayName: brand?.display_name ?? tenant.name,
        tagline: brand?.tagline ?? previewStorefront.brand.tagline,
      },
      locations: publicLocations.map((location) => ({
        id: location.id,
        name: location.name,
        city: location.city,
        airportCode: location.airport_code,
      })),
      vehicles: ((vehicles ?? []) as VehicleRow[]).map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        seats: vehicle.seats,
        dailyRateMyr: Number(vehicle.daily_rate_myr),
        status: vehicle.status,
        rating: vehicle.rating,
        features: vehicle.features,
        homeLocationName:
          locationNames.get(vehicle.home_location_id ?? "") ?? "Airport ready",
      })),
    };
  } catch {
    return previewStorefront;
  }
}
