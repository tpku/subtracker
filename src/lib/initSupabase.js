import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { REACT_NATIVE_SUPABASE_URL, REACT_NATIVE_SUPABASE_ANON_KEY } from "@env";

const supabase = createClient(REACT_NATIVE_SUPABASE_URL, REACT_NATIVE_SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// const supabase = createClient(
//     "https://hsspcjlmxksnfzlifbml.supabase.co",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc3BjamxteGtzbmZ6bGlmYm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MDU3NzYsImV4cCI6MjAwOTQ4MTc3Nn0.9D6HjzbKSptqMZnsBvxutFm-Vm0p0t24k85Ez_OuaAY",
//     {
//         auth: {
//             storage: AsyncStorage,
//             autoRefreshToken: true,
//             persistSession: true,
//             detectSessionInUrl: false,
//         },
//     }
// );

export default supabase;
