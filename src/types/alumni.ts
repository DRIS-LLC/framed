import { KeywordSchema } from "@/types/keyword";
import { z } from "zod";

export const AlumniSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  linkedinUrl: z.string(),
  bio: z.string().nullable().optional(),
  skills: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  experience: z.string().nullable().optional(),
  keywords: z.array(KeywordSchema),
  schoolId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AlumniScrapeSchema = AlumniSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  schoolId: true,
  keywords: true,
  linkedinUrl: true,
});

export const AlumniDetailSchema = AlumniSchema.extend({
  name: z.string(),
  linkedinUrl: z.string(),
  headline: z.string(),
  location: z.string(),
  experience: z.string(),
  description: z.string(),
});

export type Alumni = z.infer<typeof AlumniSchema>;
export type AlumniScrape = z.infer<typeof AlumniScrapeSchema>;
export type AlumniDetail = z.infer<typeof AlumniDetailSchema>;
