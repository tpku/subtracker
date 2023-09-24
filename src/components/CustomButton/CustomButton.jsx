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
    marginVertical: 5,

    borderRadius: 15,
    alignItems: "center",
    borderColor: "#f3f3f3",
    borderWidth: 1,
  },

  container_PRIMARY: {
    backgroundColor: "#3693cf",
  },

  container_SECONDARY: {
    backgroundColor: "#286d9b",
  },

  container_TERTIARY: {
    backgroundColor: "#ff44009e",
    borderColor: "#FF69B4",
    borderWidth: 1,
  },

  container_ERROR: {
    backgroundColor: "#999fa3",
    borderColor: "#ff0000",
    borderWidth: 1,
    pointerEvents: "none",
  },

  text: {
    padding: 10,
    fontWeight: "bold",
    color: "beige",
  },

  text_PRIMARY: {
    color: "#f5f5dc",
  },

  text_TERTIARY: {
    color: "#FF69B4",
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
