import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: move to env vars
const supabaseUrl = "https://gvkuljvaukfrwmrythfi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2a3VsanZhdWtmcndtcnl0aGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDg1NTA4MjQsImV4cCI6MTk2NDEyNjgyNH0.SJpObtyvXNXiVXFBtNED8K7dry5pnaHN7tswyYGQU00";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage as any,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});
