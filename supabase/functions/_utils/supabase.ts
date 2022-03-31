import { Customer } from "./types.ts";
import { stripe } from "./stripe.ts";
import { jwtDecoder } from "./utils.ts";
// Import Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.1";

const supabaseAdmin = createClient(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL") ?? "",
  // Supabase API SERVICE ROLE KEY - env var exported by default.
  // WARNING: The service role key has admin priviliges and should only be used in secure server environments!
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

export const createOrRetrieveCustomer = async (authHeader: string) => {
  // Create a Supabase client with the Auth context of the logged in user.
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { headers: { Authorization: authHeader } }
  );

  // Check if the user already has a Stripe customer ID in the Database.
  const { data, error } = await supabaseClient
    .from<Customer>("customers")
    .select("*");
  console.log(data?.length, data, error);
  if (error) throw error;
  if (data?.length === 1) {
    // Exactly one customer found, return it.
    const customer = data[0].stripe_customer_id;
    console.log(`Found customer id: ${customer}`);
    return customer;
  }
  if (data?.length === 0) {
    // No customer yet, let's create it.
    const jwt = authHeader.split("Bearer ")[1];
    const jwtUser = jwtDecoder(jwt);
    const { sub: uid, email } = jwtUser;
    // Create customer object in Stripe.
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
