import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { stripe, createOrRetrieveCustomer } from "../_utils/utils.ts";

console.log("payment-sheet handler up and running!");
serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization")!;
    const customer = await createOrRetrieveCustomer(authHeader);
    console.log("createOrRetrieveCustomer", customer);
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
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }
});
