import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import CustomButton from "../../CustomButton"

const TermsModal = ({ isVisible, onAccept, onClose }) => {
  return (
    isVisible && (
      <View style={styles.modalContainer}>
        <Text>Terms and Conditions</Text>
        {/* Your terms and conditions content here */}
        <TouchableOpacity onPress={onAccept}>
          <CustomButton text="Skapa konto" btnType="2nd" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <CustomButton text="Tillbaka" btnType="2nd" />
        </TouchableOpacity>
      </View>
    )
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
})

export default TermsModal
