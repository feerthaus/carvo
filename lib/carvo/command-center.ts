import { createClient } from "@/lib/supabase/server";

type FleetStatus =
  | "available"
  | "cleaning"
  | "delivery"
  | "maintenance"
  | "returning"
  | "rented"
  | "inactive";

export type CommandCenterMetric = {
  label: string;
  value: string;
  delta: string;
};

export type FleetRadarItem = {
  label: string;
  count: number;
  color: string;
};

export type AirportOperation = {
  id: string;
  reference: string;
  pickup: string;
  vehicle: string;
  eta: string;
  status: string;
};

export type CommandCenterEvent = {
  id: string;
  title: string;
  body: string;
  time: string;
};

export type CommandCenterInsight = {
  title: string;
  body: string;
};

export type ManagedBooking = {
  id: string;
  reference: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flightNumber: string;
  passengerCount: number | null;
  startsAt: string;
  endsAt: string;
  vehicleName: string;
  pickupLocationName: string;
  quotedTotalMyr: number | null;
  aiSearchPrompt: string;
};

export type CommandCenterData = {
  source: "supabase";
  tenantName: string;
  hasTenantSession: boolean;
  metrics: CommandCenterMetric[];
  fleetRadar: FleetRadarItem[];
  airportOperations: AirportOperation[];
  managedBookings: ManagedBooking[];
  activityEvents: CommandCenterEvent[];
  insights: CommandCenterInsight[];
  locationHeatmap: Array<{
    name: string;
    count: number;
  }>;
};

type VehicleRow = {
  id: string;
  name: string;
  status: FleetStatus;
  home_location_id: string | null;
};

type BookingRow = {
  ai_search_prompt?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  id: string;
  ends_at: string;
  flight_number?: string | null;
  passenger_count?: number | null;
  pickup_location_id: string | null;
  pickup_location_name?: string;
  quoted_total_myr: number | null;
  starts_at: string;
  status: string;
  vehicle_id: string | null;
  vehicle_name?: string;
};

const statusOrder: Array<{
  status: FleetStatus;
  label: string;
  color: string;
}> = [
  { status: "available", label: "Available", color: "bg-emerald-400" },
  { status: "cleaning", label: "Cleaning", color: "bg-sky-400" },
  { status: "delivery", label: "Delivery", color: "bg-amber-300" },
  { status: "maintenance", label: "Maintenance", color: "bg-rose-400" },
  { status: "returning", label: "Returning", color: "bg-violet-400" },
];

export async function getPutraCommandCenter(): Promise<CommandCenterData> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const hasTenantSession = Boolean(authData.user);

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, name")
    .eq("slug", "putra-auto-rental")
    .eq("status", "active")
    .maybeSingle();

  if (!tenant) {
    return emptyCommandCenter("Putra Auto Rental", hasTenantSession);
  }

  const [
    { data: vehicles },
    { data: locations },
    { data: bookings },
    { data: publicBookings },
    { data: activityEvents },
  ] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, name, status, home_location_id")
      .eq("tenant_id", tenant.id),
    supabase
      .from("fleet_locations")
      .select("id, name")
      .eq("tenant_id", tenant.id)
      .eq("is_public", true)
      .order("name"),
    supabase
      .from("bookings")
      .select(
        "id, customer_name, customer_email, customer_phone, flight_number, passenger_count, ai_search_prompt, starts_at, ends_at, status, quoted_total_myr, vehicle_id, pickup_location_id",
      )
      .eq("tenant_id", tenant.id)
      .order("starts_at", { ascending: true })
      .limit(25),
    supabase.rpc("get_public_command_center_bookings", {
      target_tenant_slug: "putra-auto-rental",
    }),
    supabase
      .from("activity_events")
      .select("id, title, body, created_at")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const fleet = (vehicles ?? []) as VehicleRow[];
  const tenantBookings = (bookings ?? []) as BookingRow[];
  const commandBookings = ((publicBookings ?? []) as BookingRow[]).length > 0
    ? ((publicBookings ?? []) as BookingRow[])
    : tenantBookings;
  const locationNames = new Map((locations ?? []).map((item) => [item.id, item.name]));
  const vehicleNames = new Map(fleet.map((vehicle) => [vehicle.id, vehicle.name]));
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const revenueToday = commandBookings
    .filter((booking) => isWithin(new Date(booking.starts_at), todayStart, todayEnd))
    .reduce((sum, booking) => sum + Number(booking.quoted_total_myr ?? 0), 0);
  const activeRentals = commandBookings.filter((booking) => {
    const startsAt = new Date(booking.starts_at);
    const endsAt = new Date(booking.ends_at);
    return booking.status === "confirmed" && startsAt <= now && endsAt >= now;
  }).length;
  const upcomingReturns = commandBookings.filter((booking) =>
    isWithin(new Date(booking.ends_at), todayStart, todayEnd),
  ).length;
  const availableCars = fleet.filter((vehicle) => vehicle.status === "available").length;
  const totalFleet = fleet.length;
  const occupiedCars = fleet.filter((vehicle) =>
    ["delivery", "returning", "rented"].includes(vehicle.status),
  ).length;
  const occupancyRate = totalFleet > 0 ? Math.round((occupiedCars / totalFleet) * 100) : 0;

  return {
    source: "supabase",
    tenantName: tenant.name,
    hasTenantSession,
    metrics: [
      {
        label: "Revenue today",
        value: commandBookings.length > 0 ? `RM${revenueToday.toLocaleString("en-MY")}` : "RM0",
        delta: "From booking summaries",
      },
      {
        label: "Occupancy rate",
        value: `${occupancyRate}%`,
        delta: totalFleet > 0 ? `${occupiedCars}/${totalFleet} visible fleet` : "No fleet rows",
      },
      {
        label: "Active rentals",
        value: String(activeRentals),
        delta: "Confirmed now",
      },
      {
        label: "Available cars",
        value: String(availableCars),
        delta: "Live fleet",
      },
      {
        label: "Upcoming returns",
        value: String(upcomingReturns),
        delta: "Due today",
      },
    ],
    fleetRadar: statusOrder.map((item) => ({
      label: item.label,
      color: item.color,
      count: fleet.filter((vehicle) => vehicle.status === item.status).length,
    })),
    airportOperations: commandBookings
      .filter((booking) => new Date(booking.starts_at) >= todayStart)
      .slice(0, 5)
      .map((booking) => ({
        id: booking.id,
        reference: booking.id.slice(0, 8).toUpperCase(),
        pickup:
          booking.pickup_location_name ??
          locationNames.get(booking.pickup_location_id ?? "") ??
          "Pickup pending",
        vehicle:
          booking.vehicle_name ??
          vehicleNames.get(booking.vehicle_id ?? "") ??
          "Vehicle pending",
        eta: formatTime(booking.starts_at),
        status: booking.status,
      })),
    managedBookings: tenantBookings.map((booking) => ({
      id: booking.id,
      reference: booking.id.slice(0, 8).toUpperCase(),
      status: booking.status,
      customerName: booking.customer_name ?? "Customer pending",
      customerEmail: booking.customer_email ?? "Email pending",
      customerPhone: booking.customer_phone ?? "Phone pending",
      flightNumber: booking.flight_number ?? "Not provided",
      passengerCount: booking.passenger_count ?? null,
      startsAt: booking.starts_at,
      endsAt: booking.ends_at,
      vehicleName: vehicleNames.get(booking.vehicle_id ?? "") ?? "Vehicle pending",
      pickupLocationName:
        locationNames.get(booking.pickup_location_id ?? "") ?? "Pickup pending",
      quotedTotalMyr: booking.quoted_total_myr,
      aiSearchPrompt: booking.ai_search_prompt ?? "No AI trip intent provided.",
    })),
    activityEvents: (activityEvents ?? []).map((event) => ({
      id: event.id,
      title: event.title,
      body: event.body ?? "No details provided.",
      time: relativeTime(event.created_at),
    })),
    insights: buildInsights({
      availableCars,
      totalFleet,
      occupancyRate,
      upcomingReturns,
      hasTenantSession,
    }),
    locationHeatmap: (locations ?? []).map((location) => ({
      name: location.name,
      count: fleet.filter((vehicle) => vehicle.home_location_id === location.id).length,
    })),
  };
}

function emptyCommandCenter(
  tenantName: string,
  hasTenantSession: boolean,
): CommandCenterData {
  return {
    source: "supabase",
    tenantName,
    hasTenantSession,
    metrics: [
      { label: "Revenue today", value: "Locked", delta: "Tenant login required" },
      { label: "Occupancy rate", value: "0%", delta: "No fleet rows" },
      { label: "Active rentals", value: "Locked", delta: "Tenant login required" },
      { label: "Available cars", value: "0", delta: "No fleet rows" },
      { label: "Upcoming returns", value: "Locked", delta: "Tenant login required" },
    ],
    fleetRadar: statusOrder.map((item) => ({
      label: item.label,
      color: item.color,
      count: 0,
    })),
    airportOperations: [],
    managedBookings: [],
    activityEvents: [],
    insights: [
      {
        title: "Tenant data unavailable",
        body: "Putra Auto Rental was not returned by Supabase for this request.",
      },
    ],
    locationHeatmap: [],
  };
}

function buildInsights({
  availableCars,
  totalFleet,
  occupancyRate,
  upcomingReturns,
  hasTenantSession,
}: {
  availableCars: number;
  totalFleet: number;
  occupancyRate: number;
  upcomingReturns: number;
  hasTenantSession: boolean;
}): CommandCenterInsight[] {
  const insights: CommandCenterInsight[] = [
    {
      title: "Fleet availability",
      body:
        totalFleet > 0
          ? `${availableCars} of ${totalFleet} visible vehicles are available right now.`
          : "No visible fleet rows are available for this tenant.",
    },
    {
      title: "Occupancy signal",
      body:
        occupancyRate >= 80
          ? "Visible fleet occupancy is high. Consider price and handover readiness."
          : "Visible fleet occupancy is below the high-demand threshold.",
    },
  ];

  if (hasTenantSession) {
    insights.push({
      title: "Returns today",
      body:
        upcomingReturns > 0
          ? `${upcomingReturns} vehicles are due to return today.`
          : "No returns are due today from visible booking data.",
    });
  } else {
    insights.push({
      title: "Private operations locked",
      body: "Booking revenue, active rentals, returns, and activity events require a tenant member session.",
    });
  }

  return insights;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function isWithin(date: Date, start: Date, end: Date) {
  return date >= start && date <= end;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function relativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60_000));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
