// Deployed endpoint: https://lazy-pheasant-42.deno.dev

import {
  serveListener,
  Handler,
} from "https://deno.land/std@0.116.0/http/server.ts";

// esm.sh is used to compile stripe-node to be compatible with ES modules.
import Stripe from "https://esm.sh/stripe?target=deno";

// Import Supabase client
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js@^1.31.2";

const stripe = Stripe(
  // TODO move to env var
  "sk_test_51Kfs8gAi5HDX2lYC3f7a7QYIznGO7SOA0z1MrH3hKo7jkDD7jHaocBIInUd8RRkYJpWzvfuFfw0dxqdXmCPJB70O00DKB6amN4",
  {
    // This is needed to use the Fetch API rather than relying on the Node http
    // package.
    httpClient: Stripe.createFetchHttpClient(),
    apiVersion: "2020-08-27",
  }
);

const server = Deno.listen({ port: 8000 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8000/`);

// This handler will be called for every incoming request.
const handler: Handler = async (request) => {
  const supabase = createClient(
    // Supabase API URL
    "https://ezkbryeecvynphnrwzhb.supabase.co",
    // Supabase API ANON KEY
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6a2JyeWVlY3Z5bnBobnJ3emhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc4OTM4MTksImV4cCI6MTk2MzQ2OTgxOX0.foNTSYfaSk-9ydt2LX0TJOC19nRWaKvAKTsPsOZlMpI",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { headers: { Authorization: request.headers.get("Authorization") } }
  );

  // @ts-expect-error: deno doenst like that Postgrestfilterbuilder doesn't return a promise
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
