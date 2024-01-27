import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: { formId: v.id("forms"), content: v.string() },
  handler: async (ctx, { formId, content }) => {
    const form = await ctx.db.get(formId);

    if (!form) {
      throw new ConvexError("No form found");
    }

    // await ctx.db.patch(formId, {
    //   submissions: form.submissions + 1,
    // });

    const submission = await ctx.db.insert("submissions", {
      formId: formId,
      content: content,
    });

    return submission;
  },
});
