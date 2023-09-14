import "react-native-url-polyfill/auto"; // This solves the URL.hostname is not implemented-error. Found at: https://github.com/supabase/supabase/issues/8464
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  REACT_NATIVE_SUPABASE_URL,
  REACT_NATIVE_SUPABASE_ANON_KEY,
} from "@env";

const supabase = createClient(
  REACT_NATIVE_SUPABASE_URL,
  REACT_NATIVE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export default supabase;
