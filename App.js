import React, { useState, useEffect } from "react"
// This is from the React Navigation pack:
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import supabase from "./src/lib/initSupabase"
import { StatusBar } from "expo-status-bar"
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native"

import LoginScreen from "./src/screens/LoginScreen"
import DashboardScreen from "./src/screens/DashboardScreen"
import ProductScreen from "./src/screens/ProductScreen"
import StartScreen from "./src/screens/StartScreen"
import SignupScreen from "./src/screens/SignupScreen"
import UserAccountScreen from "./src/screens/UserAccountScreen"
import UserSettingsScreen from "./src/screens/UserSettingsScreen"

export default function App() {
  const [session, setSession] = useState(null)
  // console.log(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // Creates the stack the screens will fit into:
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer styles={styles.root}>
      <Stack.Navigator
      // initialRouteName={session && session.user ? "Dashboard" : "Loginscreen"}
      // screenOptions={{ headerShown: false }}
      >
        {session && session.user ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              session={session}
              options={{ title: "The Dashboard" }}
            />
            {/* Moved these two screens inside the session. Logout now works on them! - MV */}
            <Stack.Screen name="ProductScreen" component={ProductScreen} />
            <Stack.Screen
              name="UserAccountScreen"
              component={UserAccountScreen}
            />
            {/* Added the page below to work with the profile picture - MV */}
            <Stack.Screen
              name="UserSettingsScreen"
              component={UserSettingsScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Startscreen"
              component={StartScreen}
              options={{
                title: "Startscreen. Not signed up/logged in.",
              }}
            />
            <Stack.Screen
              name="Loginscreen"
              component={LoginScreen}
              options={{ title: "Login screen - not final" }}
            />
            <Stack.Screen
              name="Signupscreen"
              component={SignupScreen}
              options={{ title: "Signup screen - not final" }}
            />
          </>
        )}
        {/* These two screens are now moved inside the session.
        <Stack.Screen name="ProductScreen" component={ProductScreen} />
        <Stack.Screen name="UserAccountScreen" component={UserAccountScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#3693CF",
    // backgroundColor: "#EFE9F4",
  },
})
