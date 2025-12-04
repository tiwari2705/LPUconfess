import { z } from "zod"

export const confessionSchema = z.object({
  text: z.string().min(10, "Confession must be at least 10 characters").max(5000, "Confession must be less than 5000 characters"),
  image: z.string().url().optional().or(z.literal("")),
})

export const commentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(1000, "Comment must be less than 1000 characters"),
  confessionId: z.string(),
})

export const reportSchema = z.object({
  confessionId: z.string(),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason must be less than 500 characters"),
})

