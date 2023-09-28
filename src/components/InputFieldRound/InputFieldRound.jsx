import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter"

const InputFieldRound = (props) => {
  const { value, setValue, placeholder, isPassword, inputMode } = props
  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={value} // FIXME: For dashboard search
        onChangeText={(text) => setValue(text)} // FIXME: For dashboard search // Replace
        secureTextEntry={isPassword}
        onSubmitEditing={setValue} // FIXME: For dashboard search // Replace
        autoCapitalize="none" // FIXME: For dashboard search
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 44,
    maxWidth: 248,
    borderColor: "#fff",
    borderWidth: 2,
    backgroundColor: "#3693cf",
    borderRadius: 30,
  },
  input: {
    height: "100%",
    color: "#fff",
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    fontStyle: 20,
    fontFamily: "Inter_400Regular",
  },
})

export default InputFieldRound
