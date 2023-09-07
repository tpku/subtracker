import React, { useEffect, useState } from "react";
import supabase from "../../lib/initSupabase";
import { View, Text, Alert, StyleSheet } from "react-native";

import CustomButton from "../../components/CustomButton/CustomButton";
import Spinner from "react-native-loading-spinner-overlay";

const DashboardScreen = (session) => {
    const [loading, setLoading] = useState(false);
    const [authUser, setAuthUser] = useState([]);

    useEffect(() => {
        const sessionUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setAuthUser(user);
        };
        sessionUser();
    }, []);

    console.log(authUser);

    const getUsers = async () => {
        setLoading(true);
        const { data: users, error } = await supabase.from("signed_up_users").select("email");
        if (users) console.log(users);

        if (error) Alert.alert(error.message);
        setLoading(false);
    };

    const onLogoutPressed = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        window.localStorage.clear();

        setIsLoggedIn("loggedOut");
        console.warn("Logout pressed");
        if (error) Alert.alert(error.message);
        setLoading(false);
    };

    return (
        <View style={styles.root}>
            <Text style={styles.heading}>Welcome user: {authUser.email}</Text>
            <CustomButton text="Get users" onPress={() => getUsers()} />
            <CustomButton text="Logout" onPress={onLogoutPressed} btnType={"SECONDARY"} isLoggedIn={"loggedIn"} />

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
    heading: {
        flex: 1,
        textAlign: "center",
        fontSize: 10,
    },
});

export default DashboardScreen;
