import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import todayQListImage from "../assets/todayQList.png";
import QImage from "../assets/Qimage.png";
import AImage from "../assets/Aimage.png";
import downIcon from "../assets/chevron-down.png";
import upIcon from "../assets/chevron-up.png";

const TodayQuestionList = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          console.error("Token not available");
          return;
        }

        const response = await axios.get(
          "http://192.168.0.19:8080/api/dailyquestion",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API response:", response.data);

        if (response.data) {
          setQuestionData(response.data);
        } else {
          console.error("Error during response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <ScrollView style={styles.fullcontainer}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>오늘의 질문 목록</Text>
          <Text style={styles.subtitle}>
            매일매일 작성했던 답변을 확인해보세요
          </Text>
          <Image source={todayQListImage} style={styles.image} />
        </View>
        {questionData.length > 0 &&
          questionData
            .slice(0)
            .reverse()
            .map((item) => (
              <TouchableOpacity
                key={item.questionId}
                onPress={() => toggleExpand(item.questionId)}
              >
                <View style={styles.questionContainer}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionDate}>{item.date}</Text>
                  </View>
                  <View style={styles.questionContent}>
                    <Image source={QImage} style={styles.Qicon} />
                    <Text style={styles.questionText}>{item.question}</Text>
                    <Image
                      source={
                        expandedId === item.questionId ? upIcon : downIcon
                      }
                      style={styles.icon}
                    />
                  </View>
                  {expandedId === item.questionId && (
                    <View style={styles.answerContainer}>
                      <Image source={AImage} style={styles.Aicon} />
                      <Text style={styles.answerText}>{item.text}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
      </View>
    </ScrollView>
  );
};

export default TodayQuestionList;

const styles = StyleSheet.create({
  fullcontainer: {
    paddingTop: 27,
    backgroundColor: "#F7F8FF",
    flex: 1,
  },
  container: {
    marginBottom: 75,
  },
  titleContainer: {
    position: "relative",
    paddingLeft: 35,
    marginBottom: 20,
  },
  title: {
    fontFamily: "NotoSans",
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 28 * 1.12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "NotoSans",
    lineHeight: 28 * 1.12,
    fontSize: 14,
    color: "#838383",
    marginBottom: 10,
  },
  image: {
    position: "absolute",
    left: 240,
    top: 9,
  },
  questionContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 15,
    borderRadius: 20,
  },
  questionDate: {
    fontFamily: "NotoSans",
    fontSize: 12,
    color: "#838383",
    marginLeft: 30,
  },
  questionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 9,
    marginRight: 10,
  },
  questionText: {
    fontFamily: "NotoSans",
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
    margin: 10,
  },
  answerContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  answerText: {
    fontFamily: "NotoSans",
    fontSize: 15,
    lineHeight: 20,
    margin: 10,
    marginRight: 40,
  },
  Qicon: {
    width: 24,
    height: 24,
  },
  Aicon: {
    width: 24,
    height: 24,
  },
});
