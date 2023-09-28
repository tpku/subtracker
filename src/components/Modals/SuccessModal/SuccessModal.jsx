import React from "react"
import { View, Text } from "react-native"

const SuccessModal = ({ isVisible }) => {
  return (
    isVisible && (
      <View>
        <Text>Registration Successful</Text>
        {/* Your success message content here */}
      </View>
    )
  )
}

export default SuccessModal
