import React from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";

const introduceImg = require("../assets/introduce.png");

const Introduce = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.imgContainer}>
            <Image source={introduceImg} style={styles.image} />
        </View> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer:{
        paddingTop: 50
  },
  image: {

    resizeMode: "cover",
  },
});

export default Introduce;
