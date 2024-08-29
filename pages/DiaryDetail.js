import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path } from "react-native-svg";
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
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

        if (response.data.length > 0) {
          const firstDiary = response.data[0];
          setSelectedChild(firstDiary.diaryId);
          setTitle(firstDiary.title);
          setContent(firstDiary.content);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        Alert.alert("Error", "An error occurred while fetching diary data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryDetail();
  }, [date]);

  useEffect(() => {
    if (selectedChild) {
      const selectedDiary = diaryData.find(
        (entry) => entry.diaryId === selectedChild
      );

      if (selectedDiary) {
        setTitle(selectedDiary.title);
        setContent(selectedDiary.content);
      }
    }
  }, [selectedChild, diaryData]);

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;

      setDiaryData((prevDiaryData) =>
        prevDiaryData.map(
          (entry) =>
            entry.diaryId === selectedChild
              ? { ...entry, image: selectedImage }
              : entry 
        )
      );
    }
  };

  const handleUpdateDiary = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const selectedDiary = diaryData.find(
        (entry) => entry.diaryId === selectedChild
      );

      const formData = new FormData();
      formData.append("diaryId", selectedChild);
      formData.append("title", title);
      formData.append("content", content);

      if (selectedDiary.image) {
        formData.append("image", {
          uri: selectedDiary.image,
          type: "image/jpeg",
          name: "updated_image.jpg",
        });
      }

      const response = await axios.put(`${BASE_URL}/api/diary`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Alert.alert("Success", response.data.msg);
        setIsEditMode(false);
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.msg);
      }
    } catch (error) {
      console.error("Failed to update diary:", error);
      Alert.alert("Error", "An error occurred while updating the diary.");
    }
  };

  const selectedDiary = diaryData.find(
    (entry) => entry.diaryId === selectedChild
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <Path
              d="M12.8334 12.8333L31.1667 31.1666M12.8334 31.1666L31.1667 12.8333"
              stroke="#545454"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <RNPickerSelect
          onValueChange={(value) => setSelectedChild(value)}
          items={childrenOptions}
          placeholder={{ label: "자식 선택", value: null }}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
          value={selectedChild}
        />

        {isEditMode ? (
          <>
            <Text style={[styles.title, isEditMode && styles.editModeMargin]}>
              제목
            </Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력하세요"
            />
            <Text style={styles.contentTitle}>내용</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder="내용을 입력하세요"
              multiline
            />
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={handleImagePicker}
            >
              {selectedChild &&
              diaryData.find((entry) => entry.diaryId === selectedChild)
                ?.image ? (
                <Image
                  source={{
                    uri: diaryData.find(
                      (entry) => entry.diaryId === selectedChild
                    )?.image,
                  }}
                  style={styles.diaryImage}
                />
              ) : (
                <Text style={styles.imagePickerText}>+ 사진 추가</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateDiary}
            >
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
          </>
        ) : (
          selectedChild && (
            <View style={styles.diaryContentContainer}>
              <Text style={styles.dateText}>
                {
                  diaryData.find((entry) => entry.diaryId === selectedChild)
                    ?.date
                }
              </Text>
              <Text style={styles.title}>
                {
                  diaryData.find((entry) => entry.diaryId === selectedChild)
                    ?.title
                }
              </Text>
              {selectedDiary?.image ? (
                <Image
                  source={{ uri: selectedDiary.image }}
                  style={styles.diaryImage}
                />
              ) : (
                <Text style={styles.noImageText}>이미지가 없습니다.</Text>
              )}

              <Text style={styles.content}>
                {
                  diaryData.find((entry) => entry.diaryId === selectedChild)
                    ?.content
                }
              </Text>
              <View style={styles.editButtonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditMode(true)}
                >
                  <Text style={styles.editButtonText}>수정하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DiaryDetail;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  picker: {
    marginLeft: 28,
    color: "#838383",
    marginBottom: 15,
    fontSize: 13,
    fontFamily: "NotoSans",
    width: 77,
    height: 32,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  diaryContentContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 36,
  },
  editModeMargin: {
    marginLeft: 28,
  },
  title: {
    color: "#000",
    fontFamily: "Noto Sans",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  contentTitle: {
    color: "#000",
    fontFamily: "Noto Sans",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    alignSelf: "flex-start",
    marginBottom: 15,
    marginLeft: 28,
  },
  input: {
    height: 50,
    width: 330,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#F7F7F7",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textArea: {
    height: 190,
    textAlignVertical: "top",
  },
  imagePicker: {
    width: 330,
    height: 140,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#F7F7F7",
  },
  imagePickerText: {
    color: "#838383",
    fontSize: 12,
  },
  diaryImage: {
    width: 329,
    height: 189.455,
    borderRadius: 5,
    marginBottom: 15,
  },
  noImageText: {
    color: "#838383",
    fontSize: 16,
  },
  dateText: {
    color: "#838383",
    textAlign: "center",
    fontFamily: "Noto Sans",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 19.36,
    marginBottom: 10,
  },
  editButtonContainer: {
    marginTop: 130,
    alignItems: "center",
    width: "100%",
  },
  editButton: {
    display: "flex",
    width: 143,
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    borderRadius: 100,
    backgroundColor: "#6369D4",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#6369D4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
