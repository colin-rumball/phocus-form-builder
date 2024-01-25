// route handlers are usually use for handling web hooks, or some external request, maybe next auth

export async function GET(request: Request) {
  // helper functions headers() and cookies()
  return new Response("Hello world!");
}

// useOptimistic, useFormState, useFormStatus
// suspense
// params and search params
