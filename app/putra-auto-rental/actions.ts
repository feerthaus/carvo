"use server";

import { randomUUID } from "node:crypto";
import type { BookingRequestState } from "./booking-request-state";
import { createClient } from "@/lib/supabase/server";

export async function createBookingRequest(
  _previousState: BookingRequestState,
  formData: FormData,
): Promise<BookingRequestState> {
  const vehicleId = getRequiredString(formData, "vehicleId");
  const pickupLocationId = getRequiredString(formData, "pickupLocationId");
  const startsAtInput = getRequiredString(formData, "startsAt");
  const endsAtInput = getRequiredString(formData, "endsAt");
  const passengerCountInput = getRequiredString(formData, "passengerCount");
  const customerName = getRequiredString(formData, "customerName");
  const customerEmail = getRequiredString(formData, "customerEmail");
  const customerPhone = getRequiredString(formData, "customerPhone");
  const flightNumber = getOptionalString(formData, "flightNumber");
  const aiSearchPrompt = getOptionalString(formData, "aiSearchPrompt");

  if (
    !vehicleId ||
    !pickupLocationId ||
    !startsAtInput ||
    !endsAtInput ||
    !passengerCountInput ||
    !customerName ||
    !customerEmail ||
    !customerPhone
  ) {
    return {
      status: "error",
      message: "Please complete the required booking details.",
    };
  }

  if (!customerEmail.includes("@")) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  const passengerCount = Number(passengerCountInput);

  if (!Number.isInteger(passengerCount) || passengerCount < 1) {
    return {
      status: "error",
      message: "Passenger count must be at least 1.",
    };
  }

  const startsAt = parseDateTime(startsAtInput);
  const endsAt = parseDateTime(endsAtInput);

  if (!startsAt || !endsAt) {
    return {
      status: "error",
      message: "Please choose valid pickup and return dates.",
    };
  }

  if (endsAt <= startsAt) {
    return {
      status: "error",
      message: "Return date must be after the pickup date.",
    };
  }

  const supabase = await createClient();

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", "putra-auto-rental")
    .eq("status", "active")
    .maybeSingle();

  if (tenantError || !tenant) {
    return {
      status: "error",
      message: "Putra Auto Rental is not available for booking yet.",
    };
  }

  const [{ data: vehicle }, { data: pickupLocation }] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, tenant_id, daily_rate_myr")
      .eq("id", vehicleId)
      .eq("tenant_id", tenant.id)
      .eq("marketplace_status", "published")
      .maybeSingle(),
    supabase
      .from("fleet_locations")
      .select("id, tenant_id")
      .eq("id", pickupLocationId)
      .eq("tenant_id", tenant.id)
      .eq("is_public", true)
      .maybeSingle(),
  ]);

  if (!vehicle) {
    return {
      status: "error",
      message: "Please select an available published vehicle.",
    };
  }

  if (!pickupLocation) {
    return {
      status: "error",
      message: "Please select a valid Putra Auto Rental pickup location.",
    };
  }

  const bookingId = randomUUID();
  const rentalDays = Math.max(
    1,
    Math.ceil((endsAt.getTime() - startsAt.getTime()) / 86_400_000),
  );

  const { error: insertError } = await supabase.from("bookings").insert({
    id: bookingId,
    tenant_id: tenant.id,
    vehicle_id: vehicle.id,
    pickup_location_id: pickupLocation.id,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    passenger_count: passengerCount,
    flight_number: flightNumber,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    quoted_total_myr: Number(vehicle.daily_rate_myr) * rentalDays,
    source_channel: "putra-storefront",
    ai_search_prompt: aiSearchPrompt,
    status: "requested",
  });

  if (insertError) {
    return {
      status: "error",
      message:
        "We could not save your booking request. Please try again or contact Putra Auto Rental.",
    };
  }

  return {
    status: "success",
    message:
      "Your request is in. Putra Auto Rental will confirm availability and handover details shortly.",
    bookingReference: bookingId.slice(0, 8).toUpperCase(),
  };
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getRequiredString(formData, key);
  return value.length > 0 ? value : null;
}

function parseDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
