import React from "react"
import { View, Text, Pressable } from "react-native"
import styles from "../../styles"

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.screenViews.startScreen}>
      <View style={{ flex: 0.3 }}>
        <Text style={styles.logo.bigLogo}>Subee</Text>
      </View>
      <View>
        <Pressable
          style={styles.pressables.thinRoundedButton}
          onPress={() => navigation.navigate("Loginscreen")}>
          <Text style={styles.pressables.whiteButtonText}>Login</Text>
        </Pressable>
        <Pressable
          style={styles.pressables.thinRoundedButton}
          onPress={() => navigation.navigate("Signupscreen")}>
          <Text style={styles.pressables.whiteButtonText}>Signup</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default StartScreen
