import React from "react"
import {
  Modal,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native"
import CustomButton from "../../CustomButton"
import Checkbox from "expo-checkbox"

export default function ShowTermsModal({
  visible,
  onAccept,
  onDismiss,
  setCheckBox,
  checkBox,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <Text style={styles.title}>GDPR</Text>
        <Text style={styles.body}>
          Dataskyddsförklaring (GDPR) Vi värnar om din integritet och behandlar
          dina personuppgifter enligt GDPR. Här är det viktigaste:
          {"\n"}1. Syfte: Vi samlar in och använder dina uppgifter bara för
          specifika ändamål, som att tillhandahålla våra tjänster. {"\n"}2.
          Rättigheterna: Du har rätt att få tillgång till, rätta och ta bort
          dina uppgifter, samt motsätta dig viss behandling. {"\n"}3. Säkerhet:
          Vi skyddar dina uppgifter mot obehörig åtkomst. {"\n"}4. Datadelning:
          Vi delar bara dina uppgifter när det är nödvändigt eller enligt lag.
          För mer information, se vår dataskyddspolicy på vår webbplats.
        </Text>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={checkBox}
            onValueChange={(value) => setCheckBox(value)}
          />
          <Text style={styles.checkboxText}>
            Jag ger Subee tillåtelse att använda mina uppgifter.
          </Text>
        </View>
        <CustomButton text="Skapa konto" onPress={onAccept} />
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
    marginVertical: "5%",
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
  body: {
    fontSize: 14,
  },
})
