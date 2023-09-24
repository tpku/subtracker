import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Alert, Pressable } from "react-native"

import supabase from "../../lib/initSupabase"
import Spinner from "react-native-loading-spinner-overlay"
import CustomButton from "../../components/CustomButton/CustomButton"
import CustomCard from "../../components/CustomCard"
import BouncyCheckbox from "react-native-bouncy-checkbox"

// _______________________________________________________
// __________  DISABLED FILE DELETE WHEN DONE  ___________
// _______________________________________________________
// TODO: Add calendar for start_date and discount. And function to check duration for each invoice and discount.

const ProductScreen = ({ route }) => {
  const {
    name,
    serviceId,
    isActive,
    subscriptions,
    imgSource,
    isActiveSubscription,
    discounts,
    resetIsChecked,
  } = route.params

  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState([])
  const [fetchedSubscriptions, setFetchedSubscriptions] = useState("") // Not Copied
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("") // Copied
  const [selectedDiscountId, setSelectedDiscountId] = useState("")
  const [confirmSubscriptionId, setConfirmSubscriptionId] = useState(true) // Copied // Check if user already subscribe on selected service sub
  const [newSubscription, setNewSubscription] = useState(initialSubscription) // Copied
  const [newDiscount, setNewDiscount] = useState(initialDiscount) // Copied
  // const [discounts, setDiscounts] = useState("") // FIXME: Move to ProductViewScreen (Remove)
  const [enableDiscount, setEnableDiscount] = useState(false) // Copied
  const [latestSubscriptionId, setLatestSubscriptionId] = useState("")
  const [checkboxState, setCheckboxState] = useState(false) // Copied
  const currentDate = new Date() // Copied
  const formattedDate = `${currentDate.getFullYear()}/${
    // Copied
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`
  const initialSubscription = {
    // Copied
    users_id: "",
    subscriptions_id: "",
    start_date: formattedDate, // If no start date is given todays date is set YYYY/MM/DD
    discount_active: false,
    services_id: "",
  }

  const initialDiscount = {
    // Copied
    users_subscriptions_id: "",
    discounts_id: "",
    start_date: formattedDate,
    users_id: "userId",
  }

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
    }
    fetchUser()
    setConfirmSubscriptionId(true)
    setFetchedSubscriptions(subscriptions) // Not Copied
    setSelectedSubscriptionId("") //Copied // Reset variable on ScreenLoad
    setCheckboxState(resetIsChecked) //Copied // Reset variable on ScreenLoad
    setEnableDiscount(resetIsChecked) // Reset variable on ScreenLoad
    setNewSubscription(initialSubscription) // Reset variable on ScreenLoad
  }, [serviceId, discounts])

  // Check if user already subscribe on selected service subscription
  useEffect(() => {
    if (selectedSubscriptionId !== "") {
      checkActiveServiceOnId(userId, serviceId)
    }
    if (newSubscription) {
      console.log(newSubscription)
    }
    if (newDiscount) {
      addUserDiscount(checkboxState, newDiscount)
    }
  }, [selectedSubscriptionId, newSubscription, newDiscount])

  // // Check if service is connected
  // // Copied
  // const checkActiveServiceOnId = async (userId, selectedServiceId) => {
  //   const { data: subscriptions_id, error } = await supabase
  //     .from("users_subscriptions")
  //     .select("*") // FIXME: Change select value?
  //     .eq("users_id", userId)
  //     .eq("services_id", selectedServiceId)
  //   if (subscriptions_id && subscriptions_id.length === 0) {
  //     setConfirmSubscriptionId(true)
  //   } else {
  //     setSelectedSubscriptionId("")
  //     setConfirmSubscriptionId(false)
  //   }
  //   if (error) console.error(error)
  // }

  // // Update initial subscriptions object
  // // Copied
  // // FIXME: Date: Calendar
  // const updateSubscription = async (
  //   userId,
  //   subscriptionId,
  //   serviceId,
  //   discountActive,
  // ) => {
  //   // Cleaner and shorter version generated with help of AI
  //   const updatedSubscription = {
  //     ...initialSubscription,
  //     users_id: userId,
  //     subscriptions_id: subscriptionId,
  //     services_id: serviceId,
  //     discount_active: discountActive,
  //   }
  //   const isEmptyOrNull = Object.values(updatedSubscription).some(
  //     (value) => value === "" || value === null,
  //   )
  //   if (isEmptyOrNull) {
  //     const error = "Error: Updated subscription keys cannot be empty or null."
  //     Alert.alert(error)
  //     console.error(error)
  //   } else {
  //     setNewSubscription(updatedSubscription)
  //   }
  }

  // // Copied
  // const updateDiscount = async (
  //   latestUserSubscriptionId,
  //   discountId,
  //   startDate,
  //   userId,
  // ) => {
  //   const updatedDiscount = {
  //     ...initialDiscount,
  //     users_subscriptions_id: latestUserSubscriptionId,
  //     discounts_id: discountId,
  //     start_date: startDate,
  //     users_id: userId,
  //   }
  //   const isEmptyOrNull = Object.values(updatedDiscount).some(
  //     (value) => value === "" || value === null,
  //   )
  //   if (isEmptyOrNull) {
  //     const error = "Error: Updated subscription keys cannot be empty or null."
  //     Alert.alert(error)
  //     console.error(error)
  //   } else {
  //     setNewDiscount(updatedDiscount)
  //   }
  // }

  // // Add subscription to Supabase
  // // Copied
  // const addUserSubscription = async (
  //   subscription,
  //   isDiscount,
  //   discountId,
  //   startDate,
  //   userId,
  // ) => {
  //   setLoading(true)
  //   const { data, error } = await supabase
  //     .from("users_subscriptions")
  //     .insert([subscription])
  //     .select()
  //   if (data) {
  //     console.log(data[0].id) // FIXME: Remove
  //     setLatestSubscriptionId(data[0].id)
  //     if (isDiscount) {
  //       updateDiscount(data[0].id, discountId, startDate, userId)
  //     }
  //   }
  //   if (data && !error) console.log("Successfully updated!")
  //   // if (!error) // FIXME: Uncomment
  //   //   setTimeout(() => {
  //   //     navigation.navigate("ProductScreen")
  //   //   }, 2000)
  //   if (error) Alert.alert(error.message)
  //   setLoading(false)
  // }

  // // Copied
  // const addUserDiscount = async (discountActive, newDiscount) => {
  //   if (discountActive) {
  //     const { data, error } = await supabase
  //       .from("user_subscription_discount")
  //       .insert([newDiscount])
  //       .select()
  //     if (!error && data) console.log({ data })
  //     if (error) console.error(error.message)
  //     if (error) Alert.alert(error.message)
  //   }
  // }

  // // Copied
  // const renderConnectedSubscriptions = (subscriptions) => {
  //   return subscriptions
  //     ? subscriptions.map((subscription, index) => (
  //         <Pressable
  //           key={index}
  //           onPress={() => setSelectedSubscriptionId(subscription.id)}>
  //           <Text>
  //             {subscription.name} {subscription.price} kr
  //           </Text>
  //         </Pressable>
  //       ))
  //     : null
  // }

  // // Copied
  // const renderConnectedDiscounts = (discounts) => {
  //   return discounts
  //     ? discounts.map((discount, index) => (
  //         <Pressable
  //           key={index}
  //           onPress={() => setSelectedDiscountId(discount.id)}>
  //           <Text>
  //             {discount.name} {discount.price} kr
  //           </Text>
  //         </Pressable>
  //       ))
  //     : null
  // }

  return (
    // Copied
    <View style={styles.root}>
      <View style={styles.topContainer}>
        <CustomCard imgSource={imgSource} />
        <View>
          <Text style={styles.heading}>{name}</Text>
        </View>
      </View>

      <View>
        <Text>Status: {isActive ? "Aktiv" : "Ej ansluten"}</Text>
        <Text>
          Abonnemang:{" "}
          {isActiveSubscription && isActive
            ? isActiveSubscription.name
            : "ej ansluten"}
        </Text>
        <View>
          {isActive ? null : renderConnectedSubscriptions(fetchedSubscriptions)}
        </View>
      </View>

      {/* Copied ^ */}

      {/* TODO: Move to automated function */}
      <CustomButton
        text="Update Subscription"
        onPress={() => (
          updateSubscription(
            userId,
            selectedSubscriptionId,
            serviceId,
            enableDiscount,
          ),
          console.log(enableDiscount),
          console.log(selectedDiscountId)
        )}
      />

      {/* Render Checkbox if: */}
      {selectedSubscriptionId &&
      selectedSubscriptionId !== "" &&
      discounts &&
      discounts.length > 0 ? (
        <BouncyCheckbox
          fillColor="black"
          isChecked={checkboxState}
          disableBuiltInState
          useNativeDriver={false}
          onPress={() => (
            setCheckboxState(!checkboxState), setEnableDiscount(!checkboxState)
          )}
          // onPress={(isChecked) => {
          //   setEnableDiscount(isChecked)
          // }}
        />
      ) : null}

      {/* Render Discounts if: */}
      <View>
        {checkboxState && enableDiscount && discounts.length > 0
          ? renderConnectedDiscounts(discounts)
          : null}
      </View>

      <CustomButton
        text={
          confirmSubscriptionId
            ? "Lägg till tjänst"
            : "Tjänsten är redan aktiv!"
        }
        onPress={() => {
          confirmSubscriptionId && selectedDiscountId
            ? addUserSubscription(
                newSubscription,
                checkboxState,
                selectedDiscountId,
                formattedDate,
                userId,
              )
            : console.error("Denna tjänst är redan aktiv!")
        }}
        btnType={confirmSubscriptionId ? "PRIMARY" : "ERROR"}
        textType={confirmSubscriptionId ? "PRIMARY" : "ERROR"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
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
  topContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
})

export default ProductScreen
