import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

