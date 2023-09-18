import React, { useState, useEffect } from "react"
import { Image, View, Pressable, Text, Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"

import supabase from "../../lib/initSupabase"

const ProfileImageHandler = ({ user }) => {
  const [profileImage, setProfileImage] = useState([])
  const [userId, setUserId] = useState("")
  const imageSize = 150

  // Function for fetching the profile imag - MV
  const fetchProfileImage = async () => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .list(`${userId}/`)

    if (error) {
      Alert.alert("Något gick fel vid bildhämtning", error.message)
    } else if (data.length > 0) {
      setProfileImage(data[0].name)
      console.log(profileImage)
    }
  }

  // Fetching the image (if there is one). MV
  useEffect(() => {
    if (user) {
      setUserId(user.id)
      console.log(user)
      fetchProfileImage()
    }
  }, [user])

  // Function for picking an image from local (phone) gallery - MV
  const pickProfileImage = async () => {
    const selectedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    // console.log(selectedImage.assets[0].uri)

    if (!selectedImage.canceled) {
      const imageFile = selectedImage.assets[0].uri
      const { error } = await supabase.storage
        .from("avatars")
        .upload(`${userId}/`, imageFile)

      if (error) {
        Alert.alert("Något gick fel vid uppladdning", error.message)
      } else {
        fetchProfileImage()
      }
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {user && (
        <Pressable onPress={pickProfileImage}>
          {profileImage ? (
            profileImage && (
              <Image
                source={{ uri: profileImage }}
                style={{ width: imageSize, height: imageSize }}
              />
            )
          ) : (
            <View
              style={{
                width: imageSize,
                height: imageSize,
                backgroundColor: "black",
                alignContent: "center",
                justifyContent: "center",
              }}>
              <Text style={{ color: "white" }}>Välj profilbild</Text>
            </View>
          )}
        </Pressable>
      )}
    </View>
  )
}

export default ProfileImageHandler
