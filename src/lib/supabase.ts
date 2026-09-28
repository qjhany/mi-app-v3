import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://bcokihqmyfbdbbekpxva.supabase.co";

const supabaseAnonKey = "sb_publishable_7WMbFdYaw6oDtduCl4GgDQ_ehNGTKgh";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);