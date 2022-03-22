import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://ezkbryeecvynphnrwzhb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6a2JyeWVlY3Z5bnBobnJ3emhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc4OTM4MTksImV4cCI6MTk2MzQ2OTgxOX0.foNTSYfaSk-9ydt2LX0TJOC19nRWaKvAKTsPsOZlMpI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage as any,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});
