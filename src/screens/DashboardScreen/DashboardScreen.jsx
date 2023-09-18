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
  const [toggleTotal, setToggleTotal] = useState(true)
  const [searchKey, setSearchKey] = useState("")
  const [resetServices, setResetServices] = useState("")

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
      fetchUserSubscriptions(user.id)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const searchResult = []
    if (services && searchKey !== "") {
      for (let i = 0; i < services.length; i++) {
        const result = services[i]
        if (result.name.includes(searchKey)) {
          searchResult.push(result)
          services.splice(i, 1)
          i--
        }
      }
      services.unshift(...searchResult)
    }
  }, [searchKey])

  const getUser = async () => {
    setLoading(true)
    const { data: user, error } = await supabase
      .from("users")
      .select("first_name")
    if (user) setLoggedInUser(user[0].first_name)
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const fetchServices = async () => {
    const { data: services, error } = await supabase
      .from("services")
      .select("*")
    if (services) setServices(services)
    if (services) setResetServices(services)
    if (error) Alert.alert(error.message)
  }

  const fetchUserSubscriptions = async (user) => {
    // const activeSubscriptions = {
    //   service_id: "",
    //   service_name: "",
    //   subscription_id: "",
    //   subscription_name: "",
    //   subscription_price: "",
    //   //   subscription_start: "",
    //   //   subscription_duration: "",
    // }
    const { data: users_subscriptions, error } = await supabase
      .from("users_subscriptions")
      .select(
        `
        subscriptions:subscriptions_id (name, price, services_id),
        services:services_id(id, name)
      `,
      )
      .eq("users_id", user)
    if (users_subscriptions) setConnectedServices(users_subscriptions)
    // if (users_subscriptions) console.log(users_subscriptions)
    if (error) console.error(error.message)
    if (error) Alert.alert(error.message)
  }

  const calculateTotalPrice = (subPrices) => {
    let totalPrice = 0
    for (const subPrice of subPrices) {
      if (subPrice.subscriptions && subPrice.subscriptions.price) {
        totalPrice += subPrice.subscriptions.price
      }
    }

    return totalPrice
  }

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Welcome user: {loggedInUser}</Text>
      {/* <CustomButton text="Test Button" onPress={() => testSubs()} /> */}

      <Text>Lägg till tjänst</Text>
      {/* <InputField placeholder="Search" /> */}
      <InputField
        placeholder="Search"
        value={searchKey}
        setValue={setSearchKey}
        // onChange={setSearchKey(value)}
      />

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
        text={toggleTotal ? "Månad" : "År"}
        onPress={() => setToggleTotal(!toggleTotal)}
      />
      {toggleTotal ? (
        <Text>Totalt: {calculateTotalPrice(connectedServices)} kr</Text>
      ) : (
        <Text>Totalt: {calculateTotalPrice(connectedServices) * 12} kr</Text>
      )}

      <Text>Dina tjänster</Text>
      <ScrollView style={styles.serviceScroll} horizontal>
        {connectedServices &&
          connectedServices.map((service, index) => (
            <CustomCard
              text={service.services.name}
              key={index}
              btnType="SECONDARY"
              onPress={() =>
                navigation.navigate("ProductScreen", {
                  name: service.services.name,
                  serviceId: service.services.id,
                  //   Flytta subscriptions fetch hit
                })
              }
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
})

export default DashboardScreen
