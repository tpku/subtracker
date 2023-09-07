import React, { useState, useEffect } from "react";
import supabase from "./src/lib/initSupabase";
import { StatusBar } from "expo-status-bar";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen.jsx/DashboardScreen";

export default function App() {
    const [session, setSession] = useState(null);
    // console.log(session);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <SafeAreaView style={styles.root}>
            {session && session.user ? <DashboardScreen session={session} /> : <LoginScreen />}
            {/* <LoginScreen /> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "orangered",
        // backgroundColor: "#EFE9F4",
    },
});
