import React, { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet, Pressable } from "react-native"

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"
import InputField from "../../components/InputField/InputField"
import Spinner from "react-native-loading-spinner-overlay"

const DashboardScreen = ({ session }) => {
  const [loading, setLoading] = useState(false)
  const [authUser, setAuthUser] = useState([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [services, setServices] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState({})
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
      setAuthUser(user)
      getUser()
      if (authUser) fetchServices()
    }
    fetchUser()
  }, [])

  const getUser = async () => {
    setLoading(true)
    const { data: user, error } = await supabase.from("users").select("*") // Should we change the select to name only or do we need the whole user object later?
    if (user) setLoggedInUser(user[0])
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const fetchServices = async () => {
    const { data: services, error } = await supabase
      .from("services")
      .select("*")
    if (services) setServices(services)
    if (error) Alert.alert(error.message)
  }

  const fetchSubscriptions = async (serviceId) => {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("id, name, price")
      .eq("services_id", serviceId)
    if (subscriptions) setFetchedSubscriptions(subscriptions)
    if (error) Alert.alert(error.message)
  }

  const updateSubscription = (userId, subscriptionId) => {
    const updatedSubscription = {
      ...initialSubscription,
      users_id: userId,
      subscriptions_id: subscriptionId,
    }
    setNewSubscription(updatedSubscription)
  }

  const addUserSubscription = async (subscription) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("users_subscriptions")
      .insert([subscription])
    if (!error) console.log("Successfully updated!")
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  // Update user name in "public.users" if "uuid.id = users.id"  - MOVE TO USER SETTINGS SCREEN WITH CORRECT PROPS AND FETCHES
  const updateUserName = async (firstName, lastName) => {
    setLoading(true)
    let updateData = {}
    if (firstName) updateData.first_name = firstName
    if (lastName) updateData.last_name = lastName
    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", authUser.id)
      .select("*")
    if (!error) console.log("Successfully updated!")
    if (error) Alert.alert(error)
    setLoading(false)
  }

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>
        Welcome user: {loggedInUser.first_name}
      </Text>
      {/* <CustomButton text="Test Button" onPress={() => testSubs()} /> */}
      <>
        {services &&
          services.map((service, index) => (
            <CustomButton
              text={service.name}
              key={index}
              btnType="SECONDARY"
              onPress={() => {
                fetchSubscriptions(service.id)
              }}></CustomButton>
          ))}
      </>
      <>
        {fetchedSubscriptions &&
          fetchedSubscriptions.map((sub, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedSubscriptionId(sub.id)}>
              <Text>{sub.name}</Text>
            </Pressable>
          ))}
      </>

      {/* <CustomButton
        text="Update Subscription"
        onPress={() => updateSubscription(authUser.id, selectedSubscription)}
      /> */}

      {/* <CustomButton
        text="Add Subscription"
        onPress={() => addUserSubscription(newSubscription)}
      /> */}

      <CustomButton
        text="Logout"
        onPress={logout}
        btnType={"SECONDARY"}
        textType="TERTIARY"
        isLoggedIn={"loggedIn"}
      />

      {/* Update User information - MOVE TO USER SETTINGS SCREEN WITH CORRECT PROPS AND FETCHES */}
      {/* <InputField
        placeholder="First name"
        value={firstName}
        setValue={setFirstName}
      />
      <InputField
        placeholder="Last name"
        value={lastName}
        setValue={setLastName}
      />
      <CustomButton
        text="Update name"
        onPress={() => updateUserName(firstName, lastName)}
      /> */}

      <View>
        <Spinner visible={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "start",
    padding: 20,
    backgroundColor: "orangered",
  },
  heading: {
    flex: 1,
    textAlign: "start",
    fontSize: 10,
  },
})

export default DashboardScreen
