import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { type UserJSON } from "@clerk/nextjs/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    // Get the headers
    const headerPayload = request.headers;
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        },
      });

      if (!result?.data) {
        return new Response("Error occurred", {
          status: 400,
        });
      }

      const data = result.data as UserJSON;
      let email = "";
      if (data.email_addresses.length > 0 && data.email_addresses[0]) {
        email = data.email_addresses[0].email_address;
      }

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            clerkId: data.id,
            email: email,
            name: data.first_name || "Anonymous",
          });
          break;
      }

      return new Response("Success", {
        status: 200,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", {
        status: 400,
      });
    }
  }),
});

// Define additional routes
// http.route({
//   path: "/getMessagesByAuthor",
//   method: "GET",
//   handler: getByAuthor,
// });

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
