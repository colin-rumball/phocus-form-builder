import { defineSchema, defineTable } from "convex/server";
import { v, PropertyValidators } from "convex/values";
import {} from "convex-helpers/server/zod";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  }).index("by_clerkId", ["clerkId"]),
  forms: defineTable({
    authorId: v.id("users"),
    published: v.boolean(),
    name: v.string(),
    description: v.string(),
    content: v.string(), //TODO: string?
    visits: v.number(),
    submissions: v.number(),
    shareURL: v.string(),
  }).index("by_authorId", ["authorId"]),
  formSubmissions: defineTable({
    formId: v.id("forms"),
    submissionAuthorId: v.id("users"),
    content: v.string(), //TODO: string?
  }).index("by_formId", ["formId"]),
});
