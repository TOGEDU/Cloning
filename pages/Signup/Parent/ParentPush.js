import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ParentPush = () => {
  const [selectedTime, setSelectedTime] = useState("오전 09:00");
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };
  const handleNext = async () => {
    try {
      await AsyncStorage.setItem("pushNotificationTime", selectedTime);
      navigation.navigate("ParentChildInfo");
    } catch (error) {
      console.error("Error saving data", error);
    }
  };
  const times = [
    "오전 08:00",
    "오전 09:00",
    "오전 10:00",
    "오전 11:00",
    "오후 12:00",
    "오후 01:00",
    "오후 02:00",
    "오후 03:00",
    "오후 04:00",
    "오후 05:00",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>기록을 도와드릴게요.</Text>
      <Text style={styles.subtitle}>
        매일 전송될 푸시알림 시간을 {"\n"}설정해 주세요.{" "}
      </Text>
      <View style={styles.lineContainer}>
        <View style={styles.lineColor}></View>
        <View style={styles.lineColor}></View>
        <View style={styles.lineColor}></View>
        <View style={styles.lineColor}></View>
        <View style={styles.line}></View>
      </View>
      <View style={styles.inputContainer}>
        <ModalDropdown
          options={times}
          defaultValue={selectedTime}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownStyle}
          dropdownTextStyle={styles.dropdownText}
          onSelect={(index, value) => setSelectedTime(value)}
        />
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          style={styles.inputIconRight}
        >
          <Path
            d="M15 18.75L9.69629 13.4475L11.465 11.68L15 15.215L18.535 11.68L20.3038 13.4475L15 18.75Z"
            fill="#545454"
          />
        </Svg>
      </View>
      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Text style={styles.backBtnText}>이전</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
        <Text style={styles.nextBtnText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentPush;

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
    marginTop: 44,
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    width: 350,
    height: 54,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    fontWeight: "bold",
    justifyContent: "center",
  },
  dropdown: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  dropdownStyle: {
    width: 350,
    height: "auto",
    maxHeight: 200,
    borderRadius: 15,
    backgroundColor: "#E3E3E3",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingRight: 10,
  },

  inputIconRight: {
    opacity: 0.5,
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
