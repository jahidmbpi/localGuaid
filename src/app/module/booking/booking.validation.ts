import { BookingStatus } from "@prisma/client";
import z from "zod";

export const createBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});
