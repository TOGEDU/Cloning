import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";

import BASE_URL from "../api";

const Album = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        if (!authToken) {
          console.error("No auth token found");
          return;
        }

        console.log("Fetching images with token:", authToken);

        const response = await axios.get(`${BASE_URL}/api/gallery`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log("API response:", response.data);

        const { photoList } = response.data;
        setImages(photoList);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImagePress = (image) => {
    navigation.navigate("ImageView", {
      imageSource: image.imgUrl,
      date: image.date,
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer} edges={["top"]}>
        <View style={styles.header}>
          <Image source={smallLogo} style={styles.smallLogo} />
          <Image source={logotext} style={styles.logotext} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(image)}
              >
                <Image
                  source={{ uri: image.imgUrl }}
                  style={styles.imagePlaceholder}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noImagesText}>No images available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: "#ccc",
    marginBottom: 15,
  },
  noImagesText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
});

export default Album;
