import { z } from "zod";

export const allowedValuesInputSchema = z.object({
  values: z.string().regex(/^\d+(,\d+)*$/),
});

export type AllowedValuesInput = z.infer<typeof allowedValuesInputSchema>;
