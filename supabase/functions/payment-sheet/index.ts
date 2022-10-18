import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { stripe } from "../_utils/stripe.ts";
import { createOrRetrieveCustomer } from "../_utils/supabase.ts";

console.log("payment-sheet handler up and running!");
serve(async (req) => {
  try {
    // Get the authorization header from the request.
    // When you invoke the function via the client library it will automatically pass the authenticated user's JWT.
    const authHeader = req.headers.get("Authorization")!;

    // Retrieve the logged in user's Stripe customer ID or create a new customer object for them.
    // See ../_utils/supabase.ts for the implementation.
    const customer = await createOrRetrieveCustomer(authHeader);

    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2020-08-27" }
    );
    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      customer: customer,
    });

    // Return the customer details as well as teh Stripe publishable key which we have set in our secrets.
    const res = {
      stripe_pk: Deno.env.get("STRIPE_PUBLISHABLE_KEY"),
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
    };
    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
