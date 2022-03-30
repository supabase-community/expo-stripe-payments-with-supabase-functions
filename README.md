# Expo Stripe Payments with Supabase Functions

This is a Expo React Native Supabase example app, showing how to process payments with Supabase Functions for authenticated customers.

## Setup

### Create new Supabase project

- [Create a new Supabase project](https://app.supabase.io/)
- Navigate to the [Auth settings](https://app.supabase.io/project/_/auth/settings) and turn off the toggle next to "Enable email confirmations". (Note: this is only for testing. In production please enable this setting!)
- Navigate to the [SQL Editor](https://app.supabase.io/project/_/sql) and run the SQL from the [schema.sql](./schema.sql) file.

### Setup env vars

- Set up env vars for Supabase Functions:
  - `cp .env.example .env`
  - Fill in your Stripe API keys from https://stripe.com/docs/development/quickstart#api-keys
- Set up env vars for the Expo app:
  - `cp app/.env.example app/.env`
  - Fill in your _public_ Supabase keys from https://app.supabase.io/project/_/settings/api

### Supabase Functions

Supabase Functions are written in TypeScript, run via Deno, and deployed with the Supabase CLI. Please [download](https://github.com/supabase/cli#install-the-cli) the latest version of the Supabase CLI, or [upgrade](https://github.com/supabase/cli#install-the-cli) it if you have it already installed.

- Generate access token and log in to CLI
  - Navigate to https://app.supabase.io/account/tokens
  - Click "Generate New Token"
  - Copy newly created token
  - run `supabase login sbp_xxxx`
- Link your project
  - Within your project root run `supabase link --ref your-project-ref`

### Develop locally

- Run `supabase functions serve --env-file .env payment-sheet`
  - NOTE: no need to specify `SUPABASE_URL` and `SUPABASE_ANON_KEY` as they are automatically supplied for you from the linked project.
- Run the Expo app:
  - `cd app`
  - `yarn`
  - `yarn start` or `yarn ios` or `yarn android`
- Start Stripe webhook forwarding (TODO)

### Deploy

- Set up your secrets
  - Run `supabase secrets set --from-stdin < .env` to set the env vars from your `.env` file.
  - You can run `supabase secrets list` to check that it worked and also to see what other env vars are set by default.
- Deploy the function
  - Within your project root run `supabase functions deploy payment-sheet`

## 👁⚡️👁

// TODO add docs links

\o/ That's it, you can now invoke your Supabase Function via the [`supabase-js`]() and [`supabase-dart`]() client libraries. (More client libraries coming soon. Check the [supabase-community](https://github.com/supabase-community#client-libraries) org for details).

For more info on Supabase Functions, check out the [docs]() and the [examples]().
