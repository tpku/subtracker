import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// This solves the URL.hostname is not implemented-error. Found at: https://github.com/supabase/supabase/issues/8464
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

import Logo from "../../../assets/adaptive-icon.png";

import InputField from "../../components/InputField/InputField";
import CustomButton from "../../components/CustomButton/CustomButton";
import Spinner from "react-native-loading-spinner-overlay";
// const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Remove supabase_url and key before deployment
const supabase = createClient(
  "https://hsspcjlmxksnfzlifbml.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc3BjamxteGtzbmZ6bGlmYm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MDU3NzYsImV4cCI6MjAwOTQ4MTc3Nn0.9D6HjzbKSptqMZnsBvxutFm-Vm0p0t24k85Ez_OuaAY",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

const btn = {
  "1st": "PRIMARY",
  "2nd": "SECONDARY",
  "3rd": "TERTIARY",
};

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState("loggedOut");

    const { height } = useWindowDimensions();

    const onLoginPressed = async (email, password) => {
        console.log(email);
        console.log(password);
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        setIsLoggedIn("loggedIn");

        if (data) console.log(data.user);
        if (error) Alert.alert(error.message);
        setLoading(false);
    };

    const onSignupPressed = (content) => {
        console.warn("Sign up pressed");
    };

    const onRetrievePasswordPress = (content) => {
        console.warn("Retrieve password pressed");
    };

    const onLogoutPressed = async () => {
        const { error } = await supabase.auth.signOut();
        setIsLoggedIn("loggedOut");

        console.warn("Retrieve password pressed");
        if (error) Alert.alert(error.message);
    };

    return (
        <View style={styles.root}>
            <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
            <InputField placeholder="Email" value={email} setValue={setEmail} />
            <InputField placeholder="Password" value={password} setValue={setPassword} isPassword />

            <CustomButton text="Login" onPress={() => onLoginPressed(email, password)} />
            <CustomButton text="Sign up" onPress={onSignupPressed} btnType={btn["2nd"]} />
            <CustomButton text="Retrieve password" onPress={onRetrievePasswordPress} btnType={btn["3rd"]} textType={btn["3rd"]} />
            <CustomButton text="Logout" onPress={onLogoutPressed} btnType={btn["3rd"]} textType={btn["3rd"]} isLoggedIn={isLoggedIn} />
            <View>
                <Spinner visible={loading} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxHeight: 300,
  },
});

export default LoginScreen;
