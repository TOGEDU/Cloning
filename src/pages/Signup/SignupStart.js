import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const happy = require("../../assets/happyparent.png");

const SignupStart = () => {
  const navigation = useNavigation();

  const navigateToParentSignup = () => {
    navigation.navigate("ParentSignup");
  };
  const navigateToChildSignup = () => {
    navigation.navigate("ChildSignup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>환영합니다. 회원님</Text>
      <Text style={styles.instructionText}>가입 유형을 선택해 주세요</Text>
      <Image source={happy} style={styles.img} />
      <TouchableOpacity
        style={styles.signupOption}
        onPress={navigateToParentSignup}
      >
        <Text style={styles.optionTitle}>부모로 가입하기</Text>
        <Text style={styles.optionDescription}>
          우리 아이를 위한 나의 복제 AI를 만들고 {"\n"}아이가 대화하게 할 수
          있어요.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupOption}
        onPress={navigateToChildSignup}
      >
        <Text style={styles.optionTitle}>자식으로 가입하기</Text>
        <Text style={styles.optionDescription}>
          앱을 통해 ai부모와 대화하고{"\n"}목소리를 들을 수 있어요.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupStart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6B73FF",
    padding: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontFamily: "NotoSans600",
    color: "#fff",
    marginBottom: 13,
    alignSelf: "flex-start",
    marginLeft: 30,
  },
  instructionText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "NotoSans500",
    marginBottom: 35,
    alignSelf: "flex-start",
    marginLeft: 30,
  },
  img: {
    width: 198,
    height: 130,
    marginLeft: 130,
  },
  signupOption: {
    width: 310,
    height: 126,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
  },
  optionTitle: {
    fontSize: 24,
    fontFamily: "NotoSans600",
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: "NotoSans500",
    color: "#9B9B9B",
  },
});
