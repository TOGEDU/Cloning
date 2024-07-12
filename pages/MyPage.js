import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // React Navigation 사용
import profileimg from "../assets/profileimg.png";
import chevronDown from "../assets/chevron-down.png";
import chevronUp from "../assets/chevron-up.png";

const MyPage = () => {
  const navigation = useNavigation(); // 네비게이션 훅 사용

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [children, setChildren] = useState([""]);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("오전 9:00");

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

  const handleSave = () => {
    // 저장 로직을 여기에 추가하세요.
    console.log("자녀 정보 저장: ", children);
    setDropdownOpen(false);
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const toggleTimeDropdown = () => {
    setTimeDropdownOpen(!timeDropdownOpen);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeDropdownOpen(false);
  };

  const handleLogout = () => {
    // 로그아웃 로직을 여기에 추가하세요.
    console.log("로그아웃");
    navigation.navigate("Login"); // 로그인 화면으로 이동
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

  return (
    <View style={styles.container}>
      <View style={styles.profilecontainer}>
        <View>
          <Text style={styles.nameText}>김은영</Text>
          <Text style={styles.emailText}>cloning@gmail.com</Text>
        </View>
        <Image source={profileimg} style={styles.profileImage} />
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
    //backgroundColor: "green",
  },
  nameText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
  },
  emailText: {
    marginTop: 2,
    fontSize: 14,
  },

  infocontainer: {
    flex: 4.5,
    //height: 1000,
    backgroundColor: "#858AE8",
    borderRadius: 30,
    paddingTop: 30,
    //paddingBottom: 70,
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
    //marginHorizontal: 20,
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
    //marginHorizontal: 20,
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
    //marginHorizontal: 20,
  },
  timeDropdownContent: {
    marginTop: 10,
    //alignItems: "center",
  },
  timeOption: {
    paddingVertical: 8,
  },
  timeOptionText: {
    fontSize: 18,
  },

  logoutButton: {
    //backgroundColor: "#FF6347",
    //borderRadius: 10,
    //paddingVertical: 12,
    alignItems: "center",
    //marginVertical: 80,
    marginTop: 30,
    marginBottom: 80,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default MyPage;
