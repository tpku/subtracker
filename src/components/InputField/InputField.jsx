import React from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"

const InputField = (props) => {
  const { value, setValue, placeholder, isPassword } = props
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={isPassword}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
    paddingHorizontal: 20,
    paddingVertical: 10,

    borderColor: "#3693cf",
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 15,
  },
  input: {
    color: "#6C6C6C",
    fontSize: 20,
  },
})

export default InputField
