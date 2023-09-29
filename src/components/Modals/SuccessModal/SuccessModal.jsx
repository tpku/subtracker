import React from "react"
import { Modal, View, Text, StyleSheet } from "react-native"

export default function SuccessModal({ visible }) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Success</Text>
        <Text style={styles.body}>Ditt konto är skapat!</Text>
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
    marginVertical: "37.5%",
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
