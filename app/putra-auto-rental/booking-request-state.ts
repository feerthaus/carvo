export type BookingRequestState = {
  status: "idle" | "success" | "error";
  message: string;
  bookingReference?: string;
};

export const initialBookingRequestState: BookingRequestState = {
  status: "idle",
  message: "",
};
