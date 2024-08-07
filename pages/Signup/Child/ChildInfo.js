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

const ChildInfo = () => {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem("name", name);
      await AsyncStorage.setItem("birthDate", birth);
      navigation.navigate("ChildIdPw");
      console.log("name:", name);
      console.log("birthDate:", birth);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>이름과 생년월일을{"\n"}입력해 주세요.</Text>

        <View style={styles.lineContainer}>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.line}></View>
        </View>
        <View style={styles.nameInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="생년월일 (예: 2000-01-01)"
            value={birth}
            onChangeText={(text) => {
              setBirth(text);
            }}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.inputIconRight}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="26"
              viewBox="0 0 24 26"
              fill="none"
            >
              <Path
                d="M3.41822 25.2976C2.73071 25.2976 2.14196 25.0526 1.65196 24.5626C1.16196 24.0726 0.917382 23.4843 0.918215 22.7976V5.29761C0.918215 4.61011 1.16322 4.02136 1.65322 3.53136C2.14322 3.04136 2.73155 2.79677 3.41822 2.79761H4.66822V0.297607H7.16822V2.79761H17.1682V0.297607H19.6682V2.79761H20.9182C21.6057 2.79761 22.1945 3.04261 22.6845 3.53261C23.1745 4.02261 23.419 4.61094 23.4182 5.29761V22.7976C23.4182 23.4851 23.1732 24.0739 22.6832 24.5639C22.1932 25.0539 21.6049 25.2984 20.9182 25.2976H3.41822ZM3.41822 22.7976H20.9182V10.2976H3.41822V22.7976ZM3.41822 7.79761H20.9182V5.29761H3.41822V7.79761ZM12.1682 15.2976C11.814 15.2976 11.517 15.1776 11.277 14.9376C11.037 14.6976 10.9174 14.4009 10.9182 14.0476C10.9182 13.6934 11.0382 13.3964 11.2782 13.1564C11.5182 12.9164 11.8149 12.7968 12.1682 12.7976C12.5224 12.7976 12.8195 12.9176 13.0595 13.1576C13.2995 13.3976 13.419 13.6943 13.4182 14.0476C13.4182 14.4018 13.2982 14.6989 13.0582 14.9389C12.8182 15.1789 12.5215 15.2984 12.1682 15.2976ZM7.16822 15.2976C6.81405 15.2976 6.51697 15.1776 6.27697 14.9376C6.03697 14.6976 5.91738 14.4009 5.91822 14.0476C5.91822 13.6934 6.03822 13.3964 6.27822 13.1564C6.51822 12.9164 6.81488 12.7968 7.16822 12.7976C7.52238 12.7976 7.81947 12.9176 8.05947 13.1576C8.29947 13.3976 8.41905 13.6943 8.41822 14.0476C8.41822 14.4018 8.29821 14.6989 8.05822 14.9389C7.81822 15.1789 7.52155 15.2984 7.16822 15.2976ZM17.1682 15.2976C16.814 15.2976 16.517 15.1776 16.277 14.9376C16.037 14.6976 15.9174 14.4009 15.9182 14.0476C15.9182 13.6934 16.0382 13.3964 16.2782 13.1564C16.5182 12.9164 16.8149 12.7968 17.1682 12.7976C17.5224 12.7976 17.8195 12.9176 18.0595 13.1576C18.2995 13.3976 18.419 13.6943 18.4182 14.0476C18.4182 14.4018 18.2982 14.6989 18.0582 14.9389C17.8182 15.1789 17.5215 15.2984 17.1682 15.2976ZM12.1682 20.2976C11.814 20.2976 11.517 20.1776 11.277 19.9376C11.037 19.6976 10.9174 19.4009 10.9182 19.0476C10.9182 18.6934 11.0382 18.3964 11.2782 18.1564C11.5182 17.9164 11.8149 17.7968 12.1682 17.7976C12.5224 17.7976 12.8195 17.9176 13.0595 18.1576C13.2995 18.3976 13.419 18.6943 13.4182 19.0476C13.4182 19.4018 13.2982 19.6989 13.0582 19.9389C12.8182 20.1789 12.5215 20.2984 12.1682 20.2976ZM7.16822 20.2976C6.81405 20.2976 6.51697 20.1776 6.27697 19.9376C6.03697 19.6976 5.91738 19.4009 5.91822 19.0476C5.91822 18.6934 6.03822 18.3964 6.27822 18.1564C6.51822 17.9164 6.81488 17.7968 7.16822 17.7976C7.52238 17.7976 7.81947 17.9176 8.05947 18.1576C8.29947 18.3976 8.41905 18.6943 8.41822 19.0476C8.41822 19.4018 8.29821 19.6989 8.05822 19.9389C7.81822 20.1789 7.52155 20.2984 7.16822 20.2976ZM17.1682 20.2976C16.814 20.2976 16.517 20.1776 16.277 19.9376C16.037 19.6976 15.9174 19.4009 15.9182 19.0476C15.9182 18.6934 16.0382 18.3964 16.2782 18.1564C16.5182 17.9164 16.8149 17.7968 17.1682 17.7976C17.5224 17.7976 17.8195 17.9176 18.0595 18.1576C18.2995 18.3976 18.419 18.6943 18.4182 19.0476C18.4182 19.4018 18.2982 19.6989 18.0582 19.9389C17.8182 20.1789 17.5215 20.2984 17.1682 20.2976Z"
                fill="black"
                fill-opacity="0.5"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>다음</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChildInfo;

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
    fontFamily: "NotoSans700",
    alignSelf: "flex-start",
  },

  lineContainer: {
    marginTop: 85,
    flexDirection: "row",
    marginBottom: 50,
  },
  lineColor: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: "#6369D4",
  },
  line: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: "#DADBF5",
  },
  nameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    width: 350,
    height: 54,
    marginBottom: 13,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    width: 350,
    height: 54,
    marginBottom: 13,
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    fontFamily: "NotoSans500",
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
    fontFamily: "NotoSans600",
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
    fontFamily: "NotoSans600",
    color: "#fff",
  },
});
