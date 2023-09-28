import React from "react"
import { View, Text, Button, StyleSheet, Pressable } from "react-native"

const CustomButton = (props) => {
  const {
    text,
    onPress,
    btnType = "PRIMARY",
    textType = "PRIMARY",
    isLoggedIn = "",
  } = props
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

    borderRadius: 15,
    alignItems: "center",
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

  text: {
    fontSize: 20,
    padding: 4,
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

export default CustomButton
