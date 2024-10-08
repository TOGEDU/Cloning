import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import profileimg from "../assets/profileimg.png";
import chevronDown from "../assets/chevron-down.png";
import chevronUp from "../assets/chevron-up.png";
import BASE_URL from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const MyPage = () => {
  const navigation = useNavigation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [children, setChildren] = useState([""]);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("오전 9:00");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: null,
    pushStatus: false,
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [refresh, setRefresh] = useState(false); // 마이페이지를 다시 렌더링하기 위한 상태

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/mypage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      setProfile({
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
        pushStatus: data.pushStatus,
      });

      const hours = parseInt(data.pushNotificationTime.split(":")[0], 10);
      const period = hours >= 12 ? "오후" : "오전";
      const formattedHours = hours > 12 ? hours - 12 : hours;
      setSelectedTime(`${period} ${formattedHours}:00`);

      setChildren(data.childList.map((child) => child.name));

      setIsEnabled(data.pushStatus);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]); // refresh 상태가 바뀔 때마다 데이터를 다시 불러옴

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const addChild = () => {
    setChildren([...children, ""]);
  };

  const handleChildNameChange = (text, index) => {
    const newChildren = [...children];
    newChildren[index] = text;
    setChildren(newChildren);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/mypage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const existingChildren = response.data.childList.map(
        (child) => child.name
      );

      const newChildren = children.filter(
        (childName) => childName.trim() && !existingChildren.includes(childName)
      );

      for (const childName of newChildren) {
        await axios.post(`${BASE_URL}/api/mypage/child`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            name: childName,
          },
        });
      }

      Alert.alert("알림", "자녀가 추가되었습니다!");
      setDropdownOpen(false);
    } catch (error) {
      if (error.response) {
        console.error("응답 오류:", error.response);
        Alert.alert(
          "오류",
          `자녀 이름 변경 중 오류 발생: ${error.response.data}`
        );
      } else if (error.request) {
        console.error("응답 없음:", error.request);
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
      } else {
        console.error("요청 설정 오류:", error.message);
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const toggleSwitch = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      const newPushStatus = !isEnabled;
      setIsEnabled(newPushStatus);

      const response = await axios.put(
        `${BASE_URL}/api/mypage/push-status`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            pushStatus: newPushStatus,
          },
        }
      );

      Alert.alert("알림", "푸시 알림 상태 변경 완료");
    } catch (error) {
      if (error.response) {
        console.error("응답 오류:", error.response);
        Alert.alert(
          "오류",
          `푸시 알림 상태 변경 중 오류 발생: ${error.response.data}`
        );
      } else if (error.request) {
        console.error("응답 없음:", error.request);
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
      } else {
        console.error("요청 설정 오류:", error.message);
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const toggleTimeDropdown = () => {
    setTimeDropdownOpen(!timeDropdownOpen);
  };

  const handleTimeSelect = async (time) => {
    setSelectedTime(time);
    setTimeDropdownOpen(false);

    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      const [period, timePart] = time.split(" ");
      let [hours, minutes] = timePart.split(":");

      if (period === "오후" && parseInt(hours, 10) !== 12) {
        hours = (parseInt(hours, 10) + 12).toString().padStart(2, "0");
      } else if (period === "오전" && parseInt(hours, 10) === 12) {
        hours = "00";
      }
      const formattedTime = `${hours}:${minutes}:00`;

      const response = await axios.put(
        `${BASE_URL}/api/mypage/push-time`,
        null,
        {
          params: { pushNotificationTime: formattedTime },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("알림", "알림 시간이 변경되었습니다.");
    } catch (error) {
      if (error.response) {
        console.error("응답 오류:", error.response);
        Alert.alert(
          "오류",
          `알림 시간 변경 중 오류 발생: ${error.response.data}`
        );
      } else if (error.request) {
        console.error("응답 없음:");
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
      } else {
        console.error("요청 설정 오류:");
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const updateProfileImage = async (image) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        Alert.alert("오류", "로그인 상태를 확인하세요.");
        return;
      }

      const formData = new FormData();
      formData.append("profileImage", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.uri.split("/").pop(),
      });

      const response = await axios.put(
        `${BASE_URL}/api/mypage/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // 서버에서 받은 최종 URL로 프로필 이미지 업데이트
        setRefresh((prev) => !prev); // refresh 상태를 변경하여 마이페이지 리렌더링
      } else {
        Alert.alert("오류", "프로필 사진 변경에 실패했습니다.");
      }
    } catch (error) {
      if (error.response) {
        console.error("응답 오류:", error.response);
        Alert.alert(
          "오류",
          `프로필 사진 변경 중 오류 발생: ${error.response.data}`
        );
      } else if (error.request) {
        console.error("응답 없음:", error.request);
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
      } else {
        console.error("요청 설정 오류:", error.message);
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(`${BASE_URL}/api/sign/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        Alert.alert("알림", "로그아웃 완료");

        await AsyncStorage.removeItem("authToken");

        navigation.navigate("Login");
      } else {
        Alert.alert("오류", response.data.msg || "로그아웃에 실패했습니다.");
      }
    } catch (error) {
      if (error.response) {
        console.error("응답 오류:", error.response);
        Alert.alert(
          "오류",
          `로그아웃 중 오류 발생: ${error.response.data.msg}`
        );
      } else if (error.request) {
        console.error("응답 없음:", error.request);
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
      } else {
        console.error("요청 설정 오류:", error.message);
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const timeOptions = [
    "오전 9:00",
    "오전 10:00",
    "오전 11:00",
    "오후 12:00",
    "오후 1:00",
    "오후 2:00",
    "오후 3:00",
    "오후 4:00",
    "오후 5:00",
    "오후 6:00",
    "오후 7:00",
    "오후 8:00",
    "오후 9:00",
    "오후 10:00",
  ];

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 오류", "사진첩 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      updateProfileImage(selectedImage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilecontainer}>
        <View>
          <Text style={styles.nameText}>{profile.name}</Text>
          <Text style={styles.emailText}>{profile.email}</Text>
        </View>
        <TouchableOpacity onPress={handleImageSelect}>
          <Image
            source={
              profile.profileImage ? { uri: profile.profileImage } : profileimg
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infocontainer}>
        <ScrollView style={styles.scrollview}>
          <View style={styles.childinfo}>
            <TouchableOpacity
              onPress={toggleDropdown}
              style={styles.dropdownHeader}
            >
              <Text style={styles.dropdownHeaderText}>자녀 정보 수정</Text>
              <Image
                source={dropdownOpen ? chevronUp : chevronDown}
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
            {dropdownOpen && (
              <ScrollView contentContainerStyle={styles.dropdownContent}>
                {children.map((child, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    value={child}
                    onChangeText={(text) => handleChildNameChange(text, index)}
                    placeholder="자녀 이름"
                  />
                ))}
                <TouchableOpacity onPress={addChild} style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ 자녀 추가</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>수정 완료</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
          <View style={styles.notificationContainer}>
            <View>
              <Text style={styles.notificationText}>푸시 알림 켜기</Text>
              <Text style={styles.notificationSubText}>
                매일 오늘의 질문을 받아보세요
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#79B669" }}
              thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.notificationSwitch}
            />
          </View>
          <View style={styles.notificationtimeContainer}>
            <TouchableOpacity
              onPress={toggleTimeDropdown}
              style={styles.dropdownHeader}
            >
              <Text style={styles.dropdownHeaderText}>{selectedTime}</Text>
              <Image
                source={timeDropdownOpen ? chevronUp : chevronDown}
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
            {timeDropdownOpen && (
              <View style={styles.timeDropdownContent}>
                {timeOptions.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleTimeSelect(time)}
                    style={styles.timeOption}
                  >
                    <Text style={styles.timeOptionText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  profilecontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginVertical: 10,
    alignItems: "center",
  },
  nameText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 2,
  },
  emailText: {
    marginTop: 2,
    fontSize: 14,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee", // 기본 배경색 설정
  },
  infocontainer: {
    flex: 4.5,
    backgroundColor: "#858AE8",
    borderRadius: 30,
    paddingTop: 30,
  },
  scrollview: {
    borderRadius: 30,
    marginHorizontal: 20,
  },
  childinfo: {
    backgroundColor: "#EEEDFF",
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  dropdownHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdownContent: {
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    height: 35,
    width: 250,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  addButtonText: {
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#6369D4",
    width: 250,
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    marginVertical: 5,
  },
  saveButtonText: {
    color: "#fff",
  },
  notificationContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  notificationText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  notificationSubText: {
    fontSize: 14,
    paddingTop: 2,
  },
  notificationSwitch: {
    marginLeft: 10,
  },
  notificationtimeContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  timeDropdownContent: {
    marginTop: 10,
  },
  timeOption: {
    paddingVertical: 8,
  },
  timeOptionText: {
    fontSize: 18,
  },
  logoutButton: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 80,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default MyPage;
