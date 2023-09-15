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

    borderRadius: 30,
    alignItems: "center",
    borderColor: "#f3f3f3",
    // borderWidth: 2,

    boxShadowRadius: 5,
    boxShadowOffset: {
      width: 2,
      height: 4,
    },
    boxShadowColor: "#0000001b",
  },

  container_PRIMARY: {
    backgroundColor: "#3693CF",
  },

  container_SECONDARY: {
    backgroundColor: "#286d9b",
  },

  container_TERTIARY: {
    backgroundColor: "#ff44009e",
    borderColor: "#FF69B4",
    borderWidth: 1,
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
  loggedIn: {
    display: "flex",
  },
  loggedOut: {
    display: "none",
  },
})

export default CustomButton
