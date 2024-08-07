import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ParentChildInfo = () => {
  const [children, setChildren] = useState([{ name: "" }]);
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = async () => {
    try {
      const parentId = await AsyncStorage.getItem("parentId");
      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      const pushNotificationTime = await AsyncStorage.getItem(
        "pushNotificationTime"
      );
      const childNameList = children.map((child) => ({ name: child.name }));
      console.log("parentId:", parentId);
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("pushTime: ", pushNotificationTime);
      console.log("child:", childNameList);
      const response = await axios.post(
        "http://192.168.0.19:8080/api/sign/parent/sign-up",
        {
          parentId: parentId,
          name: "사용자",
          email: email,
          password: password,
          childNameList: childNameList,
          pushNotificationTime: pushNotificationTime,
        }
      );

      if (response.data.success) {
        navigation.navigate("SignupFinish");
        console.log(response);
      } else {
        console.error("Signup failed:", response.data.msg);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleAddChild = () => {
    setChildren([...children, { name: "" }]);
  };

  const handleNameChange = (text, index) => {
    const newChildren = [...children];
    newChildren[index].name = text;
    setChildren(newChildren);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>자녀 정보를 입력해 주세요.</Text>
        <Text style={styles.subtitle}>
          자녀마다 다르게 조언을 해 줄 수 있어요.
        </Text>
        <View style={styles.lineContainer}>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
        </View>
        {children.map((child, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="자녀 이름"
              value={child.name}
              onChangeText={(text) => handleNameChange(text, index)}
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.addChildContainer}
          onPress={handleAddChild}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={styles.inputIconRight}
          >
            <Path
              d="M14.25 8C14.25 8.19891 14.171 8.38968 14.0303 8.53033C13.8897 8.67098 13.6989 8.75 13.5 8.75H8.75V13.5C8.75 13.6989 8.67098 13.8897 8.53033 14.0303C8.38968 14.171 8.19891 14.25 8 14.25C7.80109 14.25 7.61032 14.171 7.46967 14.0303C7.32902 13.8897 7.25 13.6989 7.25 13.5V8.75H2.5C2.30109 8.75 2.11032 8.67098 1.96967 8.53033C1.82902 8.38968 1.75 8.19891 1.75 8C1.75 7.80109 1.82902 7.61032 1.96967 7.46967C2.11032 7.32902 2.30109 7.25 2.5 7.25H7.25V2.5C7.25 2.30109 7.32902 2.11032 7.46967 1.96967C7.61032 1.82902 7.80109 1.75 8 1.75C8.19891 1.75 8.38968 1.82902 8.53033 1.96967C8.67098 2.11032 8.75 2.30109 8.75 2.5V7.25H13.5C13.6989 7.25 13.8897 7.32902 14.0303 7.46967C14.171 7.61032 14.25 7.80109 14.25 8Z"
              fill="black"
            />
          </Svg>
          <Text style={styles.addChildText}>자녀 추가</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>완료</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ParentChildInfo;

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 30,
    marginLeft: 33,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 20,
    marginTop: 23,
    textAlign: "center",
    alignSelf: "flex-start",
    textAlign: "left",
    marginLeft: 33,
  },
  lineContainer: {
    marginTop: 50,
    flexDirection: "row",
    marginBottom: 50,
  },
  lineColor: {
    width: 55,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: "#6369D4",
  },
  line: {
    width: 55,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: "#DADBF5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    width: 350,
    height: 54,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputIconRight: {
    opacity: 0.5,
  },
  addChildContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  addChildText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#7D7C7C",
  },
  backBtn: {
    backgroundColor: "#ABB0FE",
    width: 245,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 109,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
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
    fontWeight: "bold",
    color: "#fff",
  },
});
