import React, { useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const img = require("../assets/todayquestionimg.png");

const TodayQuestion = () => {
  const answerInputRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <View style={styles.container}>
        <View style={styles.topBackground}>
          <Text style={styles.title}>
            자녀에게 해주고 싶은 한 마디! {"\n"}질문에 답변해 주세요
          </Text>
          <Image source={img} style={styles.img} />
        </View>
        <View style={styles.middleBox}>
          <Text style={styles.middleText}>
            아이가 학교에서 친구와 다투고 온 날{"\n"}해주고 싶은 말은
            무엇인가요?
          </Text>
        </View>

        <View style={styles.answerBox}>
          <TextInput
            style={styles.answerInput}
            placeholder="답변을 입력해 주세요"
            placeholderTextColor="#AEAEAE"
            multiline
          />
        </View>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>기록하기</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TodayQuestion;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topBackground: {
    backgroundColor: "#ABB0FE",
    height: 318,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 35,
    marginTop: 20,
  },
  img: {
    width: 340,
    height: 195,
  },
  middleBox: {
    width: 331,
    height: 94,
    backgroundColor: "#fff",
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: -47,
  },
  middleText: {
    fontSize: 18,
    letterSpacing: -0.36,
    lineHeight: 27,
  },
  answerBox: {
    width: 331,
    height: 138,
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  answerInput: {
    color: "#AEAEAE",
    fontSize: 16,
    fontWeight: "600",
  },
  btn: {
    width: 143,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: "#6369D4",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120,
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
