import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";

export default function App() {
    return (
        <SafeAreaView style={styles.root}>
            <LoginScreen />
        </SafeAreaView>
        // <View style={styles.container}>
        //     <Text style={styles.text}>Subtracker 2000</Text>
        //     <Text style={styles.text}>Welcome to this application fetching and handling streaming data.</Text>
        //     <StatusBar style="auto" />
        // </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "orangered",
    },
});

// const styles = StyleSheet.create({
//     container: {
//         height: 200 + "vh",
//         padding: 8,
//         flex: 1,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "start",
//     },
//     text: {
//         color: "orangered",
//         alignItems: "start",
//         fontSize: 20,
//     },
// });
