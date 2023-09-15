import React, { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { FlatList } from "react-native"

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"
import InputField from "../../components/InputField/InputField"
import Spinner from "react-native-loading-spinner-overlay"
import CustomCard from "../../components/CustomCard"

const DashboardScreen = ({ session }) => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [authUser, setAuthUser] = useState([])
  const [services, setServices] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState("")
  const [connectedServices, setConnectedServices] = useState([])

  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setAuthUser(user.id)
      getUser()
      if (authUser) fetchServices()
    }
    fetchUser()
  }, [])

  const getUser = async () => {
    setLoading(true)
    const { data: user, error } = await supabase
      .from("users")
      .select("first_name") // Should we change the select to name only or do we need the whole user object later?
    if (user) setLoggedInUser(user[0].first_name)
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

  const fetchUserSubscriptions = async (user) => {
    const { data: users_subscriptions, error } = await supabase
      .from("users_subscriptions")
      .select("subscriptions_id")
      .eq("users_id", user)

    if (users_subscriptions) {
      const activeSubscriptions = []
      for (let sub of users_subscriptions) {
        const { data: subscriptions, error } = await supabase
          .from("subscriptions")
          .select("name, price, services_id")
          .eq("id", sub.subscriptions_id)

        if (subscriptions) {
          for (let subscription of subscriptions) {
            const { data: services, error } = await supabase
              .from("services")
              .select("name")
              .eq("id", subscription.services_id)

            if (services) {
              subscription.service_name = services[0].name
            }
            activeSubscriptions.push(subscription)
          }
        }
      }
      //   console.log(activeSubscriptions)
      setConnectedServices(activeSubscriptions)
    }
    if (error) console.error(error.message)
    if (error) Alert.alert(error.message)
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Welcome user: {loggedInUser}</Text>
      {/* <CustomButton text="Test Button" onPress={() => testSubs()} /> */}
      <CustomButton
        text="Test Button"
        onPress={() => fetchUserSubscriptions(authUser)}
      />

      {/* Temporary button */}
      <CustomButton
        text="Profile"
        onPress={() => navigation.navigate("UserAccountScreen")}
      />
      <InputField placeholder="Search" />
      <ScrollView style={styles.serviceScroll} horizontal>
        {services &&
          services.map((service, index) => (
            <CustomCard
              text={service.name}
              key={index}
              btnType="SECONDARY"
              onPress={() =>
                navigation.navigate("ProductScreen", {
                  name: service.name,
                  serviceId: service.id,
                })
              }
            />
          ))}
      </ScrollView>
      <CustomButton
        text="Logout"
        onPress={logout}
        btnType={"SECONDARY"}
        textType="TERTIARY"
        isLoggedIn={"loggedIn"}
      />

      <ScrollView style={styles.connectedServiceScroll} horizontal>
        {connectedServices &&
          connectedServices.map((service, index) => (
            <CustomCard
              text={service.service_name}
              key={index}
              btnType="SECONDARY"
              //   onPress={() =>
              //     navigation.navigate("ProductScreen", {
              //       name: service.service_name,
              //       serviceId: service.services_id,
              //     })
              //   }
            />
          ))}
      </ScrollView>

      <View>
        <Spinner visible={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
    flex: 1,
    backgroundColor: "#3693CF",
  },
  heading: {
    fontSize: 10,
  },
  serviceScroll: {
    paddingLeft: 16,
    width: "100%",
    // height: 100,
    flexGrow: 0,
  },
  connectedServiceScroll: {
    padding: 16,
  },
})

export default DashboardScreen
