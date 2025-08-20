import { z } from 'zod';

export const createBookingSchema = z.object({
  villa: z.string().min(1, "Villa ID is required"),

  checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Check-in date must be valid",
  }),

  checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Check-out date must be valid",
  }),

  guests: z.object({
    adults: z.number().min(1, "At least 1 adult is required"),
    children: z.number().min(0).optional().default(0),
    pets: z.number().min(0).optional().default(0),
  }),

  pricePerNightAtBooking: z.number().refine((val) => val > 0, {
    message: "Price per night must be greater than 0",
  }),

  nights: z.number().min(1, "Number of nights must be at least 1"),

  discountPercentApplied: z.number().min(0).max(100).optional(),

  couponCode: z.string().optional(),

  paymentMethod: z.enum(["Credit Card", "UPI", "Paypal", "Cash"], {
    required_error: "Payment method is required"
  }).optional(),

  additionalCharges: z.number().min(0)
})
.refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
  message: "Check-out must be after check-in",
  path: ["checkOut"]
});
