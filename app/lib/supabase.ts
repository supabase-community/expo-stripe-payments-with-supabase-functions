import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://cqhkqitntobmsugnbkjr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaGtxaXRudG9ibXN1Z25ia2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDgyMDMxNDQsImV4cCI6MTk2Mzc3OTE0NH0.QmrUf2J_cGvhilFI7DvrX0re4qb_STaQKcOw83P-KH0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage as any,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});
