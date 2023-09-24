import React, { useState, useEffect } from "react"
import { StyleSheet, View, Text, Pressable, Alert } from "react-native"

import supabase from "../../lib/initSupabase"
import CustomCard from "../../components/CustomCard"
import CustomButton from "../../components/CustomButton/CustomButton"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import DropDownPicker from "react-native-dropdown-picker"

// TODO: Add calendar to Subscription and Discount
// TODO: Add function to overwrite origin Subscription with Discount price
// TODO: Add function to send notice for next invoice and upcoming payment

const ProductAddScreen = ({ route }) => {
  const {
    serviceName,
    serviceId,
    serviceActive, // FIXME: Delete?
    serviceSubscriptions,
    serviceImgSource,
    isActiveSubscription, // FIXME: Delete?
    serviceDiscount,
    resetCheckBox, // FIXME: Delete?
  } = route.params
  const [userId, setUserId] = useState("")
  const [updateValidation, setUpdateValidation] = useState("")
  const [selectedSubscription, setSelectedSubscription] = useState("")
  const [checkboxState, setCheckboxState] = useState(false)
  // const [toggleDiscount, setToggleDiscount] = useEffect(false)
  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`
  const initialSubscription = {
    users_id: "",
    subscriptions_id: "",
    start_date: formattedDate, // Default todays date
    discount_active: false,
    services_id: "",
  }
  const [newSubscription, setNewSubscription] = useState(initialSubscription)
  const initialDiscount = {
    users_subscriptions_id: "",
    discounts_id: "",
    start_date: formattedDate, // Default todays date
    users_id: "",
  }
  const [newDiscount, setNewDiscount] = useState(initialDiscount)
  // Dropdown states
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [dropdownList, setDropdownList] = useState([])
  const convertToDropdown = (list) => {
    const updatedList = list.map((listItem) => {
      return {
        label: `${listItem.name} ${listItem.price} kr`,
        value: listItem.id,
      }
    })
    setDropdownList(updatedList)
  }

  // ----- FIXME: Remove -----
  //   console.log({ serviceName })
  //   console.log({ serviceId })
  //   console.log({ serviceActive })
  // console.log({ serviceSubscriptions })
  //   console.log({ serviceImgSource })
  //   console.log({ serviceDiscount })
  //   console.log({ resetCheckBox })

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user.id)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (userId) checkActiveServices(userId, serviceId)
    setCheckboxState(false) // Reset variable on service change
    setSelectedSubscription("") // Reset variable on service change
    // setValue("") // Reset variable on service change (Dropdown)
    setNewSubscription(initialSubscription) // Reset variable on service change
    convertToDropdown(serviceSubscriptions) // Covert subscriptions to dropdown object
  }, [serviceId, userId])

  useEffect(() => {
    // if (selectedSubscription) console.log({ selectedSubscription }) //FIXME: Delete
  })

  useEffect(() => {
    // if (newSubscription) console.log(newSubscription) // FIXME: Delete
  }, [newSubscription])

  useEffect(() => {
    // if (newDiscount) console.log(newDiscount) // FIXME: Delete
    if (newDiscount) addUserDiscount(checkboxState, newDiscount)
  }, [newDiscount])

  useEffect(() => {
    if (selectedSubscription !== null) {
      updateSubscription(userId, selectedSubscription, serviceId, checkboxState)
      // console.log(checkboxState) // FIXME: Delete
      // console.log(selectedSubscription) // FIXME: Delete
    }
  }, [checkboxState, selectedSubscription])

  // Check if subscription exists on user and service
  const checkActiveServices = async (user_id, selected_id) => {
    const { data: checked_data, error } = await supabase
      .from("users_subscriptions")
      .select("*") // FIXME: Limit response?
      .eq("users_id", user_id)
      .eq("services_id", selected_id)
    if (checked_data && checked_data.length === 0) {
      setUpdateValidation(true)
      console.log("No subscriptions connected on this service")
    } else {
      setUpdateValidation(false)
      console.log("Subscriptions already connected")
    }
    if (error) {
      setUpdateValidation(false)
      console.error(error.message)
      Alert.alert(error.message)
    }
  }

  // TODO: Date: Calendar
  // Update initial subscriptions object before adding to Supabase
  const updateSubscription = async (
    user_id,
    subscription_id,
    service_id,
    discount_active,
  ) => {
    const updatedSubscription = {
      ...initialSubscription,
      users_id: user_id,
      subscriptions_id: subscription_id,
      services_id: service_id,
      discount_active: discount_active,
    }
    // FIXME: Delete or Find alternate solution
    // const isEmptyOrNull = Object.values(updatedSubscription).some(
    //   (value) => value === "" || value === null,
    // )
    // if (isEmptyOrNull) {
    //   const error = "Error: Updated subscription keys cannot be empty or null."
    //   Alert.alert(error)
    //   return
    // }
    setNewSubscription(updatedSubscription)
  }

  // TODO: Date: Calendar
  // Update initial discount object before adding to Supabase
  const updateDiscount = async (
    this_user_sub_id,
    discount_id,
    start_date,
    user_id,
  ) => {
    const updatedDiscount = {
      ...initialDiscount,
      users_subscriptions_id: this_user_sub_id,
      discounts_id: discount_id,
      start_date: start_date,
      users_id: user_id,
    }
    const isEmptyOrNull = Object.values(updatedDiscount).some(
      (value) => value === "" || value === null,
    )
    if (isEmptyOrNull) {
      const error = "Error: Updated subscription keys cannot be empty or null."
      Alert.alert(error)
      console.error(error)
    } else {
      setNewDiscount(updatedDiscount)
    }
  }

  // Add new subscription to Supabase
  const addUserSubscription = async (
    subscription,
    discount_active,
    discount_id,
    start_date,
    user_id,
  ) => {
    const { data, error } = await supabase
      .from("users_subscriptions")
      .insert([subscription])
      .select()
    if (data) {
      // console.log(data[0].id) // FIXME: Delete
      if (discount_active) {
        updateDiscount(data[0]?.id, discount_id, start_date, user_id)
      }
    }
    if (data && !error) console.log("Subscription successfully added!")
    // if (!error) // FIXME: Uncomment
    //   setTimeout(() => {
    //     navigation.navigate("ProductScreen")
    //   }, 2000)
    if (error) Alert.alert(error.message)
  }

  // Add new discount subscription to Supabase
  const addUserDiscount = async (discount_active, new_discount) => {
    if (discount_active) {
      const { data, error } = await supabase
        .from("user_subscription_discount")
        .insert([new_discount])
        .select()

      if (data && !error) console.log("Discount successfully added!")
      if (!error && data) console.log({ data })
      if (error) console.error(error.message)
      if (error) Alert.alert(error.message)
    }
  }

  // // TODO: Remake the render as an dropdown select
  // // Render service subscriptions
  // const renderSubscriptions = (service_subscriptions) => {
  //   return service_subscriptions
  //     ? service_subscriptions.map((subscription, index) => (
  //         <Pressable
  //           style={styles.testButton}
  //           key={index}
  //           onPress={async () => {
  //             setSelectedSubscription(subscription.id)
  //             await updateSubscription(
  //               userId,
  //               subscription.id,
  //               serviceId,
  //               checkboxState,
  //             )
  //           }}>
  //           <Text>
  //             {subscription.name} {subscription.price} kr
  //           </Text>
  //         </Pressable>
  //       ))
  //     : null
  // }

  // TODO: Remake the render as an dropdown select
  // Render discount subscriptions
  const renderDiscount = (service_discount) => {
    // console.log(service_discount) // FIXME: Delete
    return service_discount ? (
      <Text>
        Erbjudanden: {serviceDiscount.name} {serviceDiscount.price} kr
      </Text>
    ) : null
  }

  return (
    <View style={styles.root}>
      <View style={styles.topContainer}>
        <CustomCard cardType={"SECONDARY"} imgSource={serviceImgSource} />
        <Text style={styles.heading}>{serviceName}</Text>
      </View>

      <View>
        <Text>Status: ej ansluten</Text>
        <Text></Text>
        {/* <View>{renderSubscriptions(serviceSubscriptions)}</View> */}
        {/* TODO: Replace above subscriptions with dropdown below*/}
        <DropDownPicker
          open={open}
          value={value}
          items={dropdownList}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setDropdownList}
          placeholder={"Välj en tjänst."}
          onChangeValue={async () => (
            setSelectedSubscription(value),
            await updateSubscription(userId, value, serviceId, checkboxState)
          )}
        />
        {value &&
        selectedSubscription &&
        selectedSubscription !== "" &&
        serviceDiscount ? (
          <View style={styles.width}>
            {renderDiscount(serviceDiscount)}
            <BouncyCheckbox
              fillColor="#3693CF"
              size={40}
              iconStyle={{ borderColor: "#3693CF" }}
              innerIconStyle={{ borderWidth: 2, borderRadius: 15 }}
              isChecked={checkboxState}
              disableBuiltInState
              useNativeDriver={false}
              onPress={async () => setCheckboxState(!checkboxState)}
            />
          </View>
        ) : null}
        {updateValidation && selectedSubscription ? (
          <CustomButton
            text="Lägg till tjänst"
            onPress={async () => {
              await addUserSubscription(
                newSubscription,
                checkboxState,
                serviceDiscount.id,
                formattedDate,
                userId,
              )
            }}
            btnType={"PRIMARY"}
            textType={"PRIMARY"}
          />
        ) : (
          <CustomButton
            text="Välj en tjänst"
            btnType={"ERROR"}
            textType={"ERROR"}
          />
        )}
      </View>
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
    backgroundColor: "white",
  },
  heading: {
    // flex: 1,
    // display: "flex",
    textAlign: "center",
    fontSize: 36,
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
    justifyContent: "center",
  },
  testButton: {
    width: "50%",
    height: 40,
    backgroundColor: "#3693CF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  width: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
})

export default ProductAddScreen
