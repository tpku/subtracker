import React from "react"
import { View, Text, Button, StyleSheet, Pressable } from "react-native"
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter"

const CustomButtonRound = (props) => {
  const {
    text,
    onPress,
    btnType = "PRIMARY",
    textType = "PRIMARY",
    isLoggedIn = "",
  } = props
  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <Pressable
      style={[
        styles.container,
        styles[`container_${btnType}`],
        styles[`${isLoggedIn}`],
      ]}
      onPress={onPress}>
      <Text style={[styles.text, styles[`text_${textType}`]]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 200,
    paddingVertical: 8,

    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  container_PRIMARY: {
    backgroundColor: "#3693cf",
    borderWidth: 0,
  },

  container_SECONDARY: {
    backgroundColor: "#3693cf",
  },

  container_TERTIARY: {
    backgroundColor: "#fff",
    borderColor: "white",
    borderWidth: 2,
  },

  container_ERROR: {
    backgroundColor: "#999fa3",
    pointerEvents: "none",
  },

  container_START: {
    width: "100%",
    maxWidth: 248,
    borderColor: "#fff",
    borderWidth: 2,
    backgroundColor: "#3693cf",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 20,
    padding: 4,
    fontFamily: "Inter_400Regular",
  },

  text_PRIMARY: {
    color: "#fff",
  },

  text_SECONDARY: {
    color: "#fff",
  },

  text_TERTIARY: {
    color: "#3693cf",
  },

  text_ERROR: {
    color: "#bb3a40",
  },
  loggedIn: {
    display: "flex",
  },
  loggedOut: {
    display: "none",
  },
})

export default CustomButtonRound
