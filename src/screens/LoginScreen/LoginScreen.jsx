import React, { useState } from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions } from "react-native";

import Logo from "../../../assets/adaptive-icon.png";

import InputField from "../../components/InputField/InputField";
import CustomButton from "../../components/CustomButton/CustomButton";

const btn = {
    "1st": "PRIMARY",
    "2nd": "SECONDARY",
    "3rd": "TERTIARY",
};

const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { height } = useWindowDimensions();

    const onLoginPressed = (content) => {
        console.warn("Login pressed");
    };

    const onSignupPressed = (content) => {
        console.warn("Sign up pressed");
    };

    const onRetrievePasswordPress = (content) => {
        console.warn("Retrieve password pressed");
    };

    return (
        <View style={styles.root}>
            <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
            <InputField placeholder="Email" value={username} setValue={setUsername} />
            <InputField placeholder="Password" value={password} setValue={setPassword} isPassword />

            <CustomButton text="Login" onPress={onLoginPressed} />
            <CustomButton text="Sign up" onPress={onSignupPressed} btnType={btn["2nd"]} />
            <CustomButton text="Retrieve password" onPress={onRetrievePasswordPress} btnType={btn["3rd"]} textType={btn["3rd"]} />
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
