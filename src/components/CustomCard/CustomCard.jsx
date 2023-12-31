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
    logoType = "PRIMARY",
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
        style={[styles.logo, styles[`logo_${logoType}`]]}
        resizeMode="contain"
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,

    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  container_PRIMARY: {
    backgroundColor: "#000000",
    width: 93,
    height: 93,
  },

  container_SECONDARY: {
    backgroundColor: "#000000",
    width: 120,
    height: 120,
  },
  container_DASHBOARD: {
    backgroundColor: "#000000",
    flex: 1,
    aspectRatio: "1 / 1",
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
    width: "100%",
  },

  logo_PRIMARY: {
    width: "100%",
    width: 63,
    height: 63,
  },

  logo_DASHBOARD: {
    backgroundColor: "black",
    width: "80%",
    height: "80%",
  },
})

export default CustomCard
