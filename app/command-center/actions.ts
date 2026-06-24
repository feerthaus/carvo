"use server";

import { revalidatePath } from "next/cache";
import { getPutraCommandCenterAccess } from "@/lib/carvo/access";
import { createClient } from "@/lib/supabase/server";

type BookingStatus = "requested" | "quoted" | "confirmed" | "cancelled" | "completed";

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  requested: ["quoted", "confirmed", "cancelled"],
  quoted: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: [],
  completed: [],
};

export async function updateBookingStatus(formData: FormData) {
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim() as BookingStatus;

  if (!bookingId || !isBookingStatus(nextStatus)) {
    return;
  }

  const access = await getPutraCommandCenterAccess();

  if (access.status !== "authorized") {
    return;
  }

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, tenant_id, status, customer_name, vehicle_id")
    .eq("id", bookingId)
    .eq("tenant_id", access.tenantId)
    .maybeSingle();

  if (!booking || !isBookingStatus(booking.status)) {
    return;
  }

  if (!allowedTransitions[booking.status].includes(nextStatus)) {
    return;
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      status: nextStatus,
    })
    .eq("id", booking.id)
    .eq("tenant_id", access.tenantId);

  if (error) {
    return;
  }

  await supabase.from("activity_events").insert({
    tenant_id: access.tenantId,
    actor_user_id: access.userId,
    event_type: `booking.${nextStatus}`,
    source: "command-center",
    title: `Booking ${booking.id.slice(0, 8).toUpperCase()} marked ${nextStatus}`,
    body: `${access.userEmail} updated ${booking.customer_name ?? "a customer booking"} from ${booking.status} to ${nextStatus}.`,
    payload: {
      booking_id: booking.id,
      previous_status: booking.status,
      next_status: nextStatus,
      actor_role: access.role,
    },
  });

  revalidatePath("/command-center");
}

function isBookingStatus(status: string): status is BookingStatus {
  return ["requested", "quoted", "confirmed", "cancelled", "completed"].includes(status);
}
