import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Alert,
  StyleSheet,
  useWindowDimensions,
  Image,
  Pressable,
  ScrollView,
} from "react-native"

import supabase from "../../lib/initSupabase"
import CustomButton from "../../components/CustomButton/CustomButton"
import InputField from "../../components/InputField/InputField"
import Spinner from "react-native-loading-spinner-overlay"

import portrait from "../../../assets/cp.jpeg"

const UserAccountScreen = ({ session }) => {
  const [loading, setLoading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState({})
  const [authUser, setAuthUser] = useState([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [newFirstName, setNewFirstName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const { height } = useWindowDimensions()

  const [toggleTotal, setToggleTotal] = useState(true)
  const [connectedServices, setConnectedServices] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setAuthUser(user)
      getUser()
      fetchUserSubscriptions(user.id)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (authUser) {
      setEmail(authUser.email)
    }
  }, [authUser])

  const getUser = async () => {
    setLoading(true)
    const { data: user, error } = await supabase.from("users").select("*")
    if (user) {
      setLoggedInUser(user[0]) // FIXME: Delete
      setFirstName(user[0].first_name)
      setLastName(user[0].last_name)
      setAddress(user[0].address)
      setPhoneNumber(user[0].phone_number)
    }
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const updateUserName = async (newFirstName, newLastName, newAddress) => {
    setLoading(true)
    let updateData = {}
    if (newFirstName) updateData.first_name = newFirstName
    if (newLastName) updateData.last_name = newLastName
    if (newAddress) updateData.address = newAddress
    if (newPhoneNumber) updateData.phone_number = newPhoneNumber
    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", authUser.id)
      .select("*")
    if (!error) console.log("Successfully updated!")
    if (error) Alert.alert(error)
    setLoading(false)
  }

  const updateEmail = async (new_email) => {
    if (new_email && new_email !== "") {
      const { data, error } = await supabase.auth.updateUser({
        email: new_email,
      })

      if (data) console.log(data)
      if (error) console.log(error)
    }
  }

  const updatePassword = async (new_password) => {
    if (new_password && new_password !== "") {
      const { data, error } = await supabase.auth.updateUser({
        password: "new password",
      })

      data ? console.log(data) : null
      error ? console.log(error) : null
    }
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
    const { data: users_subscriptions, error } = await supabase
      .from("users_subscriptions")
      .select(
        `start_date, discount_active,
        subscriptions:subscriptions_id (*),
        services:services_id(id, name)
      `,
      )
      .eq("users_id", user)
    if (users_subscriptions) {
      setConnectedServices(convertFetchObject(users_subscriptions))
    }
    if (error) console.error(error.message)
    if (error) Alert.alert(error.message)
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imgWrapper}>
            <Image
              source={portrait}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          {/* <Text style={{ fontSize: 22 }}>Kontodetaljer</Text> */}

          <View style={styles.inputContainer}>
            <View style={styles.textRow}>
              <Text style={styles.textMedium}>Förnamn</Text>
              <View style={styles.inputWrapper}>
                <InputField
                  placeholder={firstName ? firstName : "Förnamn"}
                  value={newFirstName}
                  setValue={setNewFirstName}
                />
              </View>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.textMedium}>Efternamn</Text>
              <View style={styles.inputWrapper}>
                <InputField
                  placeholder={lastName ? lastName : "Efternamn"}
                  value={newLastName}
                  setValue={setNewLastName}
                />
              </View>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.textMedium}>E-post</Text>
              <View style={styles.inputWrapper}>
                <InputField
                  placeholder={email ? email : "E-post"}
                  value={newEmail}
                  setValue={setNewEmail}
                />
              </View>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.textMedium}>Adress</Text>
              <View style={styles.inputWrapper}>
                <InputField
                  placeholder={address ? address : "Adress"}
                  value={newAddress}
                  setValue={setNewAddress}
                />
              </View>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.textMedium}>Telefon</Text>
              <View style={styles.inputWrapper}>
                <InputField
                  placeholder={phoneNumber ? `(0)${phoneNumber}` : "Telefon"}
                  value={newPhoneNumber}
                  setValue={setNewPhoneNumber}
                />
              </View>
            </View>
          </View>

          <View>
            <Pressable
              style={styles.centerContainer}
              onPress={() => setToggleTotal(!toggleTotal)}>
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
          </View>

          <View style={styles.bottomContainer}>
            <CustomButton
              text="Spara ändringar"
              onPress={() => (
                updateUserName(
                  firstName,
                  lastName,
                  newFirstName,
                  newLastName,
                  address,
                  newAddress,
                ),
                updateEmail(newEmail)
              )}
              isLoggedIn={"loggedIn"}
            />
            <CustomButton
              text="Logga ut"
              onPress={logout}
              btnType="SECONDARY"
              textType="SECONDARY"
              isLoggedIn={"loggedIn"}
            />

            <Pressable>
              <Text style={styles.text16}>Avsluta konto</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 48,
  },
  inputContainer: {
    width: "100%",
    gap: 24,
    alignItems: "center",
  },

  bottomContainer: {
    alignItems: "center",
    width: "100%",
    gap: 24,
    marginBottom: 16,
  },
  textMedium: {
    fontSize: 22,
  },
  text16: {
    fontSize: 16,
  },
  textRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  test: {
    backgroundColor: "red",
  },
  inputWrapper: {
    maxWidth: 184,
  },

  image: {
    width: "126%",
    height: "140%",
  },
  imgWrapper: {
    marginTop: 48,
    backgroundColor: "black",
    width: 200,
    height: 200,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderColor: "#3693cf",
    borderWidth: 2,
  },
  centerContainer: {
    alignItems: "center",
  },
  headingBig: {
    fontSize: 36,
  },
})

export default UserAccountScreen
