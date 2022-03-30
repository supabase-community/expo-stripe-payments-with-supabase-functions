import {
  serveListener,
  Handler,
} from "https://deno.land/std@0.116.0/http/server.ts";
import { stripe, createOrRetrieveCustomer } from "../_utils/utils.ts";

const server = Deno.listen({ port: 8000 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8000/`);

// This handler will be called for every incoming request.
const handler: Handler = async (req) => {
  const authHeader = req.headers.get("Authorization")!;
  const customer = await createOrRetrieveCustomer(authHeader);
  return new Response(JSON.stringify(customer), { status: 200 });

  if (error) return new Response(JSON.stringify(error), { status: 200 });
  // const customer = data.stripe_customer_id;

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
};

await serveListener(server, handler);
