import React, { useState, useEffect } from "react"
import { Image, View, Pressable, Text, Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"

import supabase from "../../lib/initSupabase"
import { decode, encode } from "base64-arraybuffer"

const ProfileImageHandler = () => {
  const [userId, setUserId] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
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

  // Function for fetching the profile image - MV
  const fetchProfileImage = async () => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .list(`${userId}/`)

    if (error) {
      Alert.alert("Något gick fel vid bildhämtning", error.message)
    } else if (data.length > 0) {
      // Sorts out / defines the newest upload in the database
      const newestImage = data.reduce((prev, current) => {
        return new Date(prev.updated_at) > new Date(current.updated_at)
          ? prev
          : current
      })

      setProfileImage(newestImage)
    }
  }

  // Function for picking an image from local (phone) gallery - MV
  const pickProfileImage = async () => {
    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!imageResult.canceled) {
      const imageFile = imageResult.assets[0].uri
      // setProfileImage(
      //   imageFile,
      // ) /* This format works to display Base64 images */

      // Decodes from Base64 file data - MV
      const decodedImageFile = decode(imageFile)

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${userId}/${imageFile.split("/").pop()}`, decodedImageFile, {
          contentType: ["image/png", "image/jpeg"],
          upsert: true,
        })

      if (error) {
        Alert.alert(error.message)
      }
    }
    fetchProfileImage()
  }

  // Function to set the data URI based on image type
  const getImageUri = (imageType, imageBase64) => {
    console.log("Image Type:", imageType) // Log imageType
    console.log("Image Base64:", imageBase64) // Log imageBase64

    if (imageType && imageType.startsWith("image/")) {
      return `data:${imageType};base64,${imageBase64}`
    }
    // Handle other image types as needed
    return null // Default fallback
  }

  useEffect(() => {
    fetchUser()
  }, [])

  console.log("Profile Image:", profileImage)
  console.log(
    "Image URL:",
    getImageUri(profileImage?.metadata?.mimetype, profileImage?.name),
  )

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {
        <Pressable onPress={pickProfileImage}>
          {profileImage && (
            <Image
              source={{
                uri: getImageUri(
                  profileImage?.metadata?.mimetype,
                  profileImage?.name,
                ),
              }}
              style={{ width: imageSize, height: imageSize }}
            />
          )}
          {!profileImage && (
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
