# Expo Stripe Payments with Supabase Functions

This is a Expo React Native Supabase example app, showing how to process payments with Supabase Functions for authenticated customers.

![Demo gif](./demo.gif)

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
  - run `supabase login`
  - Input your token when prompted
- Link your project
  - Within your project root run `supabase link --ref your-project-ref`

### Develop locally

- Run `supabase start` (make sure your Docker daemon is running.)
- Run `supabase functions serve --env-file .env payment-sheet`
  - NOTE: no need to specify `SUPABASE_URL` and `SUPABASE_ANON_KEY` as they are automatically supplied for you from the linked project.
- Run the Expo app in a separate terminal window:
  - `cd app`
  - `yarn`
  - `yarn start` or `yarn ios` or `yarn android`
- Make some test moneys 💰🧧💵
- Stop local development
  - Kill the "supabase functions serve watcher" (ctrl + c)
  - Run `supabase stop` to stop the Docker containers.

### Deploy

- Set up your secrets
  - Run `supabase secrets set --from-stdin < .env` to set the env vars from your `.env` file.
  - You can run `supabase secrets list` to check that it worked and also to see what other env vars are set by default.
- Deploy the function
  - Within your project root run `supabase functions deploy payment-sheet`
- In youre [`./app/.env`](./app/.env) file remove the `SUPA_FUNCTION_LOCALHOST` variable and restart your Expo app.

## 👁⚡️👁

\o/ That's it, you can now invoke your Supabase Function via the [`supabase-js`](https://supabase.com/docs/reference/javascript/invoke) and [`supabase-dart`](https://supabase.com/docs/reference/dart/invoke) client libraries. (More client libraries coming soon. Check the [supabase-community](https://github.com/supabase-community#client-libraries) org for details).

For more info on Supabase Functions, check out the [docs](https://supabase.com/docs/guides/functions) and the [examples](https://github.com/supabase/supabase/tree/master/examples/edge-functions).
