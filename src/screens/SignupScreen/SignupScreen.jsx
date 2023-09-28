import React, { useState } from "react"
import supabase from "../../lib/initSupabase"
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native"
import Logo from "../../../assets/adaptive-icon.png"
import InputField from "../../components/InputField"
import CustomButton from "../../components/CustomButton"
import Spinner from "react-native-loading-spinner-overlay"
import TermsModal from "./../../components/Modals/TermsModal"
import SuccessModal from "./../../components/Modals/SuccessModal"
import ErrorModal from "./../../components/Modals/ErrorModal"

const btn = {
  "1st": "PRIMARY",
  "2nd": "SECONDARY",
  "3rd": "TERTIARY",
}

const SignupScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const { height } = useWindowDimensions()

  const onSignupPressed = async () => {
    if (isChecked) {
      setShowTermsModal(true)
    } else {
      setShowErrorModal(true)
    }
  }

  const handleTermsAccept = () => {
    setShowTermsModal(false)
    setShowSuccessModal(true)
    setTimeout(() => {
      setShowSuccessModal(false)
      sendToSupabase(email, password)
    }, 3000)
  }

  const sendToSupabase = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (!error && data)
      console.log("Registrering godkänd. Bekräfta via angiven e-post")
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.3 }]}
        resizeMode="contain"
      />
      <InputField placeholder="Email" value={email} setValue={setEmail} />
      <InputField
        placeholder="Lösenord"
        value={password}
        setValue={setPassword}
        isPassword
      />
      <CustomButton
        text="Registrera konto"
        onPress={onSignupPressed}
        btnType={btn["2nd"]}
      />
      <View>
        <Spinner visible={loading} />
      </View>

      <TermsModal isVisible={showTermsModal} onAccept={handleTermsAccept} />
      <SuccessModal isVisible={showSuccessModal} />
      <ErrorModal
        isVisible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#3693CF",
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxHeight: 300,
  },
})

export default SignupScreen
