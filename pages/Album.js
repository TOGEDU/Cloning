// Album.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";

const images = [
  require("../assets/logo.png"),
  require("../assets/logo.png"),
  require("../assets/logo.png"),
  require("../assets/logo.png"),
  require("../assets/logo.png"),
  require("../assets/sat.png"),
];

const Album = () => {
  const navigation = useNavigation();

  const handleImagePress = (imageSource) => {
    navigation.navigate("ImageView", { imageSource });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={smallLogo} style={styles.smallLogo} />
        <Image source={logotext} style={styles.logotext} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(image)}
            >
              <Image source={image} style={styles.imagePlaceholder} />
            </TouchableOpacity>
          ))}
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
    //backgroundColor: "pink",
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
    //aspectRatio: 1, // 정사각형을 유지하기 위해
    backgroundColor: "#ccc",
    marginBottom: 15,
  },
});

export default Album;
