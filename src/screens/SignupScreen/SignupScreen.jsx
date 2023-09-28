import React, { useState } from "react"
import supabase from "../../lib/initSupabase"
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Pressable,
} from "react-native"
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter"

import Logo from "../../../assets/logos/Subee.png"
import InputFieldRound from "../../components/InputFieldRound"
import CustomButton from "../../components/CustomButton/"
import Spinner from "react-native-loading-spinner-overlay"

const btn = {
  "1st": "PRIMARY",
  "2nd": "SECONDARY",
  "3rd": "TERTIARY",
}

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { width } = useWindowDimensions()
  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }
  const onSignupPressed = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (!error && data)
      console.log("Registrering godkänd. Bekräfta via angiven e-post")
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Image
          source={Logo}
          style={[
            styles.logo,
            { width: width - 32, height: 110, marginBottom: 150 },
          ]}
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
          bottom: 32,
          gap: 32,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <CustomButton
          text="Skapa konto"
          onPress={() => onSignupPressed(email, password)}
          btnType={"LOGIN"}
        />
        <Pressable onPress={() => navigation.navigate("Startscreen")}>
          <Text
            style={{
              color: "#fff",
              fontFamily: "Inter_400Regular",
            }}>
            Tillbaka till startsidan.
          </Text>
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
    backgroundColor: "#3693CF",
  },
  container: {
    height: 380,
    alignItems: "center",
    marginTop: 200,
    justifyContent: "space-between",
  },
})

export default SignupScreen
