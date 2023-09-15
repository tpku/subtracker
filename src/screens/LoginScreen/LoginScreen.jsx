import React, { useState } from "react"
import supabase from "../../lib/initSupabase"
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native"

import Logo from "../../../assets/adaptive-icon.png"
import InputField from "../../components/InputField/InputField"
import CustomButton from "../../components/CustomButton/CustomButton"
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
  const { height } = useWindowDimensions()

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

  const onRetrievePasswordPress = (content) => {
    console.warn("Retrieve password pressed")
  }

  const onLogoutPressed = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    // window.localStorage.clear()

    setIsLoggedIn("loggedOut")
    console.warn("Logout pressed")
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.3 }]}
        resizeMode="contain"
      />
      <InputField placeholder="Email" value={email} setValue={setEmail} />
      <InputField
        placeholder="Password"
        value={password}
        setValue={setPassword}
        isPassword
      />
      <CustomButton
        text="Login"
        onPress={() => onLoginPressed(email, password)}
        btnType={btn["2nd"]}
      />
      <CustomButton
        text="Retrieve password"
        onPress={onRetrievePasswordPress}
        btnType={btn["3rd"]}
        textType={btn["3rd"]}
      />
      <CustomButton
        text="Logout"
        onPress={onLogoutPressed}
        btnType={btn["3rd"]}
        textType={btn["3rd"]}
        isLoggedIn={isLoggedIn}
      />
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
    padding: 20,
    backgroundColor: "#3693CF",
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxHeight: 300,
  },
})

export default LoginScreen
