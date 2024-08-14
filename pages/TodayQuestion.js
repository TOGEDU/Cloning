import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const img = require("../assets/todayquestionimg.png");

const TodayQuestion = () => {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("Token doesn't exist");
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/dailyquestion`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const todayQuestion = response.data;

        if (todayQuestion && todayQuestion.question) {
          setQuestion(todayQuestion.question);
          setQuestionId(todayQuestion.questionId);

          if (todayQuestion.text) {
            setText(todayQuestion.text);
            setIsEditing(true);
          }
        } 
      } catch (error) {
        console.error("Error fetching question:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      }
    };

    fetchQuestion();
  }, []);

  const handleWriteFinish = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token:", token);
      if (!token) {
        console.error("Token doesn't exist");
        return;
      }

      const response = isEditing
        ? await axios.put(
            `${BASE_URL}/api/dailyquestion`,
            {
              questionId: questionId,
              text: text,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        : await axios.post(
            `${BASE_URL}/api/dailyquestion`,
            {
              questionId: questionId,
              text: text,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

      const successMessage = isEditing
        ? "질문 답변 변경 완료"
        : "질문 답변 추가 완료";

      if (response.data === successMessage) {
        navigation.replace("WriteFinish");
      } else {
        console.error("Error during response:", response.data);
      }
    } catch (error) {
      console.error("Error during request:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
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
            {question ? question : "오늘의 질문이 없습니다."}
          </Text>
        </View>

        <View style={styles.answerBox}>
          <TextInput
            style={styles.answerInput}
            placeholder="답변을 입력해 주세요"
            placeholderTextColor="#AEAEAE"
            multiline
            value={text}
            onChangeText={setText}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleWriteFinish}>
          <Text style={styles.btnText}>
            {isEditing ? "수정하기" : "기록하기"}
          </Text>
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
    flex: 1,
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
    fontFamily: "NotoSans900",
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
    fontFamily: "NotoSans",
    textAlign: "center",
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
    fontFamily: "NotoSans600",
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
    fontFamily: "NotoSans600",
  },
});
