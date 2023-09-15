import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Pressable,
} from "react-native"

import supabase from "../../lib/initSupabase"
import Spinner from "react-native-loading-spinner-overlay"
import CustomButton from "../../components/CustomButton/CustomButton"

const ProductScreen = ({ route }) => {
  const { name, serviceId } = route.params
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState([])
  const [fetchedSubscriptions, setFetchedSubscriptions] = useState("")
  const [selectedSubscription, setSelectedSubscriptionId] = useState("")

  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`
  const initialSubscription = {
    users_id: "",
    subscriptions_id: "",
    start_date: formattedDate, // If no start date is given todays date is set YYYY/MM/DD
    discount_active: false,
  }
  const [newSubscription, setNewSubscription] = useState(initialSubscription)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
    }
    fetchSubscriptions(serviceId)
    fetchUser()
  }, [])

  // Fetch matching Subscriptions from Supabase
  const fetchSubscriptions = async (serviceId) => {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("id, name, price")
      .eq("services_id", serviceId)
    if (subscriptions) setFetchedSubscriptions(subscriptions)
    if (error) Alert.alert(error.message)
  }

  // Update initial subscriptions object
  const updateSubscription = (userId, subscriptionId) => {
    const updatedSubscription = {
      ...initialSubscription,
      users_id: userId,
      subscriptions_id: subscriptionId,
    }
    if (
      updatedSubscription.users_id == "" ||
      updatedSubscription.users_id == null ||
      updatedSubscription.subscriptions_id == "" ||
      updatedSubscription.subscriptions_id == null
    ) {
      Alert.alert("Error: Updated subscription keys cannot be empty or null.")
      console.error("Error: Updated subscription keys cannot be empty or null.")
    } else {
      setNewSubscription(updatedSubscription)
    }
  }

  // Add the updated subscription object to users_subscriptions on Supabase
  const addUserSubscription = async (subscription) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("users_subscriptions")
      .insert([subscription])
    if (!error) console.log("Successfully updated!")
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <>
      <Text style={styles.heading}>{name}</Text>

      {fetchedSubscriptions &&
        fetchedSubscriptions.map((sub, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedSubscriptionId(sub.id)}>
            <Text>
              {sub.name} {sub.price}kr
            </Text>
          </Pressable>
        ))}

      <CustomButton
        text="Update Subscription"
        onPress={() => updateSubscription(userId, selectedSubscription)}
      />

      <CustomButton
        text="Add Subscription"
        onPress={() => addUserSubscription(newSubscription)}
      />
      <View>
        <Spinner visible={loading} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
    flex: 1,
    // alignItems: "start",
    // padding: 20,
    backgroundColor: "#3693CF",
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
})

export default ProductScreen
