import "dotenv/config";

export default {
  name: "Expo Stripe Payments with Supabase FUnctions",
  version: "1.0.0",
  extra: {
    // WARNING: these are included in your build. Don't expose secrets here!
    // https://reactnative.dev/docs/security#storing-sensitive-info
    EXPO_PUBLIC_SUPABASE_URL: process.env.SUPA_FUNCTION_LOCALHOST
      ? "http://localhost:54321"
      : process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPA_FUNCTION_LOCALHOST
      ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs"
      : process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
};
