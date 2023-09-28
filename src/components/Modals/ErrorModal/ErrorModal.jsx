import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import CustomButton from "../../CustomButton"

const ErrorModal = ({ isVisible, onClose }) => {
  return (
    isVisible && (
      <View>
        <Text>Error: Registration Failed</Text>
        <Text>Please accept the terms to continue.</Text>
        <TouchableOpacity onPress={onClose}>
          <CustomButton text="Tillbaka" btnType="2nd" />
        </TouchableOpacity>
      </View>
    )
  )
}

export default ErrorModal
