import React, { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native" /* Added this to be able to reach the UserSettingsScreen - MV */

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"
import InputField from "../../components/InputField/InputField"
import Spinner from "react-native-loading-spinner-overlay"

const UserAccountScreen = ({ session }) => {
  const navigation =
    useNavigation() /* Added this to be able to reach the UserSettingsScreen - MV */
  const [loading, setLoading] = useState(false)
  const [authUser, setAuthUser] = useState([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loggedInUser, setLoggedInUser] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setAuthUser(user)
      getUser()
    }
    fetchUser()
  }, [])

  const getUser = async () => {
    setLoading(true)
    const { data: user, error } = await supabase.from("users").select("*")
    if (user) setLoggedInUser(user[0])
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

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
      <InputField
        placeholder="Förnamn"
        value={firstName}
        setValue={setFirstName}
      />
      <InputField
        placeholder="Efternamn"
        value={lastName}
        setValue={setLastName}
      />
      <InputField
        placeholder="E-post"
        value={lastName}
        setValue={setLastName}
      />
      <InputField
        placeholder="Adress"
        value={lastName}
        setValue={setLastName}
      />
      <InputField
        placeholder="Telefon"
        value={lastName}
        setValue={setLastName}
      />
      <CustomButton
        text="Update name"
        onPress={() => updateUserName(firstName, lastName)}
      />

      <CustomButton
        text="Logout"
        onPress={logout}
        btnType={"SECONDARY"}
        textType="TERTIARY"
        isLoggedIn={"loggedIn"}
      />
      {/* This below is for testing. Will be changed/removed eventually. - MV */}
      <Text></Text>
      <Text>Temporary button "Edit profile settings"</Text>
      <CustomButton
        text="Edit profile settings"
        onPress={() => navigation.navigate("UserSettingsScreen")}
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

export default UserAccountScreen
