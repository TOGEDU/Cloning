import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const todayQbox = require("../assets/todayQbox.png");
const homebellImage = require("../assets/homebell.png");

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.todayQbox}>
        <Text style={styles.todayQboxTitle}>매일 다른 오늘의 질문</Text>
        <Text style={styles.todayQboxSecondTitle}>머라고 ~~ !!</Text>
        <TouchableOpacity style={styles.todayQboxBtn} onPress={() => {}}>
          <Text style={styles.todayQboxBtnText}>답변하러 가기</Text>
        </TouchableOpacity>

        <Image source={todayQbox} style={styles.todayQboxImg} />
      </View>
      <View style={styles.secondboxContainer}>
        <View style={styles.dirayBox}>
          <Text style={styles.BoxText1}>육아일기</Text>
          <Text style={styles.BoxText2}>
            자녀를 위한 일기를 {"\n"} 작성해 주세요
          </Text>
        </View>
        <View style={styles.recordBox}>
          <Text style={styles.BoxText1}>음성녹음</Text>
          <Text style={styles.BoxText2}>
            부모님의 목소리를 {"\n"} 녹음해 주세요
          </Text>
        </View>
      </View>
      <View style={styles.whyRecord}>
        <Image style={styles.whyRecordImg} source={homebellImage} />
        <View>
          <Text style={styles.whyRecordText1}>녹음을 왜 해야 하나요?</Text>
          <Text style={styles.whyRecordText2}>
            녹음한 기록들을 바탕으로 TTS 모델을 구현하게 됩니다
          </Text>
        </View>
      </View>
      <View style={styles.confirmBox}></View>
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
    marginBottom: 27,
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
    fontSize: 25,
    fontWeight: "900",
    marginTop: 40,
    marginBottom: 5,
  },
  todayQboxSecondTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  todayQboxBtn: {
    width: 97,
    height: 31,
    backgroundColor: "#fff",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 29,
  },
  todayQboxBtnText: {
    color: "#6369D4",
    fontSize: 13,
    fontWeight: "600",
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
  BoxText1: {
    fontWeight: "500",
    fontSize: 20,
    textAlign: "right",
    marginTop: 26,
    marginRight: 13,
    marginBottom: 3,
  },
  BoxText2: {
    fontSize: 12,
    color: "#686868",
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
  whyRecord: {
    borderRadius: 30,
    width: 334,
    height: 78,
    backgroundColor: "#FFF",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 27,
    marginBottom: 27,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  whyRecordImg: {
    width: 28,
    height: 28,
    marginRight: 21,
  },
  whyRecordText1: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  whyRecordText2: {
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: -0.22,
  },
  confirmBox: {
    borderRadius: 30,
    width: 334,
    height: 105,
    backgroundColor: "#EEEDFF",
    marginBottom: 100,
  },
});

export default Home;
