import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const ParentChildInfo = () => {
  const [text, onChangeText] = useState("");
  const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };
  const handleNext=()=>{
    navigation.navigate("ParentPush")
  }
  
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>자녀 정보를 입력해 주세요.</Text>
        <Text style={styles.subtitle}>
          자녀마다 다르게 조언을 해 줄 수 있어요.{" "}
        </Text>
        <View style={styles.lineContainer}>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.line}></View>
        </View>
        <View style={styles.inputContainer}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            style={styles.inputIconLeft}
          >
            <Path
              d="M15 10C16.3807 10 17.5 8.88071 17.5 7.5C17.5 6.11929 16.3807 5 15 5C13.6193 5 12.5 6.11929 12.5 7.5C12.5 8.88071 13.6193 10 15 10Z"
              fill="black"
            />
            <Path
              d="M17.5 11.25H12.5C12.3059 11.25 12.1146 11.2952 11.941 11.382C11.7674 11.4688 11.6164 11.5948 11.5 11.75L7.75 16.75L9.75 18.25L11.25 16.25V25H13.75V20H16.25V25H18.75V16.25L20.25 18.25L22.25 16.75L18.5 11.75C18.3836 11.5948 18.2326 11.4688 18.059 11.382C17.8854 11.2952 17.6941 11.25 17.5 11.25Z"
              fill="black"
            />
          </Svg>
          <TextInput
            style={styles.input}
            placeholder="자녀 이름"
            value={text}
            onChangeText={onChangeText}
          />
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
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.nextBtn}
        >
          <Text style={styles.nextBtnText}>다음</Text>
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

export default ParentChildInfo;
