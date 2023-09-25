import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Alert, ImageBackground } from "react-native"
import { useNavigation } from "@react-navigation/native"

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"
import CustomCard from "../../components/CustomCard"

import Logo1 from "../../../assets/logos/hbo.png"
import Logo2 from "../../../assets/logos/netflix.png"
import Logo3 from "../../../assets/logos/viaplay.png"
import Logo4 from "../../../assets/logos/spotify.png"
import Logo5 from "../../../assets/logos/primevideo.png"
import Logo6 from "../../../assets/logos/disneyplus.png"
import Logo7 from "../../../assets/logos/youtube.png"
import Logo8 from "../../../assets/logos/discoveryplus.png"
import Logo9 from "../../../assets/logos/teliaplay.png"

const ProductViewScreen = ({ route }) => {
  const {
    name,
    serviceId,
    activeService,
    isActive,
    isActiveSubscription,
    startDate,
  } = route.params
  const navigation = useNavigation()
  const [userId, setUserId] = useState("")
  const [serviceIsActive, setServiceIsActive] = useState("")
  const [fetchedSubscriptions, setFetchedSubscriptions] = useState("")
  const [discounts, setDiscounts] = useState("")
  const Logos = [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7, Logo8, Logo9]

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
    }
    fetchUser()
    fetchDiscounts(activeService.id)
    setServiceIsActive(isActive)
    fetchSubscriptions(activeService.id)

    // console.log(activeService) // FIXME: Remove
  }, [userId, isActive, activeService.id])

  // Fetch matching Subscriptions from Supabase
  const fetchSubscriptions = async (serviceId) => {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("id, name, price")
      .eq("services_id", serviceId)
    if (subscriptions) {
      setFetchedSubscriptions(subscriptions)
    }
    if (error) {
      Alert.alert(error.message)
      // console.error(error.message) // FIXME: remove
    }
  }

  const fetchDiscounts = async (serviceId) => {
    const { data: discounts, error } = await supabase
      .from("discounts")
      .select("*")
      .eq("services_id", serviceId)
    if (discounts) setDiscounts(discounts)
    if (error) Alert.alert(error.message)
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={Logos[serviceId - 1]}
        resizeMode="cover"
        style={styles.image}
        blurRadius={10}>
        <View style={styles.centerContainer}>
          <CustomCard cardType={"SECONDARY"} imgSource={activeService.id - 1} />
        </View>
        <View style={styles.content}>
          <Text>
            {isActive
              ? `${activeService.name}: ${isActiveSubscription.name}`
              : `${activeService.name}`}
          </Text>
          <Text>{isActive ? `Start date: ${startDate}` : ""}</Text>
          <Text>
            {isActive ? `${isActiveSubscription.price} kr / mån` : ""}
          </Text>
          <Text>
            Prenumenation: {serviceIsActive ? "Aktiv" : "Ej ansluten"}
          </Text>
          {serviceIsActive ? (
            <CustomButton
              text={"Granska tjänst"}
              onPress={() => {
                navigation.navigate("ProductEditScreen", {
                  serviceName: name,
                  serviceId: serviceId,
                  serviceActive: isActive,
                  serviceSubscriptions: fetchedSubscriptions,
                  serviceImgSource: serviceId - 1,
                  isActiveSubscription: isActiveSubscription, // FIXME: Remove?
                  serviceDiscount: discounts[0],
                  resetCheckBox: false,
                })
              }}
            />
          ) : (
            <CustomButton
              text={"Lägg till tjänst"}
              onPress={() => {
                navigation.navigate("ProductAddScreen", {
                  serviceName: name,
                  serviceId: serviceId,
                  serviceActive: isActive,
                  serviceSubscriptions: fetchedSubscriptions,
                  serviceImgSource: serviceId - 1,
                  isActiveSubscription: isActiveSubscription, // FIXME: Remove?
                  serviceDiscount: discounts[0],
                  resetCheckBox: false,
                })
              }}
            />
          )}
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
    flex: 1,
    backgroundColor: "white",
  },
  centerContainer: {
    paddingTop: 56,
    paddingBottom: 36,
    alignItems: "center",
  },
  image: {
    // margin: 24,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    tintColor: "black",
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 15,
    aspectRatio: "1/1",
    backgroundColor: "white",
  },
})

export default ProductViewScreen
