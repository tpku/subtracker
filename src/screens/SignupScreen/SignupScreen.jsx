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

const SignupScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { height } = useWindowDimensions()

  const onSignupPressed = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (data) console.log(data)

    console.warn("Sign up pressed")
    if (error) Alert.alert(error.message)
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
        text="Sign up"
        onPress={() => onSignupPressed(email, password)}
        btnType={btn["2nd"]}
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

export default SignupScreen
