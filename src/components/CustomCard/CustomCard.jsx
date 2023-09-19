import React from "react"
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Image,
} from "react-native"

import Logo1 from "../../../assets/logos/hbo.png"
import Logo2 from "../../../assets/logos/netflix.png"
import Logo3 from "../../../assets/logos/viaplay.png"
import Logo4 from "../../../assets/logos/spotify.png"
import Logo5 from "../../../assets/logos/primevideo.png"
import Logo6 from "../../../assets/logos/disneyplus.png"
import Logo7 from "../../../assets/logos/youtube.png"
import Logo8 from "../../../assets/logos/discoveryplus.png"
import Logo9 from "../../../assets/logos/teliaplay.png"

const CustomCard = (props) => {
  const {
    text,
    imgSource,
    onPress,
    cardType = "PRIMARY",
    textType = "SECONDARY",
  } = props
  const { height } = useWindowDimensions()

  const Logos = [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7, Logo8, Logo9]
  return (
    <Pressable
      style={[
        styles.container,
        styles[`container_${cardType}`],
        styles[`text_${textType}`],
      ]}
      onPress={onPress}>
      {/* <Text style={[styles.text, styles[`text_${textType}`]]}>{text}</Text> */}
      <Image
        source={Logos[imgSource]}
        style={[styles.logo, { height: height * 0.3 }]}
        resizeMode="contain"
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 93,
    height: 93,
    marginVertical: 5,

    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  container_PRIMARY: {
    backgroundColor: "#000000",
  },

  container_SECONDARY: {
    backgroundColor: "#2e2e2e88",
  },

  text: {
    padding: 10,
    fontSize: 10,
    fontWeight: "bold",
    color: "beige",
    textTransform: "capitalize",
  },

  text_PRIMARY: {
    color: "#f5f5dc",
  },
  logo: {
    width: "80%",
    maxWidth: 63,
    maxHeight: 63,
  },
})

export default CustomCard
