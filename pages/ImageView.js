// ImageView.js
import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";

const ImageView = () => {
  const route = useRoute();
  const { imageSource } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={smallLogo} style={styles.smallLogo} />
        <Image source={logotext} style={styles.logotext} />
      </View>
      <View style={styles.imgcontainer}>
        <Text style={styles.date}>JUN 6, 2024</Text>
        <Image source={imageSource} style={styles.image} />
      </View>
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
  imgcontainer: {
    paddingTop: 10,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  date: {
    alignItems: "center",
    justifyContent: "center",
    color: "#ccc",
    fontSize: 12,
    //backgroundColor: "yellow",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 490,
    resizeMode: "contain",
    backgroundColor: "#ccc",
  },
});

export default ImageView;
