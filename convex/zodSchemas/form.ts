import { z } from "zod";

export const formSchemaInner = {
  name: z.string().min(4),
  description: z.string().optional(),
};

export const formSchemaObject = z.object(formSchemaInner);

export type FormSchemaType = typeof formSchemaObject;
