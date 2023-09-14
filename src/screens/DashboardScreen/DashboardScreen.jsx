import React, { useEffect, useState } from "react"
import supabase from "../../lib/initSupabase"
import { View, Text, Alert, StyleSheet } from "react-native"

import CustomButton from "../../components/CustomButton/CustomButton"
import InputField from "../../components/InputField/InputField"
import Spinner from "react-native-loading-spinner-overlay"

const DashboardScreen = (session) => {
  const [loading, setLoading] = useState(false)
  const [authUser, setAuthUser] = useState([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [services, setServices] = useState("")
  const [loggedInUser, setLoggedInUser] = useState({})

  useEffect(() => {
    const sessionUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setAuthUser(user)
    }
    sessionUser()

    getUser()
  }, [])
  // console.log(authUser);

  const getUser = async () => {
    setLoading(true)
    const { data: user, error } = await supabase.from("users").select("*")
    if (user) setLoggedInUser(user[0])

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  //   Get services
  //   const getServices = async () => {
  //     setLoading(true)
  //     const { data: services, error } = await supabase
  //       .from('services')
  //       .select('*')
  //     // if (services) console.log(services);
  //     if (services) setServices(services)

  //     if (error) Alert.alert(error.message)
  //     setLoading(false)
  //   }

  // Get Service Subscriptions
  //   const getServiceSubscriptions = async (serviceId) => {
  //     setLoading(true)
  //     let { data: subscriptions, error } = await supabase
  //       .from('subscriptions')
  //       .select('name, price')
  //       .eq('services_id', serviceId)
  //     if (subscriptions) console.log(subscriptions)

  //     if (error) Alert.alert(error.message)
  //     setLoading(false)
  //   }

  const onLogoutPressed = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    // window.localStorage.clear()

    setIsLoggedIn("loggedOut")
    console.warn("Logout pressed")
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  // Update Users table if uuid = users.id
  //   const insertName = async (firstName, lastName) => {
  //     setLoading(true)
  //     let updateData = {}
  //     if (firstName) updateData.first_name = firstName
  //     if (lastName) updateData.last_name = lastName

  //     const { error } = await supabase
  //       .from('users')
  //       .update(updateData)
  //       .eq('id', authUser.id)
  //       .select('*')
  //     if (!error) console.log('Successfully updated!')
  //     if (error) {
  //       Alert.alert(error)
  //     }

  //     setLoading(false)
  //   }

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>
        Welcome user: {loggedInUser.first_name}
      </Text>
      <CustomButton text="Test Button" onPress={() => console.log(Pressed)} />
      <CustomButton
        text="Logout"
        onPress={onLogoutPressed}
        btnType={"SECONDARY"}
        isLoggedIn={"loggedIn"}
      />

      {/* Update Users below, 2x InputFields, 1x CustomButton */}
      {/* <InputField
        placeholder="First name"
        value={firstName}
        setValue={setFirstName}
      />
      <InputField
        placeholder="Full name"
        value={lastName}
        setValue={setLastName}
      />
      <CustomButton
        text="Insert name"
        onPress={() => insertName(firstName, lastName)}
      /> */}

      {/* Render services if services === true and get subscriptions on click */}
      {/* {services && services.length > 0
        ? services.map((service, index) => {
            return (
              <CustomButton
                key={index}
                text={service.name}
                onPress={() => {
                  console.log(service?.name),
                    getServiceSubscriptions(service.id)
                }}
              />
            )
          })
        : ''} */}
      <View>
        <Spinner visible={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "orangered",
  },
  heading: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
})

export default DashboardScreen
