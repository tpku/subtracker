import { StyleSheet } from "react-native"
import { startScreenView, blackScreenView, bigLogoText } from "./screens"
import { thinRounded, whiteTextInButtons } from "./pressables"

const styles = StyleSheet.create({
  screenViews: {
    startScreen: startScreenView,
    blackScreen: blackScreenView,
  },
  logo: { bigLogo: bigLogoText },
  pressables: {
    thinRoundedButton: thinRounded,
    whiteButtonText: whiteTextInButtons,
  },
})

export default styles
