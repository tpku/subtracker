import React, { useState } from "react"
import supabase from "../../lib/initSupabase"
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Pressable,
} from "react-native"

import Logo from "../../../assets/logos/Subee.png"
import InputFieldRound from "../../components/InputFieldRound"
import CustomButton from "../../components/CustomButton"
import Spinner from "react-native-loading-spinner-overlay"

const btn = {
  "1st": "PRIMARY",
  "2nd": "SECONDARY",
  "3rd": "TERTIARY",
}

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState("loggedOut")

  const { width } = useWindowDimensions()

  const onLoginPressed = async (email, password) => {
    setLoading(true)
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    setIsLoggedIn("loggedIn")

    // Use later to add user data to public users table on account registration.
    // if (user) console.log(user);
    // const $userId = user.id;

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const onRetrievePasswordPress = async (email) => {
    let { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (data) {
      console.log(data)
    } else {
      console.log(error)
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Image
          source={Logo}
          style={[styles.logo, { width: width - 32, height: 110 }]}
          resizeMode="contain"
        />
        <View style={{ width: 248, gap: 32 }}>
          <InputFieldRound
            placeholder="Email"
            value={email}
            setValue={setEmail}
            inputMode="email"
          />
          <InputFieldRound
            placeholder="Password"
            value={password}
            setValue={setPassword}
            isPassword
          />
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 16,
          gap: 32,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <CustomButton
          text="Logga in"
          onPress={() => onLoginPressed(email, password)}
          btnType={"LOGIN"}
        />
        <Pressable onPress={() => onRetrievePasswordPress(email)}>
          <Text>Glömt lösenord?</Text>
        </Pressable>
      </View>
      <View>
        <Spinner visible={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3693CF",
  },
  container: {
    height: 380,
    alignItems: "center",
    justifyContent: "space-between",
  },
})

export default LoginScreen
