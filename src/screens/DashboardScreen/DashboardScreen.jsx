import React, { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"
import InputField from "../../components/InputField/InputField"
import Spinner from "react-native-loading-spinner-overlay"
import CustomCard from "../../components/CustomCard"
import { FlatList } from "react-native"

const DashboardScreen = ({ session }) => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [authUser, setAuthUser] = useState([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [services, setServices] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState({})

  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`

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
    console.log(services)
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

  //   const renderServiceCards = ({ item }) => {
  //     return (
  //       <CustomCard
  //         text={item.name}
  //         btnType="SECONDARY"
  //         onPress={() =>
  //           navigation.navigate("ProductScreen", {
  //             name: item.name,
  //             serviceId: item.id,
  //           })
  //         }
  //       />
  //     )
  //   }

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>
        Welcome user: {loggedInUser.first_name}
      </Text>
      {/* <CustomButton text="Test Button" onPress={() => testSubs()} /> */}
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

      {/* ----- Replace ScrollView with FlatList for Performance reasons -----*/}
      {/* <FlatList
        style={styles.ScrollView}
        horizontal
        data={services}
        keyExtractor={(services, index) => index.toString()}
        renderItem={({ item }) => renderServiceCards(item)}
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
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
    flex: 1,
    backgroundColor: "orangered",
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
