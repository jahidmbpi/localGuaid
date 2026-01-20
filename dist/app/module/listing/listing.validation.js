"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateListingSchema = exports.createListingSchema = void 0;
const zod_1 = require("zod");
exports.createListingSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        error: "Title is required",
    })
        .min(3, "Title must be at least 3 characters"),
    description: zod_1.z
        .string({
        error: "Description is required",
    })
        .min(10, "Description must be at least 10 characters"),
    itinerary: zod_1.z.string().optional(),
    city: zod_1.z
        .string({
        error: "City is required",
    })
        .min(2, "City name must be at least 2 characters"),
    category: zod_1.z.string({
        error: "Category is required",
    }),
    price: zod_1.z
        .number({
        error: "Price is required",
    })
        .positive("Price must be greater than 0"),
    duration: zod_1.z
        .number({
        error: "Duration is required",
    })
        .positive("Duration must be positive"),
    meetingPoint: zod_1.z
        .string({
        error: "Meeting point is required",
    })
        .min(3, "Meeting point must be meaningful"),
    maxGroupSize: zod_1.z
        .number({
        error: "Max group size is required",
    })
        .positive("Group size must be positive"),
    images: zod_1.z
        .array(zod_1.z.string().url("Image must be a valid URL"))
        .nonempty("At least one image is required")
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateListingSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        error: "Title is required",
    })
        .min(3, "Title must be at least 3 characters")
        .optional(),
    description: zod_1.z
        .string({
        error: "Description is required",
    })
        .min(10, "Description must be at least 10 characters")
        .optional(),
    itinerary: zod_1.z.string().optional(),
    city: zod_1.z
        .string({
        error: "City is required",
    })
        .min(2, "City name must be at least 2 characters")
        .optional(),
    category: zod_1.z
        .string({
        error: "Category is required",
    })
        .optional(),
    price: zod_1.z
        .number({
        error: "Price is required",
    })
        .positive("Price must be greater than 0")
        .optional(),
    duration: zod_1.z
        .number({
        error: "Duration is required",
    })
        .positive("Duration must be positive")
        .optional(),
    meetingPoint: zod_1.z
        .string({
        error: "Meeting point is required",
    })
        .min(3, "Meeting point must be meaningful")
        .optional(),
    maxGroupSize: zod_1.z
        .number({
        error: "Max group size is required",
    })
        .positive("Group size must be positive")
        .optional(),
    images: zod_1.z
        .array(zod_1.z.string().url("Image must be a valid URL"))
        .nonempty("At least one image is required")
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
