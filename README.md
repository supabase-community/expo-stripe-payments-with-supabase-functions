# Expo Stripe Payments with Supabase Functions

This is a Expo React Native Supabase example app, showing how to process payments with Supabase Functions for authenticated customers.

## Setup

### Supabase Functions

Supabase Functions are written in TypeScript, run via Deno, and deployed with the Supabase CLI. Please [download](https://github.com/supabase/cli#install-the-cli) the latest version of the Supabase CLI, or [upgrade](https://github.com/supabase/cli#install-the-cli) it if you have it already installed.

- Generate access token and log into CLI
  - Navigate to https://app.supabase.io/account/tokens
  - Generate New Token
  - Copy newly created token
  - run `supabase login sbp_xxxx`
- Link your project
  - Within your project root run `supabase link --ref your-project-ref`

### Expo app

- `cd app`
- `yarn`
- `cp .env.example .env`
- `yarn start` or `yarn ios` or `yarn android`
