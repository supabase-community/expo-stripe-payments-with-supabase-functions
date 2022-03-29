import {
  serveListener,
  Handler,
} from "https://deno.land/std@0.116.0/http/server.ts";
import { stripe } from "../_utils/utils.ts";
// Import Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.1";

const server = Deno.listen({ port: 8000 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8000/`);

// This handler will be called for every incoming request.
const handler: Handler = async (req) => {
  const supabase = createClient(
    // Supabase API URL
    "https://cqhkqitntobmsugnbkjr.supabase.co",
    // Supabase API ANON KEY
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaGtxaXRudG9ibXN1Z25ia2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDgyMDMxNDQsImV4cCI6MTk2Mzc3OTE0NH0.QmrUf2J_cGvhilFI7DvrX0re4qb_STaQKcOw83P-KH0",
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
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer,
  };

  return new Response(JSON.stringify(res), { status: 200 });
};

await serveListener(server, handler);
