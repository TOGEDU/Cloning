import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const img = require("../../assets/signupfinish.png");

const ParentChildInfo = () => {
  const navigation = useNavigation();
  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입 완료!!</Text>
      <Image source={img} style={styles.img} />
      <TouchableOpacity style={styles.nextBtn} onPress={handleLoginPress}>
        <Text style={styles.nextBtnText}>로그인하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentChildInfo;

const styles = StyleSheet.create({
  container: {
    paddingTop: 152,
    alignItems: "center",
    backgroundColor: "#ABB0FE",
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontFamily: "NotoSans600",
    color: "#fff",
    marginBottom: 50,
  },
  img: {
    width: 133,
    height: 341,
  },

  nextBtn: {
    backgroundColor: "#6369D4",
    width: 245,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 31,
  },
  nextBtnText: {
    fontSize: 15,
    fontFamily: "NotoSans600",
    color: "#fff",
  },
});
