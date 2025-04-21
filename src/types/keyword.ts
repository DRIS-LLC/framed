import { z } from "zod";

export const KeywordSchema = z.object({
  keyword: z.string(),
});

export type Keyword = z.infer<typeof KeywordSchema>;
