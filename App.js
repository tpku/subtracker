import React, { useState, useEffect } from "react"
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import supabase from "./src/lib/initSupabase"
import LoginScreen from "./src/screens/LoginScreen"
import DashboardScreen from "./src/screens/DashboardScreen"
// import ProductScreen from "./src/screens/ProductScreen"
import StartScreen from "./src/screens/StartScreen"
import SignupScreen from "./src/screens/SignupScreen"
import UserAccountScreen from "./src/screens/UserAccountScreen"
import UserSettingsScreen from "./src/screens/UserSettingsScreen"
import ProductViewScreen from "./src/screens/ProductViewScreen"
import ProductEditScreen from "./src/screens/ProductEditScreen"
import ProductAddScreen from "./src/screens/ProductAddScreen"

export default function App() {
  const [session, setSession] = useState(null)
  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <NavigationContainer styles={styles.root}>
      <Stack.Navigator>
        {session && session.user ? (
          <>
            <Stack.Screen
              name="Tab"
              options={{ headerShown: false }}
              children={() => (
                <Tab.Navigator
                // screenOptions={{
                //   tabBarIconStyle: { display: "none" },
                // }}
                >
                  <Tab.Screen name="Hem" component={DashboardScreen} />
                  <Tab.Screen name="Profil" component={UserAccountScreen} />
                  <Tab.Screen
                    options={{
                      tabBarIconStyle: { display: "none" },
                      tabBarLabelStyle: { display: "none" },
                      tabBarButton: () => null,
                    }}
                    name="ProductEditScreen"
                    component={ProductEditScreen}
                  />
                  <Tab.Screen
                    options={{
                      tabBarIconStyle: { display: "none" },
                      tabBarLabelStyle: { display: "none" },
                      tabBarButton: () => null,
                    }}
                    name="ProductViewScreen"
                    component={ProductViewScreen}
                  />
                  <Tab.Screen
                    options={{
                      tabBarIconStyle: { display: "none" },
                      tabBarLabelStyle: { display: "none" },
                      tabBarButton: () => null,
                    }}
                    name="ProductAddScreen"
                    component={ProductAddScreen}
                  />
                </Tab.Navigator>
              )}
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
