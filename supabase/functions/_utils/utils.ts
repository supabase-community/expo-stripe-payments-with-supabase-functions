// esm.sh is used to compile stripe-node to be compatible with ES modules.
import Stripe from "https://esm.sh/stripe?target=deno&no-check";

export const stripe = Stripe(
  // TODO move to env var
  "sk_test_51Kfs8gAi5HDX2lYC3f7a7QYIznGO7SOA0z1MrH3hKo7jkDD7jHaocBIInUd8RRkYJpWzvfuFfw0dxqdXmCPJB70O00DKB6amN4",
  {
    // This is needed to use the Fetch API rather than relying on the Node http
    // package.
    httpClient: Stripe.createFetchHttpClient(),
    apiVersion: "2020-08-27",
  }
);
