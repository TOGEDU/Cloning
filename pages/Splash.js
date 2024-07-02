import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 2000); // 2초 후 로그인 화면으로 이동
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CLONING</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#858AE8",
  },
});

export default Splash;
