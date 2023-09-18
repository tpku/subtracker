import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"

const ProductViewScreen = ({ route }) => {
  const { name, serviceId, isActive } = route.params
  const [userId, setUserId] = useState("")
  const [serviceIsActive, setServiceIsActive] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
    }
    fetchUser()
    setServiceIsActive(isActive)
  }, [userId, isActive])

  return (
    <View>
      <Text>{name}</Text>
      <Text>Pris här</Text>
      <Text>Prenumenation: {serviceIsActive ? "Aktiv" : "Inga tjänster"}</Text>

      <CustomButton
        text={serviceIsActive ? "Granska tjänst" : "Lägg till tjänst"}
      />
    </View>
  )
}

export default ProductViewScreen
