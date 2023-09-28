import React from "react"
import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  StyleSheet,
} from "react-native"

import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter"

import google from "../../../assets/icons/google.svg"
import apple from "../../../assets/icons/apple.svg"
import facebook from "../../../assets/icons/facebook.svg"
import CustomButtonRound from "../../components/CustomButtonRound"
import InputFieldRound from "../../components/InputFieldRound"
import Logo from "../../../assets/logos/Subee.png"

const StartScreen = ({ navigation }) => {
  const { width } = useWindowDimensions()
  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
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
          <CustomButtonRound
            text="Logga in"
            onPress={() => navigation.navigate("Loginscreen")}
            btnType={"START"}
          />
          <CustomButtonRound
            text="Skapa konto"
            onPress={() => navigation.navigate("Signupscreen")}
            btnType={"START"}
          />
          <Text style={{ textAlign: "center" }}>Eller med</Text>

          <View
            style={{
              flexDirection: "row",
              gap: 24,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Pressable style={styles.imageContainer}>
              <Image
                source={google}
                style={[styles.logo, { width: 49, height: 49 }]}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable style={styles.imageContainer}>
              <Image
                source={apple}
                style={[styles.logo, { width: 49, height: 49 }]}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable style={styles.imageContainer}>
              <Image
                source={facebook}
                style={[styles.logo, { width: 49, height: 49 }]}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#3693CF",
  },
  container: {
    marginTop: 200,
    height: 380,
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    overflow: "hidden",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default StartScreen
