import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://kcjdvgtuwbabezqeddhh.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_ckK-7IS_0YeYon9MilR7nw_gYEqLEbZ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
