// if (!process.env.SUPABASE_URL) {
//     console.log("constants.js", "Make sure you have a `.env` file to populate your variables.");
// }

// export const SUPABASE_URL = process.env.REACT_NATIVE_SUPABASE_URL;
// export const SUPABASE_ANON_KEY = process.env.REACT_NATIVE_SUPABASE_ANON_KEY;

import OneSignal from "react-native-onesignal"

import { ONE_SIGNAL_APP_ID } from "@env"
OneSignal.setAppId(ONE_SIGNAL_APP_ID)
