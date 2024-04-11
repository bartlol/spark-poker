import { z } from "zod";

export const newPlayerSchema = z.object({
  name: z.string().min(3).max(10),
});

export type NewPlayerInput = z.infer<typeof newPlayerSchema>;
