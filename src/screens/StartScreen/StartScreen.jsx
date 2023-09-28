import React from "react"
import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  StyleSheet,
} from "react-native"

import CustomButtonRound from "../../components/CustomButtonRound"
import InputFieldRound from "../../components/InputFieldRound"
import Logo from "../../../assets/logos/Subee.png"
const StartScreen = ({ navigation }) => {
  const { width } = useWindowDimensions()
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Image
          source={Logo}
          style={[styles.logo, { width: width - 32, height: 110 }]}
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
        </View>
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

export default StartScreen
