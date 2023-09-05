import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";

export default function App() {
    return (
        <SafeAreaView style={styles.root}>
            <LoginScreen />
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
