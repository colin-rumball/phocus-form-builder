"use node";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { internalAction } from "./_generated/server";
// import { type WebhookEvent } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";
import { Webhook } from "svix";

export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    const wh = new Webhook(process.env.WEBHOOK_SECRET!);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
});
