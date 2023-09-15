import React from "react"
import { View, Text, Button, StyleSheet, Pressable } from "react-native"

const CustomCard = (props) => {
  const { text, onPress, cardType = "PRIMARY", textType = "SECONDARY" } = props
  return (
    <Pressable
      style={[
        styles.container,
        styles[`container_${cardType}`],
        styles[`text_${textType}`],
      ]}
      onPress={onPress}>
      <Text style={[styles.text, styles[`text_${textType}`]]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 93,
    height: 93,
    marginVertical: 5,

    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,

    // boxShadowRadius: 5,
    // boxShadowOffset: {
    //   width: 2,
    //   height: 4,
    // },
    // boxShadowColor: "#0000001b",
  },

  container_PRIMARY: {
    backgroundColor: "#2E2E2E",
  },

  container_SECONDARY: {
    backgroundColor: "#2e2e2e88",
  },

  text: {
    padding: 10,
    fontSize: 10,
    fontWeight: "bold",
    color: "beige",
  },

  text_PRIMARY: {
    color: "#f5f5dc",
  },
})

export default CustomCard
