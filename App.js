import React, { useState, useEffect, useRef } from "react"
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  Linking,
  useWindowDimensions,
  Image,
} from "react-native"
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
// import UserSettingsScreen from "./src/screens/UserSettingsScreen"
import ProductViewScreen from "./src/screens/ProductViewScreen"
import ProductEditScreen from "./src/screens/ProductEditScreen"
import ProductAddScreen from "./src/screens/ProductAddScreen"
import tabBarIconHome from "./assets/icons/home1.png"
import tabBarIconProfile from "./assets/icons/group.png"
import SubeeLogo from "./assets/logos/Subee_small.png"

// This part concerns expo-notifications -MV --->

import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { EXPO_PROJECT_ID } from "@env"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

// <--- --- ---|

export default function App() {
  // This part concerns expo-notifications -MV --->

  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()
  const { height, width } = useWindowDimensions()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  // <--- --- ---|

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
    <NavigationContainer
      styles={styles.root}
      /* FOLLOWING SHOULD PROBABLY BE IMPORTED AS A PROP(S) ---> */ linking={{
        config: {
          // Configuration for linking
        },
        async getInitialURL() {
          // First, you may want to do the default deep link handling
          // Check if app was opened from a deep link
          const url = await Linking.getInitialURL()

          if (url != null) {
            return url
          }

          // Handle URL from expo push notifications
          const response =
            await Notifications.getLastNotificationResponseAsync()

          return response?.notification.request.content.data.url
        },
        subscribe(listener) {
          const onReceiveURL = ({ url }) => listener(url)

          // Listen to incoming links from deep linking
          const eventListenerSubscription = Linking.addEventListener(
            "url",
            onReceiveURL,
          )

          // Listen to expo push notifications
          const subscription =
            Notifications.addNotificationResponseReceivedListener(
              (response) => {
                const url = response.notification.request.content.data.url

                // Any custom logic to see whether the URL needs to be handled
                //...

                // Let React Navigation handle the URL
                listener(url)
              },
            )

          return () => {
            // Clean up the event listeners
            eventListenerSubscription.remove()
            subscription.remove()
          }
        },
      }} /* <--- ...BE IMPORTED AS A PROP(S) ---| */
    >
      <Stack.Navigator
        screenOptions={{
          headerTitle: () =>
            session ? (
              <Image source={SubeeLogo} style={[{ width: 180, height: 70 }]} />
            ) : null,
        }}>
        {session && session.user ? (
          <>
            <Stack.Screen
              name="Tab"
              options={{ headerShown: false }}
              children={() => (
                <Tab.Navigator
                  screenOptions={{
                    tabBarStyle: {
                      height: 85,
                      backgroundColor: "#C0C0C0",
                    },
                    headerTitle: () => (
                      <Image
                        source={SubeeLogo}
                        style={[{ width: 180, height: 70 }]}
                      />
                    ),
                  }}>
                  <Tab.Screen
                    name="Hem"
                    component={DashboardScreen}
                    options={{
                      headerStyle: {
                        backgroundColor: "#3693CF",
                        height: 105,
                      },
                      tabBarLabelStyle: { display: "none" },
                      tabBarIconStyle: {
                        left: -48,
                      },
                      tabBarIcon: () => {
                        return (
                          <Image
                            style={{ width: 42, height: 45, padding: 5 }}
                            source={{
                              uri: tabBarIconHome,
                            }}
                          />
                        )
                      },
                    }}
                  />
                  <Tab.Screen
                    name="Profil"
                    component={UserAccountScreen}
                    options={{
                      headerStyle: {
                        backgroundColor: "#3693CF",
                        height: 105,
                      },
                      tabBarLabelStyle: { display: "none" },
                      tabBarIconStyle: {
                        right: -48,
                      },
                      tabBarIcon: () => {
                        return (
                          <Image
                            style={{ width: 42, height: 45, padding: 5 }}
                            source={{
                              uri: tabBarIconProfile,
                            }}
                          />
                        )
                      },
                    }}
                  />
                  <Tab.Screen
                    options={{
                      headerStyle: {
                        backgroundColor: "#3693CF",
                        height: 105,
                      },
                      tabBarIconStyle: { display: "none" },
                      tabBarLabelStyle: { display: "none" },
                      tabBarButton: () => null,
                    }}
                    name="ProductEditScreen"
                    component={ProductEditScreen}
                  />
                  <Tab.Screen
                    options={{
                      headerStyle: {
                        backgroundColor: "#3693CF",
                        height: 105,
                      },
                      tabBarIconStyle: { display: "none" },
                      tabBarLabelStyle: { display: "none" },
                      tabBarButton: () => null,
                    }}
                    name="ProductViewScreen"
                    component={ProductViewScreen}
                  />
                  <Tab.Screen
                    options={{
                      headerStyle: {
                        backgroundColor: "#3693CF",
                        height: 105,
                      },
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
                headerShown: false,
                title: "Startscreen. Not signed up/logged in.",
              }}
            />
            <Stack.Screen
              name="Loginscreen"
              component={LoginScreen}
              options={{
                headerShown: false,
                title: "Login screen - not final",
              }}
            />
            <Stack.Screen
              name="Signupscreen"
              component={SignupScreen}
              options={{
                headerShown: false,
                title: "Signup screen - not final",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// This part concerns expo-notifications -MV --->

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  })
}

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!")
      return
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID, // Expo project Id goes here? -MV
      })
    ).data
    console.log(token)
  } else {
    alert("Must use physical device for Push Notifications")
  }

  return token
}

// <--- --- ---|

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#3693CF",
    // backgroundColor: "#EFE9F4",
  },
})
