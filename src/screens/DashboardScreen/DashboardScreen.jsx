import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native"
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
  //   const [loggedInUser, setLoggedInUser] = useState("")
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
      //   getUser()
      if (authUser) fetchServices()
      fetchUserSubscriptions(user.id)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    // fetchUserSubscriptions(user.id) // FIXME: Delete
  })

  useEffect(() => {
    searchServices()
  }, [searchKey])

  const searchServices = () => {
    let searchResult = []
    if (services && searchKey !== "") {
      const updatedServices = [...services]
      for (let i = 0; i < updatedServices.length; i++) {
        const result = updatedServices[i]
        if (result.name.includes(searchKey)) {
          searchResult.push(result)
          updatedServices.splice(i, 1)
          i--
        }
      }
      updatedServices.unshift(...searchResult)
      setServices(updatedServices)
    } else {
      // FIXME: Remove to keep search result else reset on clear input
      setServices(resetServices)
    }
  }

  //   const getUser = async () => {
  //     setLoading(true)
  //     const { data: user, error } = await supabase
  //       .from("users")
  //       .select("first_name")
  //     if (user) setLoggedInUser(user[0].first_name)
  //     if (error) Alert.alert(error.message)
  //     setLoading(false)
  //   }

  // TODO: Test make fetchServices return available subscriptions
  const fetchServices = async () => {
    const { data: services, error } = await supabase.from("services").select(
      `
    id, name, url, image_name, subscriptions (*), users_subscriptions (*)
      `,
    )
    if (services) setServices(services)
    if (services) setResetServices(services)
    if (error) Alert.alert(error.message)
    if (error) console.error(error.message)
  }
  //   const fetchServices = async () => {
  //     const { data: services, error } = await supabase
  //       .from("services")
  //       .select("*")
  //     if (services) setServices(services)
  //     if (services) setResetServices(services)
  //     if (error) Alert.alert(error.message)
  //   }

  const checkUserService = async (userId, serviceId) => {
    const { data: service, error } = await supabase
      .from("users_subscriptions")
      .select("services_id", serviceId)
      .eq("users_id", userId)
      .eq("services_id", serviceId)
    if (service && service.length === 0) {
      return false
    } else {
      return true
    }
  }

  const getActiveSub = async (userId, serviceId) => {
    const { data: service, error } = await supabase
      .from("users_subscriptions")
      .select(
        `
      subscriptions:subscriptions_id (name, price),
      services:services_id
      `,
      )
      .eq("users_id", userId)
      .eq("services_id", serviceId)
    if (service && service.length > 0) {
      return service[0].subscriptions
    } else if (error) {
      Alert.alert(error.message)
    } else {
      return ""
    }
  }

  const convertFetchObject = (inputObject) => {
    const result = []
    const servicePart = {}
    // console.log({ inputObject }) // FIXME: Remove log

    inputObject.forEach((item) => {
      const serviceId = item.services.id
      const serviceName = item.services.name
      const serviceStartDate = item.start_date
      const serviceDiscount = item.discount_active
      const subscriptionName = item.subscriptions.name
      const subscriptionPrice = item.subscriptions.price
      const subscriptionDuration = item.subscriptions.duration

      if (!servicePart[serviceId]) {
        servicePart[serviceId] = {
          id: serviceId,
          name: serviceName,
          start_date: serviceStartDate,
          discount_active: serviceDiscount,
          subscriptions: [],
        }
      }

      servicePart[serviceId].subscriptions.push({
        id: servicePart[serviceId].subscriptions.length + 1,
        name: subscriptionName,
        price: subscriptionPrice,
        duration: subscriptionDuration,
        services_id: serviceId,
      })
    })

    for (const key in servicePart) {
      result.push(servicePart[key])
    }

    return result
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
        `start_date, discount_active,
        subscriptions:subscriptions_id (*),
        services:services_id(id, name)
      `,
      )
      .eq("users_id", user)
    if (users_subscriptions)
      setConnectedServices(convertFetchObject(users_subscriptions))
    if (error) console.error(error.message)
    if (error) Alert.alert(error.message)
  }

  const calculateTotalPrice = (subPrices) => {
    let totalPrice = 0
    for (const subPrice of subPrices) {
      if (subPrice.subscriptions && subPrice.subscriptions[0].price) {
        totalPrice += subPrice.subscriptions[0].price
      }
    }

    return totalPrice
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {/* FIXME: Remove */}
        {/* <Text style={styles.heading}>Welcome user: {loggedInUser}</Text> */}

        {/* FIXME: Automated search don't work on mobile, automatically updating the services field */}
        <Text style={styles.heading}>Lägg till tjänst</Text>
        <InputField
          placeholder="Sök:"
          defaultValue={searchKey}
          setValue={setSearchKey} // Replace
          onSubmitEditing={searchServices} // Replace
        />
      </View>

      <ScrollView
        style={styles.serviceScroll}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {services &&
          services.map((service, index) => (
            <CustomCard
              text={service.name}
              key={index}
              imgSource={service.id - 1}
              btnType="SECONDARY"
              onPress={async () => {
                const isActive = await checkUserService(authUser, service.id)
                const activeSub = await getActiveSub(authUser, service.id)
                navigation.navigate("ProductViewScreen", {
                  name: service.name,
                  serviceId: service.id,
                  activeService: service,
                  isActive: isActive,
                  isActiveSubscription: activeSub,
                  startDate: service.users_subscriptions[0]
                    ? service.users_subscriptions[0].start_date
                    : "",
                })
              }}
            />
          ))}
      </ScrollView>
      <View style={styles.container}>
        <Pressable
          style={styles.centerContainer}
          onPress={() => setToggleTotal(!toggleTotal)}>
          <Text>{toggleTotal ? "< Månad >" : "< År >"}</Text>
          {toggleTotal ? (
            <Text style={styles.headingBig}>
              Totalt: {calculateTotalPrice(connectedServices)} kr
            </Text>
          ) : (
            <Text style={styles.headingBig}>
              Totalt: {calculateTotalPrice(connectedServices) * 12} kr
            </Text>
          )}
        </Pressable>
        <Text style={styles.heading}>Dina tjänster</Text>
      </View>

      <ScrollView
        style={styles.serviceScroll}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {connectedServices &&
          connectedServices.map((service, index) => (
            <CustomCard
              text={service.name}
              key={index}
              imgSource={service.id - 1}
              btnType="SECONDARY"
              onPress={async () => {
                const isActive = await checkUserService(authUser, service.id)
                navigation.navigate("ProductViewScreen", {
                  name: service.name,
                  serviceId: service.id,
                  activeService: service,
                  isActive: isActive,
                  isActiveSubscription: service.subscriptions[0],
                  startDate: service.start_date,
                })
              }}
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
    backgroundColor: "white",
    paddingTop: 16,
  },
  heading: {
    fontSize: 22,
  },
  headingBig: {
    fontSize: 36,
  },
  centerContainer: {
    paddingTop: 56,
    paddingBottom: 36,
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  serviceScroll: {
    paddingLeft: 16,
    width: "100%",
    // height: 100,
    flexGrow: 0,
  },
})

export default DashboardScreen
