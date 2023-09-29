import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter"

const InputField = (props) => {
  const {
    value,
    setValue,
    placeholder,
    isPassword,
    inputType = "PRIMARY",
  } = props
  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, styles[`container_${inputType}`]]}
        placeholder={placeholder}
        defaultValue={value} // FIXME: For dashboard search
        onChangeText={(text) => setValue(text)} // FIXME: For dashboard search // Replace
        secureTextEntry={isPassword}
        inputMode="text"
        onSubmitEditing={setValue} // FIXME: For dashboard search // Replace
        autoCapitalize="none" // FIXME: For dashboard search
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#3693cf",
  },

  container_SECONDARY: {
    borderColor: "#3693cf",
    height: 48,
  },

  input: {
    color: "#6C6C6C",
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontFamily: "Inter_400Regular",
  },
})

export default InputField
