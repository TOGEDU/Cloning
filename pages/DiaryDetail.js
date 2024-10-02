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
  ScrollView,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Svg, { Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../api";
import recordIcon from "../assets/recordicon.png";
import stopIcon from "../assets/stopicon.png";

const DiaryDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { date } = route.params;

  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenOptions, setChildrenOptions] = useState([]);
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일`;
    };

    setFormattedDate(formatDate(new Date(date)));

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
          setContent(firstDiary.content);
          setImage(firstDiary.image);
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
        setContent(selectedDiary.content);
        setImage(selectedDiary.image);
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
      setImage(selectedImage);
    }
  };

  const handleUpdateDiary = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const formData = new FormData();
      formData.append("diaryId", selectedChild);
      formData.append("content", content);

      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "updated_image.jpg",
        });
      }

      if (recordedUri) {
        formData.append("audio", {
          uri: recordedUri,
          type: "audio/x-m4a",
          name: "recording.m4a",
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

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        console.log("Recording started");
      } else {
        console.error("Permission to access microphone is required!");
        Alert.alert(
          "Permission Denied",
          "Permission to access microphone is required!"
        );
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordedUri(uri);

      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        type: "audio/m4a",
        name: "recording.m4a",
      });

      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${BASE_URL}/api/diary/transcribe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.text) {
        setContent((prevContent) => prevContent + " " + response.data.text);
      } else {
        Alert.alert("Error", "Failed to transcribe the audio.");
      }
    } catch (err) {
      console.error("Failed to stop recording or transcribe audio", err);
      Alert.alert("Error", "Failed to process the audio file.");
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
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

        <Text style={styles.dateText}>{formattedDate}</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedChild(value)}
            items={childrenOptions}
            placeholder={{ label: "자식 선택", value: null }}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
              iconContainer: styles.iconContainer,
            }}
            value={selectedChild}
            Icon={() => (
              <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <Path
                  d="M11 1L6 7L1 1"
                  stroke="#CCCCCC"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          />
        </View>

        {!isEditMode ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {selectedChild && (
              <View style={styles.diaryContentContainer}>
                {selectedDiary?.image ? (
                  <Image
                    source={{ uri: selectedDiary?.image }}
                    style={styles.diaryImageViewMode}
                    resizeMode="contain"
                    onError={(error) => console.log("이미지 로드 실패:", error)}
                  />
                ) : (
                  <Text style={styles.noImageText}>이미지가 없습니다.</Text>
                )}
                <Text style={styles.content}>{selectedDiary?.content}</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={handleImagePicker}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.diaryImageEditMode}
                  resizeMode="cover"
                  onError={(error) => console.log("이미지 로드 실패:", error)}
                />
              ) : (
                <Image source={photoIcon} style={styles.photoIcon} />
              )}
            </TouchableOpacity>

            <View style={styles.textAreaContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder="내용을 입력하세요"
                multiline
              />
              <TouchableOpacity
                style={styles.recordIconContainer}
                onPress={toggleRecording}
              >
                <Image
                  source={recording ? stopIcon : recordIcon}
                  style={styles.recordIcon}
                />
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.editButtonContainer}>
          {isEditMode ? (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateDiary}
            >
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditMode(true)}
            >
              <Text style={styles.editButtonText}>수정하기</Text>
            </TouchableOpacity>
          )}
        </View>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 36,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  dateText: {
    color: "#838383",
    textAlign: "center",
    fontFamily: "Noto Sans",
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    width: 77,
    height: 32,
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 30,
    marginBottom: 28,
  },
  picker: {
    width: "100%",
    height: "100%",
    color: "#838383",
    textAlign: "center",
    fontFamily: "Noto Sans",
    fontSize: 13,
    paddingRight: 20,
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
  diaryContentContainer: {
    alignItems: "flex-start",
    width: "100%",
    gap: 10,
  },
  imagePicker: {
    width: 330,
    height: 200,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6369D4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  diaryImageEditMode: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  diaryImageViewMode: {
    width: 330,
    height: null,
    aspectRatio: 1,
    borderRadius: 20,
  },
  photoIcon: {
    width: 52,
    height: 52,
  },
  textAreaContainer: {
    width: 330,
    height: 250,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6369D4",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  input: {
    height: 50,
    width: 330,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textArea: {
    flex: 1,
    padding: 15,
    textAlignVertical: "top",
  },
  recordIconContainer: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  recordIcon: {
    width: 44,
    height: 44,
  },
  saveButton: {
    display: "flex",
    width: 143,
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#6369D4",
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "NotoSans600",
    fontSize: 16,
  },
  editButtonContainer: {
    position: "absolute",
    bottom: 5,
    alignItems: "center",
    width: "100%",
  },
  editButton: {
    width: 143,
    padding: 16,
    borderRadius: 100,
    backgroundColor: "#6369D4",
  },
  editButtonText: {
    color: "#fff",
    fontFamily: "NotoSans600",
    fontSize: 16,
    textAlign: "center",
  },
  noImageText: {
    color: "#838383",
    fontSize: 16,
  },
});
