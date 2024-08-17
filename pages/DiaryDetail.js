import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../api";

const DiaryDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { date } = route.params;

  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenOptions, setChildrenOptions] = useState([]);
  const [diaryData, setDiaryData] = useState([]);

  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        const response = await axios.get(`${BASE_URL}/api/diary`, {
          params: { date: date },
          headers: { Authorization: `Bearer ${token}` },
        });

        const childrenOptions = response.data.map((entry) => ({
          label: entry.childName,
          value: entry.diaryId,
        }));

        setChildrenOptions(childrenOptions);
        setDiaryData(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          Alert.alert(
            "Error",
            `Failed to fetch diary: ${
              error.response.data.message || error.response.data
            }`
          );
        } else if (error.request) {
          console.error("Error request data:", error.request);
          Alert.alert("Error", "No response from server. Please try again.");
        } else {
          console.error("Error message:", error.message);
          Alert.alert("Error", "An unexpected error occurred.");
        }
      }
    };

    fetchDiaryDetail();
  }, [date]);

  const selectedDiary = diaryData.find(
    (entry) => entry.diaryId === selectedChild
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

      <RNPickerSelect
        onValueChange={(value) => setSelectedChild(value)}
        items={childrenOptions}
        placeholder={{ label: "자식 선택", value: null }}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

      {selectedDiary ? (
        <>
          <Text style={styles.dateText}>{selectedDiary.date}</Text>
          <Text style={styles.title}>{selectedDiary.title}</Text>
          {selectedDiary.image && (
            <Image source={{ uri: selectedDiary.image }} style={styles.image} />
          )}
          <Text style={styles.content}>{selectedDiary.content}</Text>
        </>
      ) : (
        <Text style={styles.noDiaryText}>선택한 자녀의 일기가 없습니다.</Text>
      )}

      {selectedDiary && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("DiaryEdit", { diaryId: selectedDiary.diaryId })
          }
        >
          <Text style={styles.editButtonText}>수정하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DiaryDetail;

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#545454",
  },
  picker: {
    width: "100%",
    color: "#838383",
    marginBottom: 15,
    fontSize: 18,
  },
  dateText: {
    fontSize: 18,
    color: "#999",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  noDiaryText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
  },
  editButton: {
    marginTop: 30,
    backgroundColor: "#6369D4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
