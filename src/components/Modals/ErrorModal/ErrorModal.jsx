import React from "react"
import { Modal, View, Text, StyleSheet } from "react-native"
import CustomButton from "../../CustomButton"

export default function ErrorModal({ visible, onDismiss }) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.body}>
          Du måste godkänna reglerna för lagrande av personlig data för att
          kunna använda appen!
        </Text>
        <CustomButton text="Tillbaka" onPress={onDismiss} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
    gap: "1.5rem",
    backgroundColor: "white",
    marginHorizontal: "5%",
    marginVertical: "35%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    fontSize: 14,
  },
})
