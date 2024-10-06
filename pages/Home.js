import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, G, Defs, Rect, ClipPath } from "react-native-svg";

const todayQbox = require("../assets/todayQbox.png");
const diaryImg = require("../assets/homediary.png");
const recordImg = require("../assets/homemike.png");
const homebellImage = require("../assets/homebell.png");
const check = require("../assets/homecheck.png");

const Home = () => {
  const navigation = useNavigation();

  const handleTodayQuestion = () => {
    navigation.navigate("TodayQuestion");
  };

  const handleDiaryPress = () => {
    navigation.navigate("Diary");
  };
  const handleRecordPress = () => {
    navigation.navigate("Record");
  };
  const handleTodayQuestionListPress = () => {
    navigation.navigate("TodayQuestionList");
  };
  const handleDiaryListPress = () => {
    navigation.navigate("DiaryList");
  };

  const handleWhyRecordPress = () => {
    navigation.navigate("Introduce");
  };

  return (
    <View style={styles.container}>
      <View style={styles.todayQbox}>
        <Text style={styles.todayQboxTitle}>매일 다른 오늘의 질문</Text>
        <Text style={styles.todayQboxSecondTitle}>
          질문에 답하여 부모님의 사랑을 AI에 새겨보세요
        </Text>
        <TouchableOpacity
          style={styles.todayQboxBtn}
          onPress={handleTodayQuestion}
        >
          <Text style={styles.todayQboxBtnText}>답변하러 가기</Text>
        </TouchableOpacity>

        <Image source={todayQbox} style={styles.todayQboxImg} />
      </View>
      <View style={styles.secondboxContainer}>
        <TouchableOpacity style={styles.dirayBox} onPress={handleDiaryPress}>
          <Image source={diaryImg} style={styles.diaryImg} />
          <Text style={styles.BoxText1}>육아일기</Text>
          <Text style={styles.BoxText2}>
            자녀를 위한 일기를 {"\n"} 작성해 주세요
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recordBox} onPress={handleRecordPress}>
          <Image source={recordImg} style={styles.recordImg} />
          <Text style={styles.BoxText1}>음성녹음</Text>
          <Text style={styles.BoxText2}>
            부모님의 목소리를 {"\n"} 녹음해 주세요
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.whyRecord}>
        <TouchableOpacity
          onPress={handleWhyRecordPress}
          style={styles.whyRecordContainer}
        >
          <Image style={styles.whyRecordImg} source={homebellImage} />
          <View>
            <Text style={styles.whyRecordText1}>녹음을 왜 해야 하나요?</Text>
            <Text style={styles.whyRecordText2}>
              녹음한 기록들을 바탕으로 TTS 모델을 구현하게 됩니다
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.confirmBox}>
        <View style={styles.confirmBoxTop}>
          <Image source={check} style={styles.check} />
          <Text style={styles.confirmBoxTitle}>기록들을 확인해 보세요</Text>
        </View>
        <View style={styles.confirmBoxBottom}>
          <View style={styles.confirmBoxBottomList}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
            >
              <Path
                d="M7.5 0C3.375 0 0 2.8 0 6.22222C0 7.93333 0.825 9.48889 2.1 10.5C2.1 10.9667 1.8 12.2111 0 14C1.8 13.9222 3.45 13.2222 4.875 12.0556C5.7 12.2889 6.6 12.4444 7.5 12.4444C11.625 12.4444 15 9.64444 15 6.22222C15 2.8 11.625 0 7.5 0ZM7.5 10.8889C4.2 10.8889 1.5 8.78889 1.5 6.22222C1.5 3.65556 4.2 1.55556 7.5 1.55556C10.8 1.55556 13.5 3.65556 13.5 6.22222C13.5 8.78889 10.8 10.8889 7.5 10.8889ZM7.65 2.72222C6.975 2.72222 6.45 2.87778 6.075 3.11111C5.625 3.42222 5.4 3.88889 5.475 4.43333H6.975C6.975 4.2 7.05 4.04445 7.2 3.96667C7.35 3.88889 7.5 3.81111 7.725 3.81111C7.95 3.81111 8.175 3.88889 8.325 4.04444C8.475 4.2 8.55 4.35556 8.55 4.58889C8.55 4.82222 8.475 4.97778 8.4 5.13333C8.25 5.28889 8.1 5.44444 7.95 5.52222C7.575 5.75556 7.275 5.98889 7.125 6.14444C6.825 6.37778 6.75 6.61111 6.75 7H8.25C8.25 6.76667 8.325 6.61111 8.325 6.45556C8.4 6.3 8.55 6.22222 8.7 6.06667C9.075 5.91111 9.3 5.67778 9.525 5.36667C9.75 5.05556 9.825 4.74444 9.825 4.43333C9.825 3.88889 9.6 3.42222 9.225 3.11111C8.925 2.87778 8.325 2.72222 7.65 2.72222ZM6.75 7.77778V9.33333H8.25V7.77778H6.75Z"
                fill="#545454"
              />
            </Svg>
            <TouchableOpacity onPress={handleTodayQuestionListPress}>
              <Text>오늘의 질문 목록</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.confirmBoxBottomList}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
            >
              <G clipPath="url(#clip0_719_7077)">
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.4992 1.66602C13.8776 1.66588 14.2421 1.82469 14.5196 2.1106C14.7971 2.39651 14.967 2.78839 14.9954 3.20768L14.9992 3.33268V16.666C14.9993 17.0865 14.8564 17.4915 14.599 17.7998C14.3417 18.1081 13.989 18.297 13.6117 18.3285L13.4992 18.3327H4.49917C4.12074 18.3328 3.75624 18.174 3.47876 17.8881C3.20127 17.6022 3.0313 17.2103 3.00292 16.791L2.99917 16.666V15.8327C2.80801 15.8324 2.62414 15.7511 2.48514 15.6053C2.34614 15.4595 2.26249 15.2602 2.25129 15.0482C2.24009 14.8362 2.30218 14.6274 2.42487 14.4645C2.54756 14.3016 2.7216 14.1969 2.91142 14.1718L2.99917 14.166V12.4993C2.80801 12.4991 2.62414 12.4178 2.48514 12.272C2.34614 12.1262 2.26249 11.9269 2.25129 11.7149C2.24009 11.5028 2.30218 11.294 2.42487 11.1312C2.54756 10.9683 2.7216 10.8636 2.91142 10.8385L2.99917 10.8327V9.16602C2.80801 9.16578 2.62414 9.08445 2.48514 8.93864C2.34614 8.79283 2.26249 8.59355 2.25129 8.38152C2.24009 8.16949 2.30218 7.9607 2.42487 7.79782C2.54756 7.63494 2.7216 7.53027 2.91142 7.50518L2.99917 7.49935V5.83268C2.80801 5.83245 2.62414 5.75112 2.48514 5.60531C2.34614 5.4595 2.26249 5.26022 2.25129 5.04819C2.24009 4.83615 2.30218 4.62737 2.42487 4.46449C2.54756 4.30161 2.7216 4.19694 2.91142 4.17185L2.99917 4.16602V3.33268C2.99905 2.9122 3.14197 2.50721 3.39929 2.19889C3.65661 1.89057 4.0093 1.70172 4.38667 1.67018L4.49917 1.66602H13.4992ZM13.4992 3.33268H4.49917V16.666H13.4992V3.33268ZM11.6242 4.99935C11.9038 4.99936 12.1735 5.11512 12.3805 5.32403C12.5875 5.53295 12.7171 5.82005 12.7439 6.12935L12.7492 6.24935V7.91602C12.7492 8.22675 12.645 8.52634 12.457 8.75636C12.2689 8.98639 12.0105 9.13035 11.7322 9.16018L11.6242 9.16602H6.37417C6.09451 9.166 5.82488 9.05025 5.61786 8.84133C5.41083 8.63242 5.28127 8.34532 5.25442 8.03602L5.24917 7.91602V6.24935C5.24918 5.93861 5.35336 5.63902 5.54138 5.409C5.72941 5.17898 5.9878 5.03501 6.26617 5.00518L6.37417 4.99935H11.6242ZM11.2492 6.66602H6.74917V7.49935H11.2492V6.66602Z"
                  fill="#545454"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_719_7077">
                  <Rect width="18" height="20" fill="white" />
                </ClipPath>
              </Defs>
            </Svg>
            <TouchableOpacity onPress={handleDiaryListPress}>
              <Text>육아일기 목록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  todayQbox: {
    width: 331,
    height: 180,
    borderRadius: 30,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#6369D4",
    marginBottom: 30,
    paddingLeft: 14,
    position: "relative",
  },
  todayQboxImg: {
    width: 171,
    height: 150,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  todayQboxTitle: {
    color: "#fff",
    fontFamily: "NotoSans900",
    fontSize: 25,
    marginTop: 40,
    marginBottom: 9,
  },
  todayQboxSecondTitle: {
    color: "#fff",
    fontFamily: "NotoSans600",
    fontSize: 11,
  },
  todayQboxBtn: {
    width: 97,
    height: 31,
    backgroundColor: "#fff",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  todayQboxBtnText: {
    color: "#6369D4",
    fontFamily: "NotoSans600",
    fontSize: 13,
  },
  secondboxContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  dirayBox: {
    width: 159,
    height: 138,
    borderRadius: 30,
    backgroundColor: "#EEF0FF",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  diaryImg: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 82.665,
    height: 70.426,
    transform: [{ rotate: "13.355deg" }],
    flexShrink: 0,
    resizeMode: "contain",
  },
  BoxText1: {
    fontFamily: "NotoSans700",
    fontSize: 20,
    textAlign: "right",
    marginTop: 26,
    marginRight: 13,
    marginBottom: 3,
  },
  BoxText2: {
    fontSize: 12,
    color: "#686868",
    fontFamily: "NotoSans",
    textAlign: "right",
    marginRight: 13,
  },
  recordBox: {
    width: 159,
    height: 138,
    borderRadius: 30,
    backgroundColor: "#FFE8E9",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordImg: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 82.665,
    height: 70.426,
    flexShrink: 0,
    resizeMode: "contain",
  },
  whyRecord: {
    borderRadius: 30,
    width: 334,
    height: 95,
    backgroundColor: "#FFF",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 30,
    marginBottom: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  whyRecordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  whyRecordImg: {
    width: 25,
    height: 28,
    marginRight: 16,
    flexShrink: 0,
    resizeMode: "contain",
  },
  whyRecordText1: {
    fontSize: 17,
    fontFamily: "NotoSans600",
    marginBottom: 7,
  },
  whyRecordText2: {
    fontSize: 13,
    fontFamily: "NotoSans",
    letterSpacing: -0.22,
  },
  confirmBox: {
    borderRadius: 30,
    width: 334,
    height: 105,
    backgroundColor: "#EEEDFF",
    marginBottom: 100,
    paddingHorizontal: 32,
    paddingTop: 20,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  check: {
    width: 17,
    height: 20,
    marginRight: 9,
  },
  confirmBoxTitle: {
    fontSize: 16,
    fontFamily: "NotoSans600",
  },
  confirmBoxTop: {
    display: "flex",
    flexDirection: "row",
  },
  confirmBoxBottom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 27,
    justifyContent: "center",
  },
  confirmBoxBottomList: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});

export default Home;
