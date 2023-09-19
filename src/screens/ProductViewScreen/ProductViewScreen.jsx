import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"

const ProductViewScreen = ({ route }) => {
  const { name, serviceId, activeService, isActive, isActiveSubscription } =
    route.params
  const navigation = useNavigation()
  const [userId, setUserId] = useState("")
  const [serviceIsActive, setServiceIsActive] = useState("")
  const [fetchedSubscriptions, setFetchedSubscriptions] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
    }
    fetchUser()
    setServiceIsActive(isActive)
    fetchSubscriptions(activeService.id)
  }, [userId, isActive, activeService.id])

  // Fetch matching Subscriptions from Supabase
  const fetchSubscriptions = async (serviceId) => {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("id, name, price")
      .eq("services_id", activeService.id)
    if (subscriptions) {
      setFetchedSubscriptions(subscriptions)
    }
    if (error) {
      Alert.alert(error.message)
      console.error(error.message) // FIXME: remove
    }
  }

  return (
    <View>
      <Text>
        {isActive
          ? `${activeService.name}: ${isActiveSubscription.name}`
          : `${activeService.name}`}
      </Text>
      <Text>{isActive ? `${isActiveSubscription.price} kr / mån` : ""}</Text>
      <Text>Prenumenation: {serviceIsActive ? "Aktiv" : "Ej ansluten"}</Text>

      <CustomButton
        text={serviceIsActive ? "Granska tjänst" : "Lägg till tjänst"}
        onPress={() => {
          navigation.navigate("ProductScreen", {
            name: name,
            serviceId: serviceId,
            isActive: isActive,
            subscriptions: fetchedSubscriptions,
          })
        }}
      />
    </View>
  )
}

export default ProductViewScreen
