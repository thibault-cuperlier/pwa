import { createClient } from "@supabase/supabase-js";

// 🔹 Mets tes infos Supabase ici
const SUPABASE_URL = "https://mdcvsmfrlaakygvccxee.supabase.co"; // Remplace par ton URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY3ZzbWZybGFha3lndmNjeGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxOTYxNjgsImV4cCI6MjA1ODc3MjE2OH0.7tmOFAwsZhB0Xr9yifM71bhnq7OEWMt_FUMy32NbwxQ"; // Remplace par ta clé anonyme

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
