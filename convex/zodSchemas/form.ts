import { z } from "zod";

export const createFormSchemaInner = {
  name: z.string().min(4),
  description: z.string().optional(),
};

export const createFormSchemaObject = z.object(createFormSchemaInner);

export type CreateFormSchemaType = typeof createFormSchemaObject;
