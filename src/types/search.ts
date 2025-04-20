import { z } from "zod";

export const searchQuerySchema = z.object({
  id: z.string(),
  query: z.string(),
  userId: z.string(),
  results: z.array(z.string()),
  createdAt: z.date(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
