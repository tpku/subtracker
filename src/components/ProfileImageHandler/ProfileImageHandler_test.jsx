import React, { useState, useEffect } from "react"
import { Image, View, Pressable, Text, Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"

import supabase from "../../lib/initSupabase"
import { decode } from "base64-arraybuffer"

const ProfileImageHandler = () => {
  const [profileImage, setProfileImage] = useState(null)
  const [userId, setUserId] = useState(null)
  const imageSize = 150

  // Checks for the authenticated user - MV
  const fetchUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user !== null) {
        setUserId(user.id)
      }
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  useEffect(() => {
    fetchUser()
  })

  // const uploadImage = async () => {
  //   let imageFile = selectedImage.assets[0].uri

  //   const { data, error } = await supabase.storage
  //     .from("avatars")
  //     .upload(`${userId}/`, imageFile)

  //   if (data) {
  //     console.log("There is data!")
  //     console.log(data)
  //   } else {
  //     Alert.alert(error.message)
  //   }
  // }

  // Function for picking an image from local (phone) gallery - MV
  const pickProfileImage = async () => {
    const selectedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!selectedImage.canceled) {
      let imageFile = selectedImage.assets[0].uri

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${userId}/${imageFile}`, decode("base64FileData"))

      // const { data, error } = await supabase.storage
      //   .from("avatars")
      //   .upload(`${userId}/`, imageFile, decode("base64FileData"), {
      //     contentType: "image/png",
      //   })

      if (data) {
        console.log("There is data!")
        console.log(data)
      } else {
        Alert.alert(error.message)
      }
      // setProfileImage(selectedImage.assets[0].uri)
      // const imageFile = selectedImage.assets[0].uri
      // const { error } = await supabase.storage
      //   .from("avatars")
      //   .upload(`${userId}/`, imageFile)
      // if (error) {
      //   Alert.alert("Något gick fel vid uppladdning", error.message)
      // } else {
      //   fetchProfileImage()
      // }
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {
        <Pressable onPress={pickProfileImage}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: imageSize, height: imageSize }}
            />
          ) : (
            <View
              style={{
                width: imageSize,
                height: imageSize,
                backgroundColor: "black",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{ color: "white" }}>Välj profilbild</Text>
            </View>
          )}
        </Pressable>
      }
    </View>
  )
}

export default ProfileImageHandler
