import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { GlobalStyles } from "../../../constants/styles";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const ParentPush = () => {
  const [selectedTime, setSelectedTime] = useState("오전 09:00");
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };
  const handleNext = () => {
    navigation.navigate("SignupFinish");
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
    <View style={styles.outerContainer}>
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
          <View style={styles.lineColor}></View>
        </View>
        <View style={styles.inputContainer}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            style={styles.inputIconLeft}
          >
            <Path
              d="M12.5 0C10.0277 0 7.61099 0.733112 5.55538 2.10663C3.49976 3.48015 1.89761 5.43238 0.951511 7.71645C0.00541606 10.0005 -0.242126 12.5139 0.24019 14.9386C0.722505 17.3634 1.91301 19.5907 3.66117 21.3388C5.40933 23.087 7.63661 24.2775 10.0614 24.7598C12.4861 25.2421 14.9995 24.9946 17.2835 24.0485C19.5676 23.1024 21.5199 21.5002 22.8934 19.4446C24.2669 17.389 25 14.9723 25 12.5C24.9965 9.18587 23.6784 6.00848 21.335 3.66503C18.9915 1.32158 15.8141 0.00349978 12.5 0ZM12.5 23.0769C10.4081 23.0769 8.36315 22.4566 6.62378 21.2944C4.88441 20.1322 3.52874 18.4803 2.7282 16.5476C1.92766 14.6149 1.7182 12.4883 2.12631 10.4365C2.53443 8.38482 3.54178 6.50019 5.02099 5.02099C6.5002 3.54178 8.38483 2.53442 10.4365 2.12631C12.4883 1.7182 14.6149 1.92765 16.5476 2.7282C18.4803 3.52874 20.1322 4.88441 21.2944 6.62377C22.4566 8.36314 23.0769 10.4081 23.0769 12.5C23.0737 15.3042 21.9584 17.9926 19.9755 19.9755C17.9926 21.9584 15.3042 23.0737 12.5 23.0769ZM20.1923 12.5C20.1923 12.755 20.091 12.9996 19.9107 13.1799C19.7304 13.3602 19.4858 13.4615 19.2308 13.4615H12.5C12.245 13.4615 12.0004 13.3602 11.8201 13.1799C11.6398 12.9996 11.5385 12.755 11.5385 12.5V5.76923C11.5385 5.51421 11.6398 5.26964 11.8201 5.08932C12.0004 4.909 12.245 4.80769 12.5 4.80769C12.755 4.80769 12.9996 4.909 13.1799 5.08932C13.3602 5.26964 13.4615 5.51421 13.4615 5.76923V11.5385H19.2308C19.4858 11.5385 19.7304 11.6398 19.9107 11.8201C20.091 12.0004 20.1923 12.245 20.1923 12.5Z"
              fill="black"
            />
          </Svg>
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
          <Text style={styles.nextBtnText}>회원가입 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary100,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    marginTop: 70,
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
    marginTop: 23,
    flexDirection: "row",
  },
  lineColor: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: GlobalStyles.colors.primary100,
  },
  line: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: GlobalStyles.colors.primary300,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 44,
    backgroundColor: "#E3E3E3",
    borderRadius: 15,
    width: 350,
    height: 54,
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
  inputIconLeft: {
    marginLeft: 10,
  },
  inputIconRight: {
    marginRight: 10,
  },
  backBtn: {
    backgroundColor: GlobalStyles.colors.primary300,
    width: 350,
    height: 59,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 109,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  nextBtn: {
    backgroundColor: GlobalStyles.colors.primary200,
    width: 350,
    height: 59,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 31,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
});

export default ParentPush;
