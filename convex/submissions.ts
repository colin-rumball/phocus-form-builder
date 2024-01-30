import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: { formId: v.id("forms"), content: v.string() },
  handler: async (ctx, { formId, content }) => {
    const form = await ctx.db.get(formId);

    if (!form) {
      throw new ConvexError("No form found");
    }

    await ctx.db.patch(formId, {
      submissions: form.submissions + 1,
    });

    const submission = await ctx.db.insert("submissions", {
      formId: formId,
      content: content,
    });

    return submission;
  },
});

export const list = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, { formId }) => {
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
      throw new ConvexError("No user found");
    }

    const form = await ctx.db.get(formId);

    if (!form) {
      throw new ConvexError("No form found");
    }

    if (form.authorId !== user._id) {
      throw new ConvexError(
        "You do not have permission to view this forms submissions",
      );
    }

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_formId", (q) => q.eq("formId", formId))
      .collect();

    return submissions;
  },
});
