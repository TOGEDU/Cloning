import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../api"; // BASE_URL을 불러옵니다.

const Record = () => {
  const [progress, setProgress] = useState(0); // 초기 진행률을 0으로 설정합니다.
  const [pendingRecordings, setPendingRecordings] = useState([]);
  const [completedRecordings, setCompletedRecordings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // authToken을 AsyncStorage에서 가져옵니다.
        const response = await axios.get(`${BASE_URL}/api/voice`, {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰을 추가합니다.
          },
        });

        const { progressPercentage, sentenceList } = response.data;
        setProgress(progressPercentage);
        setPendingRecordings(sentenceList.map((sentence) => sentence.text));
      } catch (error) {
        console.error("Failed to fetch recordings", error);
      }
    };

    fetchRecordings(); // 컴포넌트가 마운트될 때 API 호출을 실행합니다.
  }, []);

  const handleRecordComplete = (item) => {
    setCompletedRecordings([...completedRecordings, item]);
    setPendingRecordings(pendingRecordings.filter((record) => record !== item));
    setProgress((prevProgress) =>
      Math.min(
        100,
        Math.floor(prevProgress + 100 / (pendingRecordings.length || 1))
      )
    );
  };

  const handleRecordingPress = (item) => {
    navigation.navigate("RecordingScreen", {
      item,
      onRecordComplete: handleRecordComplete,
    });
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  recordingText: {
    fontSize: 15,
    fontFamily: "Noto Sans",
    padding: 15,
  },
});
