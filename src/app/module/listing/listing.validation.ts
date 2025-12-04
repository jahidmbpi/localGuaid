import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string({
      error: "Description is required",
    })
    .min(10, "Description must be at least 10 characters"),

  itinerary: z.string().optional(),

  city: z
    .string({
      error: "City is required",
    })
    .min(2, "City name must be at least 2 characters"),

  category: z.string({
    error: "Category is required",
  }),

  price: z
    .number({
      error: "Price is required",
    })
    .positive("Price must be greater than 0"),

  duration: z
    .number({
      error: "Duration is required",
    })
    .positive("Duration must be positive"),

  meetingPoint: z
    .string({
      error: "Meeting point is required",
    })
    .min(3, "Meeting point must be meaningful"),

  maxGroupSize: z
    .number({
      error: "Max group size is required",
    })
    .positive("Group size must be positive"),

  images: z
    .array(z.string().url("Image must be a valid URL"))
    .nonempty("At least one image is required")
    .optional(),

  isActive: z.boolean().optional(),
});
