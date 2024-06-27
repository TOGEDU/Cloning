import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import todayQListImage from "../assets/todayQList.png";
import QImage from "../assets/Qimage.png";
import AImage from "../assets/Aimage.png";
import downIcon from "../assets/chevron-down.png";
import upIcon from "../assets/chevron-up.png";

const questionData = [
  {
    id: 1,
    date: "2024.06.20",
    question: "과거 처음의 일기..데이터 어떻게 쌓이는지 보자고",
    answer:
      "오늘 학교에서 친구와 다퉜다고 힘들었겠구나. 너의 마음이 어려웠을 거라고 알아. 친구와 다투는 건 어렵고 슬픈 일이지만, 때로는 그런 상황도 있어. 그럴 때마다 당황스러워하고 속상해하는 건 당연한 거야.",
  },
  {
    id: 2,
    date: "2024.06.21",
    question: "아이가 학교에서 친구와 다투고 온 날 해주고 싶은말은 무엇인가요?",
    answer:
      "오늘 학교에서 친구와 다퉜다고 힘들었겠구나. 너의 마음이 어려웠을 거라고 알아. 친구와 다투는 건 어렵고 슬픈 일이지만, 때로는 그런 상황도 있어. 그럴 때마다 당황스러워하고 속상해하는 건 당연한 거야.",
  },
  {
    id: 3,
    date: "2024.06.22",
    question: "22일 질문이 들어갈 내용입니다.",
    answer: "22일 답변이 들어갈 내용입니다.",
  },
  {
    id: 4,
    date: "2024.06.23",
    question: "23일 질문이 들어갈 내용입니다.",
    answer: "23일 답변이 들어갈 내용입니다.",
  },
  {
    id: 5,
    date: "2024.06.24",
    question: "24일 질문이 들어갈 내용입니다.",
    answer: "24일 답변이 들어갈 내용입니다.",
  },
  {
    id: 6,
    date: "2024.06.25",
    question: "25일 질문이 들어갈 내용입니다.",
    answer: "25일 답변이 들어갈 내용입니다.",
  },
  {
    id: 7,
    date: "2024.06.26",
    question: "아이가 학교에서 친구와 다투고 온 날 해주고 싶은말은 무엇인가요?",
    answer:
      "오늘 학교에서 친구와 다퉜다고 힘들었겠구나. 너의 마음이 어려웠을 거라고 알아. 친구와 다투는 건 어렵고 슬픈 일이지만, 때로는 그런 상황도 있어. 그럴 때마다 당황스러워하고 속상해하는 건 당연한 거야.",
  },
  // 추가적인 질문 데이터는 필요에 따라 추가합니다.
];

const TodayQuestionList = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
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
        {questionData
          .slice(0)
          .reverse()
          .map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleExpand(item.id)}
            >
              <View style={styles.questionContainer}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionDate}>{item.date}</Text>
                </View>
                <View style={styles.questionContent}>
                  <Image source={QImage} style={styles.Qicon} />
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Image
                    source={expandedId === item.id ? upIcon : downIcon}
                    style={styles.icon}
                  />
                </View>
                {expandedId === item.id && (
                  <View style={styles.answerContainer}>
                    <Image source={AImage} style={styles.Aicon} />
                    <Text style={styles.answerText}>{item.answer}</Text>
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
    //paddingTop: 27,
    //backgroundColor: "#F7F8FF",
    //flex: 1,
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
  questionHeader: {
    //flexDirection: "row",
    //justifyContent: "space-between",
    //alignItems: "center",
    //marginBottom: 8,
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
    //marginBottom: 10,
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
});
