import React, { useState, useEffect } from "react"
import { Image, View, Pressable, Text, Alert } from "react-native"
import { REACT_NATIVE_SUPABASE_URL } from "@env"

import * as ImagePicker from "expo-image-picker"

import { FileObject } from "@supabase/storage-js"

import supabase from "../../lib/initSupabase"
import { decode, encode } from "base64-arraybuffer"

const ProfileImageHandler = () => {
  const [userId, setUserId] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const imageSize = 150
  const bucketUrl = `${REACT_NATIVE_SUPABASE_URL}/storage/v1/object/public/avatars/`

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
  const fetchLatestUploadedImageName = async () => {
    // Fetches a list object showing all images in the bucket - MV
    const { data, error } = await supabase.storage
      .from("avatars")
      .list(`${userId}/`)

    if (error) {
      Alert.alert("Något gick fel vid inläsning av lista", error.message)
    } else if (data.length > 0) {
      // Sorts out / defines the newest upload in the database - MV
      const newestImage = data.reduce((prev, current) => {
        return new Date(prev.updated_at) > new Date(current.updated_at)
          ? prev
          : current
      })

      // Collects the name of the newest inage - MV
      const newestImageName = newestImage?.name

      return newestImageName
    }
  }

  // Downloads the image itself - MV
  const downloadImage = async (imageName) => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(`${userId}/${imageName}`)

    if (error) {
      Alert.alert("Något gick fel vid bildhämtning", error.message)
    } else if (data.size > 0) {
      // This file reader understands the "Blob" format - MV

      const fr = new FileReader()
      fr.readAsDataURL(data)

      // The file reader uses an event listener to trigger - MV
      fr.onload = () => {
        const imageUrl = fr.result // This will contain the data URL - MV
        console.log(`Data URL: ${imageUrl}`)

        const regex = /data:.*?;base64,/g
        const imageUrlBase64 = imageUrl.replace(regex, "")

        console.log(`base64 URL: ${imageUrlBase64}`)

        setProfileImage(imageUrlBase64)
      }
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
      console.log(imageFile)
      // Get the MIME Type: --MV
      const mimeType = imageFile.split(";")[0].split(":")[1]
      // Get the File extension: --MV
      const fileExtension = mimeType.split("/")[1]
      // setProfileImage(
      //   imageFile,
      // ) /* This format works to display Base64 images */

      // Decodes from Base64 file data - MV
      const decodedImageFile = decode(imageFile)

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${userId}/${imageFile.split("/").pop()}`, decodedImageFile, {
          contentType: `${mimeType}`,
          upsert: true,
        })
      if (data) {
        const name = await fetchLatestUploadedImageName()
        downloadImage(name)
      } else if (error) {
        Alert.alert(error.message)
      }
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {
        <Pressable onPress={pickProfileImage}>
          {console.log(`image URL: ${profileImage}`)}
          {profileImage && (
            <Image
              style={{
                width: imageSize,
                height: imageSize,
                backgroundColor: "white",
                resizeMode: "contain",
              }}
              source={{
                uri: `${profileImage}`,
              }}
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
