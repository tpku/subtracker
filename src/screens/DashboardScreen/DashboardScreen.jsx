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
