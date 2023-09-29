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
  ScrollView,
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
    <>
      <ScrollView
        style={styles.scrollRoot}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}>
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
            <View style={{ width: 248, gap: 32, alignItems: "center" }}>
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
              <View style={{ height: 32 }} />
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
          </View>
          <View>
            <Spinner visible={loading} />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollRoot: {
    height: "100",
    backgroundColor: "#3693CF",
  },
  root: {
    height: "100",
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  container: {
    marginTop: 200,
    height: 380,
    alignItems: "center",
    justifyContent: "space-between",
  },
})

export default SignupScreen
