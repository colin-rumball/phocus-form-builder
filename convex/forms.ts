import { api } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getClerkId } from "./utils";
import { z } from "zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation } from "convex-helpers/server/zod";
import { formSchemaInner } from "./zodSchemas/form";

const zMutation = zCustomMutation(mutation, NoOp);

export const list = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await getClerkId(ctx);

    if (!clerkId) {
      // TODO: convex error handling
      // throw new ConvexError("you must be logged in to create a form");
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("No user found");
    }

    const forms = await ctx.db
      .query("forms")
      .withIndex("by_authorId", (q) => q.eq("authorId", user._id))
      .collect();

    return forms;
  },
});

export const create = zMutation({
  args: formSchemaInner,
  handler: async (ctx, { name, description }) => {
    const clerkId = await getClerkId(ctx);

    if (!clerkId) {
      // TODO: error handling
      // throw new ConvexError("you must be logged in to create a form");
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("No user found");
    }

    const form = await ctx.db.insert("forms", {
      authorId: user?._id,
      name: name,
      description: description ?? "",
      published: false,
      visits: 0,
      submissions: 0,
      content: "",
      shareURL: "",
    });

    if (!form) {
      throw new ConvexError("Failed to create form");
    }

    return form;
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await getClerkId(ctx);

    if (!clerkId) {
      // TODO: error handling
      // throw new ConvexError("you must be logged in to view stats");
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("No user found");
    }

    const { _id } = user;

    const forms = await ctx.db
      .query("forms")
      .withIndex("by_authorId", (q) => q.eq("authorId", _id))
      .collect();

    const { visits, submissions } = forms
      .map((form) => ({
        visits: form.visits,
        submissions: form.submissions,
      }))
      .reduce(
        (acc, { visits, submissions }) => ({
          visits: acc.visits + visits,
          submissions: acc.submissions + submissions,
        }),
        { visits: 0, submissions: 0 },
      );

    let submissionRate = 0;
    if (visits > 0) {
      submissionRate = submissions / visits;
    } else {
      submissionRate = 0;
    }

    const bounceRate = 100 - submissionRate;

    return {
      visits,
      submissions,
      submissionRate,
      bounceRate,
    };
  },
});
