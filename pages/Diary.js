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
  const [childrenOptions, setChildrenOptions] = useState([]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        // console.log("Retrieved Token:", token);

        const today = new Date().toISOString().split("T")[0];

        const response = await axios.get(
          `${BASE_URL}/api/diary/check-availability`,
          {
            params: {
              date: today,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const childrenOptions = response.data
          .filter((child) => !child.isHave)
          .map((child) => ({
            label: child.name,
            value: child.parentChildId,
          }));

        setChildrenOptions(childrenOptions);
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
        Alert.alert("Error", "No token found");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      const formData = new FormData();
      formData.append(
        "diaryRequestDto",
        JSON.stringify({
          parentChildId: 1,
          date: today,
          text: content,
        })
      );

      if (image) {
        formData.append("file", {
          uri: image.uri,
          type: "image/jpeg",
          name: "리락쿠마.jpg",
        });
      }

      const response = await axios.post(`${BASE_URL}/api/diary`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data === "육아일기가 기록되었습니다.") {
        navigation.replace("WriteFinish");
      } else {
        Alert.alert("저장 실패", "일기 저장에 실패했습니다.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      Alert.alert("Error", "An error occurred while saving the diary.");
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
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>기록하기</Text>
        </TouchableOpacity>
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
    height: 190,
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
  btn: {
    width: 143,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: "#6369D4",
    borderRadius: 100,
    display: "flex",
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
});
