import React, { useState, useEffect } from "react"
import { StyleSheet, View, Text, Pressable, Alert } from "react-native"

import supabase from "../../lib/initSupabase"
import CustomCard from "../../components/CustomCard"
import CustomButton from "../../components/CustomButton/CustomButton"

const ProductEditScreen = ({ route }) => {
  const {
    serviceName,
    serviceId,
    serviceActive,
    serviceSubscriptions,
    serviceImgSource,
    isActiveSubscription, // FIXME: Remove?
    serviceDiscount,
    resetCheckBox,
  } = route.params
  const [userId, setUserId] = useState("")
  const [updateValidation, setUpdateValidation] = useState("")
  const [selectedSubscription, setSelectedSubscription] = useState("")
  const [newSubscription, setNewSubscription] = useState(initialSubscription)
  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`
  const initialSubscription = {
    users_id: "",
    subscriptions_id: "",
    start_date: formattedDate, // Default todays date
    discount_active: false,
    services_id: "",
  }

  // ----- FIXME: Remove -----
  //   console.log({ serviceName })
  //   console.log({ serviceId })
  //   console.log({ serviceActive })
  //   console.log({ serviceSubscriptions })
  //   console.log({ serviceImgSource })
  //   console.log({ serviceDiscount })
  //   console.log({ resetCheckBox })
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (userId) checkActiveServices(userId, serviceId)
  }, [serviceId, userId])

  useEffect(() => {
    if (selectedSubscription) console.log({ selectedSubscription }) //FIXME: Delete
  })

  // Check if subscription exists on user and service
  const checkActiveServices = async (user_id, selected_id) => {
    const { data: checked_data, error } = await supabase
      .from("users_subscriptions")
      .select("*") // FIXME: Limit response?
      .eq("users_id", user_id)
      .eq("services_id", selected_id)
    if (checked_data && checked_data.length === 0) {
      setUpdateValidation(true)
      console.log("No subscriptions connected on this service")
    } else {
      setUpdateValidation(false)
      console.log("Subscriptions already connected")
    }
    if (error) {
      setUpdateValidation(false)
      console.error(error.message)
      Alert.alert(error.message)
    }
  }

  // TODO: Date: Calendar
  // Update initial subscriptions object before adding to database
  const updateSubscription = async (
    user_id,
    subscription_id,
    service_id,
    discount_active,
  ) => {
    const updatedSubscription = {
      ...initialSubscription,
      users_id: user_id,
      subscriptions_id: subscription_id,
      services_id: service_id,
      discount_active: discount_active,
    }
    const isEmptyOrNull = Object.values(updatedSubscription).some(
      (value) => value === "" || value === null,
    )
    if (isEmptyOrNull) {
      const error = "Error: Updated subscription keys cannot be empty or null."
      Alert.alert(error)
      console.error(error)
    } else {
      setNewSubscription(updatedSubscription)
    }
  }

  // Add subscription to Supabase
  const addUserSubscription = async (
    subscription,
    isDiscount,
    discountId,
    startDate,
    userId,
  ) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("users_subscriptions")
      .insert([subscription])
      .select()
    if (data) {
      console.log(data[0].id) // FIXME: Remove
      //   setLatestSubscriptionId(data[0].id)
      //   if (isDiscount) {
      //     updateDiscount(data[0].id, discountId, startDate, userId)
      //   }
    }
    if (data && !error) console.log("Successfully updated!")
    // if (!error) // FIXME: Uncomment
    //   setTimeout(() => {
    //     navigation.navigate("ProductScreen")
    //   }, 2000)
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  // TODO: Remake the render as an dropdown select
  // Render service subscriptions
  const renderSubscriptions = (service_subscriptions) => {
    return service_subscriptions
      ? service_subscriptions.map((subscription, index) => (
          <Pressable
            style={styles.testButton}
            key={index}
            onPress={() => setSelectedSubscription(subscription.id)}>
            <Text>
              {subscription.name} {subscription.price} kr
            </Text>
          </Pressable>
        ))
      : null
  }

  return (
    <View style={styles.root}>
      <View style={styles.topContainer}>
        <CustomCard cardType={"SECONDARY"} imgSource={serviceImgSource} />
        <Text style={styles.heading}>{serviceName}</Text>
      </View>

      {serviceActive ? (
        <View>
          <Text>Status: aktiv</Text>
          <Text>Abonnemang: {isActiveSubscription.name}</Text>
        </View>
      ) : (
        <View>
          <Text>Status: ej ansluten</Text>
          <Text></Text>
          <View>{renderSubscriptions(serviceSubscriptions)}</View>
          {updateValidation && selectedSubscription ? (
            <CustomButton
              text="Lägg till tjänst"
              onPress={() => {
                updateSubscription(
                  userId,
                  selectedSubscription,
                  serviceId,
                  false,
                )
              }}
              btnType={"PRIMARY"}
              textType={"PRIMARY"}
            />
          ) : (
            <CustomButton
              text="Välj en tjänst"
              // onpress={() => {
              //   addUserSubscription()
              // }}
              btnType={"ERROR"}
              textType={"ERROR"}
            />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
    rowGap: 8,
    flex: 1,
    // alignItems: "start",
    // padding: 20,
    backgroundColor: "white",
  },
  heading: {
    // flex: 1,
    // display: "flex",
    textAlign: "center",
    fontSize: 50,
    textTransform: "capitalize",
  },
  serviceScroll: {
    marginLeft: 16,
    width: "100%",
    flexGrow: 0,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  testButton: {
    width: "50%",
    height: 40,
    backgroundColor: "#3693CF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
})

export default ProductEditScreen
