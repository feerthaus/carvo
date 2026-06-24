"use client";

import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Plane,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBookingRequest } from "./actions";
import { initialBookingRequestState } from "./booking-request-state";
import type {
  StorefrontLocation,
  StorefrontVehicle,
} from "@/lib/carvo/storefront";

type BookingRequestFormProps = {
  source: "supabase" | "preview";
  vehicles: StorefrontVehicle[];
  locations: StorefrontLocation[];
  selectedVehicleId?: string;
};

export function BookingRequestForm({
  source,
  vehicles,
  locations,
  selectedVehicleId,
}: BookingRequestFormProps) {
  const initialVehicleId =
    vehicles.find((vehicle) => vehicle.id === selectedVehicleId)?.id ?? vehicles[0]?.id;
  const [activeVehicleId, setActiveVehicleId] = useState(initialVehicleId);
  const [state, formAction] = useActionState(
    createBookingRequest,
    initialBookingRequestState,
  );
  const canSubmit = source === "supabase" && vehicles.length > 0 && locations.length > 0;
  const activeVehicle = vehicles.find((vehicle) => vehicle.id === activeVehicleId);

  return (
    <section id="book" className="mx-auto max-w-7xl py-10">
      <div className="glass-panel overflow-hidden rounded-[2.5rem]">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-white/10 bg-black/30 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
              <Sparkles className="size-4" />
              Premium booking request
            </div>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              Tell Putra your trip. Carvo turns it into an operations-ready
              request.
            </h2>
            <p className="mt-5 leading-7 text-stone-300">
              Share your flight, pickup point, passengers, and travel intent.
              The request is saved directly to Supabase for Putra Auto Rental to
              confirm.
            </p>

            <div className="mt-8 grid gap-3">
              <Insight label="Airport aware" value="Flight number and pickup door included" />
              <Insight label="Tenant isolated" value="Saved only under Putra Auto Rental" />
              <Insight label="Fast follow-up" value="Status starts as requested" />
            </div>
          </div>

          <form action={formAction} className="p-4 sm:p-6 lg:p-8">
            {state.status === "success" ? (
              <div className="showroom-panel mb-5 rounded-[2rem] p-5 text-emerald-50">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/15 text-emerald-200">
                    <CheckCircle2 className="size-7" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
                      Request secured
                    </p>
                    <p className="mt-2 text-2xl font-black text-white">
                      Booking request received
                    </p>
                    <p className="mt-2 text-sm leading-6 text-emerald-50/85">
                      {state.message}
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {state.bookingReference ? (
                        <ConfirmationMetric label="Reference" value={state.bookingReference} />
                      ) : null}
                      <ConfirmationMetric
                        label="Next step"
                        value="Putra confirm"
                      />
                      <ConfirmationMetric label="Status" value="Requested" />
                    </div>
                    <p className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-stone-300">
                      We also logged this request into the Operations Command
                      Center activity feed so the Putra team can follow up.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {state.status === "error" ? (
              <div className="mb-5 rounded-[2rem] border border-rose-300/30 bg-rose-300/10 p-5 text-sm leading-6 text-rose-50">
                {state.message}
              </div>
            ) : null}

            {!canSubmit ? (
              <div className="mb-5 rounded-[2rem] border border-amber-300/30 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50">
                Live Supabase fleet data is required before booking requests can
                be submitted.
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Vehicle" icon={<Users />}>
                <select
                  name="vehicleId"
                  required
                  disabled={!canSubmit}
                  className="form-control"
                  value={activeVehicleId ?? ""}
                  onChange={(event) => setActiveVehicleId(event.target.value)}
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - RM{vehicle.dailyRateMyr}/day
                    </option>
                  ))}
                </select>
              </Field>

              {activeVehicle ? (
                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200">
                    Selected car
                  </p>
                  <p className="mt-2 font-semibold text-white">{activeVehicle.name}</p>
                  <p className="mt-1 text-sm text-stone-300">
                    {activeVehicle.seats} seats · RM{activeVehicle.dailyRateMyr}/day ·{" "}
                    {activeVehicle.homeLocationName}
                  </p>
                </div>
              ) : null}

              <Field label="Pickup location" icon={<MapPin />}>
                <select
                  name="pickupLocationId"
                  required
                  disabled={!canSubmit}
                  className="form-control"
                  defaultValue={locations[0]?.id}
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Pickup date and time" icon={<CalendarDays />}>
                <input
                  name="startsAt"
                  type="datetime-local"
                  required
                  className="form-control"
                  defaultValue={dateTimeLocalValue(1, 10)}
                />
              </Field>

              <Field label="Return date and time" icon={<CalendarDays />}>
                <input
                  name="endsAt"
                  type="datetime-local"
                  required
                  className="form-control"
                  defaultValue={dateTimeLocalValue(4, 10)}
                />
              </Field>

              <Field label="Passengers" icon={<Users />}>
                <input
                  name="passengerCount"
                  type="number"
                  min="1"
                  max="12"
                  required
                  className="form-control"
                  defaultValue="6"
                />
              </Field>

              <Field label="Flight number" icon={<Plane />}>
                <input
                  name="flightNumber"
                  type="text"
                  className="form-control"
                  placeholder="Example: MH721"
                />
              </Field>

              <Field label="Name" icon={<User />}>
                <input
                  name="customerName"
                  type="text"
                  required
                  className="form-control"
                  placeholder="Your full name"
                />
              </Field>

              <Field label="Email" icon={<Mail />}>
                <input
                  name="customerEmail"
                  type="email"
                  required
                  className="form-control"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Phone / WhatsApp" icon={<Phone />}>
                <input
                  name="customerPhone"
                  type="tel"
                  required
                  className="form-control"
                  placeholder="+60..."
                />
              </Field>

              <Field label="AI trip intent" icon={<MessageSquareText />} wide>
                <textarea
                  name="aiSearchPrompt"
                  className="form-control min-h-28 resize-none"
                  placeholder="Example: I am travelling with 6 people from KLIA for 3 days under RM500."
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-stone-400">
                No payment yet. Putra will confirm availability, runner timing,
                and handover details.
              </p>
              <SubmitButton disabled={!canSubmit} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="gold-gradient inline-flex min-h-14 items-center justify-center rounded-2xl px-6 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Sending request
        </>
      ) : (
        "Request booking"
      )}
    </button>
  );
}

function ConfirmationMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  icon,
  wide = false,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "md:col-span-2" : undefined}>
      <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
        <span className="text-amber-200 [&>svg]:size-4">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="font-semibold text-white">{label}</p>
      <p className="mt-1 text-sm text-stone-400">{value}</p>
    </div>
  );
}

function dateTimeLocalValue(dayOffset: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
