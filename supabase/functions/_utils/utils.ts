// Import Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.1";
// esm.sh is used to compile stripe-node to be compatible with ES modules.
import Stripe from "https://esm.sh/stripe?target=deno&no-check";
import { JwtUser, Customer } from "./types.ts";

export const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2020-08-27",
});

const supabaseAdmin = createClient(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL") ?? "",
  // Supabase API SERVICE ROLE KEY - env var exported by default.
  // WARNING: The service role key has admin priviliges and should only be used in secure server environments!
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const jwtDecoder = (jwt: string): JwtUser =>
  JSON.parse(atob(jwt.split(".")[1]));

export const createOrRetrieveCustomer = async (authHeader: string) => {
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { headers: { Authorization: authHeader } }
  );

  // Check if we already have a customer
  const { data, error } = await supabaseClient
    .from<Customer>("customers")
    .select("*");
  console.log(data?.length, data, error);
  if (error) throw error;
  if (data?.length === 1) {
    // Exactly one customer found, return it
    return data[0].stripe_customer_id;
  }
  if (data?.length === 0) {
    // No customer yet, let's create it
    const jwt = authHeader.split("Bearer ")[1];
    const jwtUser = jwtDecoder(jwt);
    const { sub: uid, email } = jwtUser;
    // Create customer object in Stripe
    const customer = await stripe.customers.create({
      email,
      metadata: { uid },
    });
    console.log(`New customer "${customer.id}" created for user "${uid}"`);
    // Insert new customer into DB
    await supabaseAdmin
      .from<Customer>("customers")
      .insert({ id: uid, stripe_customer_id: customer.id })
      .throwOnError();
    return customer.id;
  } else throw new Error(`Unexpected count of customer rows: ${data?.length}`);
};
