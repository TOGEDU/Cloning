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
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Svg, { Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../api";

const Diary = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(null);
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null); 
  const [childrenOptions, setChildrenOptions] = useState([]);

  useEffect(() => {
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

      const today = new Date().toISOString().split("T")[0];

      const formData = new FormData();

      formData.append("date", today);
      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        formData.append("image", {
          uri: image.uri,
          type: "image/jpeg",
          name: "사진.jpg",
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
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Microphone access is required!");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording...");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
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

        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={childrenOptions}
          placeholder={{ label: "자식 선택", value: null }}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
        />

        <Text style={styles.title}>제목</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="일기의 제목을 적어주세요"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.contentTitle}>내용</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="일기의 내용을 적어주세요"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={handleImagePicker}
        >
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>+ 사진 추가</Text>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>기록하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={recording ? stopRecording : startRecording}
          >
            <Text style={styles.btnText}>
              {recording ? "녹음 중지" : "녹음 시작"}
            </Text>
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
  picker: {
    marginLeft: 28,
    color: "#838383",
    marginBottom: 15,
    fontSize: 13,
    fontFamily: "NotoSans",
    width: 100,
    height: 32,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    alignSelf: "flex-start",
    marginLeft: 36,
    fontFamily: "NotoSans",
    marginBottom: 15,
  },
  contentTitle: {
    fontSize: 24,
    alignSelf: "flex-start",
    marginLeft: 36,
    fontFamily: "NotoSans",
    marginBottom: 15,
  },
  titleInput: {
    height: 50,
    width: 330,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#F7F7F7",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  contentInput: {
    width: 330,
    height: 150,
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
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
    marginTop: 27,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "NotoSans600",
  },
  recordButton: {
    width: 143,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: "#FF6B6B",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120,
    marginTop: 27,
  },
});
