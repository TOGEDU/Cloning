import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Svg, { Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../api";
import stopIcon from "../assets/stopicon.png";

const Diary = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("common");
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [childrenOptions, setChildrenOptions] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;
    setCurrentDate(formattedDate);

    const fetchChildren = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log(token);
        const today = new Date().toISOString().split("T")[0];

        const response = await axios.get(
          `${BASE_URL}/api/diary/check-availability`,
          {
            params: { date: today },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedChildrenOptions = response.data
          .filter((child) => !child.isHave)
          .map((child) => ({
            label: child.name,
            value: child.parentChildId,
          }));

        const optionsWithCommon = [
          { label: "공통", value: "common" },
          ...fetchedChildrenOptions,
        ];

        setChildrenOptions(optionsWithCommon);
      } catch (error) {
        console.error("Failed to fetch children:", error);
      }
    };

    fetchChildren();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token doesn't exist");
        Alert.alert("Error", "로그인이 필요합니다.");
        return;
      }

      console.log("Retrieved Token:", token);

      const today = new Date().toISOString().split("T")[0];

      const formData = new FormData();

      formData.append("date", today);
      formData.append("content", content);

      if (image) {
        const uniqueName = `photo_${Date.now()}.jpg`;
        formData.append("image", {
          uri: image.uri,
          type: "image/jpeg",
          name: uniqueName,
        });
      } else {
        formData.append("image", null);
      }

      if (category === "common") {
        formData.append("parentChildId", -100);
      } else if (category) {
        formData.append("parentChildId", category);
      }

      const response = await axios.post(`${BASE_URL}/api/diary`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === true) {
        navigation.replace("WriteFinish");
      } else if (response.data.success === false) {
        Alert.alert("저장 실패", response.data.msg);
      } else {
        Alert.alert("저장 실패", "일기 저장에 실패했습니다.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

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
      setImage(result.assets[0]);
    }
  };

  const startRecording = async () => {
    try {
      // console.log("Requesting permissions..");
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        // console.log("Starting recording..");
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

  const handleTextChange = (text) => {
    setContent(text);
  };

  const stopRecording = async () => {
    try {
      // console.log("Stopping recording...");

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      // console.log("Recording stopped and stored at", uri);

      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri, // iOS와 Android의 파일 경로 처리
        type: "audio/m4a",
        name: "recording.m4a",
      });

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token doesn't exist");
        return;
      }

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

      console.log("Transcription result:", response.data);

      if (response.data.text) {
        setContent((prevContent) => prevContent + " " + response.data.text);
      } else {
        console.warn("No text received from the server.");
      }
    } catch (err) {
      console.error("Failed to stop recording or send audio file", err);
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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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

        <Text style={styles.dateText}>{currentDate}</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={childrenOptions}
            value={category}
            placeholder={{}}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
              iconContainer: styles.iconContainer,
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <Path
                  d="M11 1L6 7L1 1"
                  stroke="#6369D4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.imagePicker}
          onPress={handleImagePicker}
        >
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Image
              source={require("../assets/photoicon.png")}
              style={styles.photoIcon}
            />
          )}
        </TouchableOpacity>

        <View style={styles.contentBox}>
          <TextInput
            style={styles.contentInput}
            placeholder="일기의 내용을 적어주세요"
            placeholderTextColor="#838383"
            value={content}
            onChangeText={handleTextChange}
            multiline
          />
          <TouchableOpacity
            style={styles.recordIconContainer}
            onPress={toggleRecording}
          >
            <Image
              source={
                recording ? stopIcon : require("../assets/recordicon.png")
              }
              style={styles.recordIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>기록하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  dateText: {
    marginTop: 100,
    color: "#838383",
    textAlign: "center",
    fontFamily: "Noto Sans",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 19.36,
    marginBottom: 16,
  },
  pickerContainer: {
    width: 80,
    height: 32,
    borderRadius: 20,
    marginLeft: 30,
    backgroundColor: "#EFF0FF",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  picker: {
    width: "100%",
    height: "100%",
    flexShrink: 0,
    borderRadius: 20,
    backgroundColor: "#EFF0FF",
    color: "#6369D4",
    textAlign: "center",
    fontFamily: "Noto Sans",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19.36,
    paddingRight: 20,
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
  contentInput: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#6369D4",
    fontFamily: "Noto Sans",
    fontWeight: "400",
    lineHeight: 19.36,
  },
  contentBox: {
    width: 330,
    height: 299,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6369D4",
    marginTop: 28,
    position: "relative",
  },
  recordIconContainer: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  recordIcon: {
    width: 44,
    height: 44,
  },
  imagePicker: {
    width: 330,
    height: 128,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6369D4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#FFF",
  },
  photoIcon: {
    width: 52,
    height: 52,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  btn: {
    width: 143,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: "#6369D4",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120,
    marginTop: 28,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "NotoSans600",
  },
});
