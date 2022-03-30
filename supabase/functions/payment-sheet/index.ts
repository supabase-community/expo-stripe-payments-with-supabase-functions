import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { stripe } from "../_utils/utils.ts";
// Import Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.1";

// This handler will be called for every incoming request.
console.log("payment-sheet handler up and running!");
serve(async (req) => {
  console.log("Request received", req);
  const supabase = createClient(
    // Supabase API URL - env var exported by default when deployed.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default when deployed.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { headers: { Authorization: req.headers.get("Authorization") ?? "" } }
  );

  const { data, error } = await supabase.from("customers").select("*").single();
  console.log(data, error);
  if (error) return new Response(JSON.stringify(error), { status: 200 });
  const customer = data.stripe_customer_id;

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
    customer: customer,
  });
  const res = {
    stripe_pk: Deno.env.get("STRIPE_PUBLISHABLE_KEY"),
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer,
  };

  return new Response(JSON.stringify(res), { status: 200 });
});
