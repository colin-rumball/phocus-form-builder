import { api } from "./_generated/api";
import { query, mutation, internalQuery } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { getClerkId, getUser } from "./utils";
import { z } from "zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation } from "convex-helpers/server/zod";

const zMutation = zCustomMutation(mutation, NoOp);

export const update = mutation({
  args: {
    id: v.id("forms"),
    data: v.object({
      published: v.optional(v.boolean()),
      name: v.optional(v.string()),
      content: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, data }) => {
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

    const form = await ctx.db.get(id);

    if (!form) {
      throw new ConvexError("No form found");
    }

    if (form.authorId !== user._id) {
      throw new ConvexError("You do not have permission to view this form");
    }

    const updatedForm = await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return updatedForm;
  },
});

export const get = query({
  args: { id: v.id("forms") },
  handler: async (ctx, { id }) => {
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

    const form = await ctx.db.get(id);

    if (!form) {
      throw new ConvexError("No form found");
    }

    if (form.authorId !== user._id) {
      throw new ConvexError("You do not have permission to view this form");
    }

    return form;
  },
});

export const getPublicContent = query({
  args: { id: v.id("forms") },
  handler: async (ctx, { id }) => {
    const form = await ctx.db.get(id);

    if (!form) {
      throw new ConvexError("No form found");
    }

    if (!form.published) {
      throw new ConvexError("Form is not published");
    }

    return form.content;
  },
});

export const incrementViews = mutation({
  args: { id: v.id("forms") },
  handler: async (ctx, { id }) => {
    const form = await ctx.db.get(id);

    if (!form) {
      throw new ConvexError("No form found");
    }

    await ctx.db.patch(id, {
      visits: form.visits + 1,
    });

    return true;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const clerkId = userIdentity?.subject;

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
      // throw new ConvexError("No user found");
      return null;
    }

    const forms = await ctx.db
      .query("forms")
      .withIndex("by_authorId", (q) => q.eq("authorId", user._id))
      .collect();

    return forms;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
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
      published: false,
      visits: 0,
      submissions: 0,
      content: "",
      shareURL: "",
      updatedAt: Date.now(),
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

export const deleteForm = mutation({
  args: { id: v.id("forms") },
  handler: async (ctx, { id }) => {
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

    const form = await ctx.db.get(id);

    if (!form) {
      throw new ConvexError("No form found");
    }

    if (form.authorId !== user._id) {
      throw new ConvexError("You do not have permission to delete this form");
    }

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_formId", (q) => q.eq("formId", id))
      .collect();

    await Promise.all(
      submissions.map(async (submission) => {
        await ctx.db.delete(submission._id);
      }),
    );

    await ctx.db.delete(id);

    return true;
  },
});
