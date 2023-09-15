import React from "react"
import { View, Text, Pressable } from "react-native"
import styles from "../../styles"

const SignupScreen = () => {
  return (
    <View style={styles.screenViews.startScreen}>
      <View style={{ flex: 0.3 }}>
        <Text style={styles.logo.bigLogo}>Subee</Text>
      </View>
      <View>
        <Pressable
          style={styles.pressables.thinRoundedButton}
          onPress={() => console.log("email")}>
          <Text style={styles.pressables.whiteButtonText}>Email</Text>
        </Pressable>
        <Pressable
          style={styles.pressables.thinRoundedButton}
          onPress={() => console.log("password")}>
          <Text style={styles.pressables.whiteButtonText}>Password</Text>
        </Pressable>
        <Pressable
          style={styles.pressables.thinRoundedButton}
          onPress={() => console.log("password again")}>
          <Text style={styles.pressables.whiteButtonText}>Password conf</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SignupScreen
