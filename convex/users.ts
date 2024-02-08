import {
  httpAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const createUser = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      clerkId: args.clerkId,
    });
  },
});
