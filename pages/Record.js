import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useNavigation } from "@react-navigation/native";

const Record = () => {
  const [progress, setProgress] = useState(45);
  const [pendingRecordings, setPendingRecordings] = useState([
    "제 말을 믿으셔도 됩니다.",
    "나 지금 약간 배고픈 상태에 있는 중이야. ",
    "나는 웃음을 멈출 수가 없었어.",
    "중국 음식을 먹고 싶은데, 넌 어때?",
    "저녁 메뉴 뭐 먹을지 고민",
    "아메리카노는 이제 좀 질려",
  ]);
  const [completedRecordings, setCompletedRecordings] = useState([]);
  const navigation = useNavigation();

  const handleRecordComplete = (item) => {
    setCompletedRecordings([...completedRecordings, item]);
    setPendingRecordings(pendingRecordings.filter((record) => record !== item));
    setProgress((prevProgress) =>
      Math.min(100, prevProgress + 100 / pendingRecordings.length)
    );
  };

  const handleRecordingPress = (item) => {
    navigation.navigate("RecordingScreen", { item });
    navigation.setParams({ onRecordComplete: handleRecordComplete });
  };

  return (
    <ScrollView style={styles.fullcontainer}>
      <View style={styles.container}>
        <View style={styles.titleprogressContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>음성 기록 진행 현황</Text>
          </View>
          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={200}
              width={15}
              fill={progress}
              tintColor="#6369D4"
              backgroundColor="#e6e6e6"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>{progress}%</Text>
                  <Text style={styles.progressSubText}>잘하고 계세요!</Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>

        <View>
          {pendingRecordings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recordingItem}
              onPress={() => handleRecordingPress(item)}
            >
              <Text style={styles.recordingText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Record;

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
  titleprogressContainer: {
    alignItems: "center",
  },
  titleContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E5E7",
    width: 324,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Noto Sans",
    marginBottom: 18,
    textAlign: "center",
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 38,
  },
  progressTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 34,
    fontFamily: "Noto Sans",
    fontWeight: "bold",
  },
  progressSubText: {
    fontSize: 13,
    fontFamily: "Noto Sans",
  },

  recordingItem: {
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 13,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치 (수평, 수직)
    shadowOpacity: 0.25, // 그림자 투명도
    //shadowRadius: 4, // 그림자 반경
  },
  recordingText: {
    fontSize: 15,
    fontFamily: "Noto Sans",
    padding: 15,
  },
});
