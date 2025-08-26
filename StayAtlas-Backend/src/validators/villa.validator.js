import { z } from "zod";

const AddressSchema = z.object({
  street: z.string().min(1),
  landmark: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zipcode: z.string().min(1),
});

export const OwnerVillaSchema = z.object({
  villaOwner:z.string().min(1),
  villaName: z.string().min(1),
  description: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .optional(),
  email: z.string().email().optional(),
  numberOfRooms: z.string().optional(),
  guestCapacity: z.coerce.number().min(1, { message: "Guest capacity must be at least 1" }).optional(),
  images: z.array(z.string()).min(2),
  address: AddressSchema,
  amenities: z.array(z.string()).optional(),
  propertyType: z.string().optional(),
});

// For owner update — all fields optional
export const UpdateOwnerVillaSchema = OwnerVillaSchema.partial();

const PricingZodSchema = z.object({
  weekday: z.number().min(1, { message: "Weekday price must be 1 or more" }),
  weekend: z.number().min(1, { message: "Weekend price must be 1 or more" }),
  setBy: z.enum(["admin", "owner"]).default("owner"),
  currency: z.string().default("INR")
});

export const AdminVillaSchema = OwnerVillaSchema.extend({
  pricePerNightBoth: PricingZodSchema,
  category: z.array(z.string()).optional(),
  availability: z.array(
    z.object({
      start: z.string().or(z.date()),
      end: z.string().or(z.date()),
      isAvailable: z.boolean().optional(),
    })
  ).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  promotionText: z.string().optional(),
  isExclusive: z.boolean().optional(),
  approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
  approvalComment: z.string().optional(),
    rooms: z
    .array(
      z.object({
        name: z.string().optional(),
        floor: z.string().optional(),
        guests: z.string().optional(),
        equipped: z.string().optional(),
        bathroom: z.string().optional(),
        image: z.string().optional(),
        bedType: z.string().optional(),
      })
    )
    .optional(),

  realMoments: z
    .array(
      z.object({
        video: z.string().optional(),
        name: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .optional(),
});

// For admin update — all fields optional
export const UpdateAdminVillaSchema = AdminVillaSchema.partial();