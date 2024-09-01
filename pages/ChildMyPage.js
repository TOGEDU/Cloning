import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import back from "../assets/back.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypagew from "../assets/mypagew.png";
import chevronDown from "../assets/chevron-down.png";
import chevronUp from "../assets/chevron-up.png";
import BASE_URL from "../api";

const ChildMyPage = () => {
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("오전 9:00");
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/api/mypage`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedTime = convertTimeFormat(
          response.data.pushNotificationTime
        );
        setName(response.data.name);
        setEmail(response.data.email);
        setSelectedTime(formattedTime);
        setIsEnabled(response.data.pushStatus);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const convertTimeFormat = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const period = hourInt < 12 ? "오전" : "오후";
    const formattedHour = hourInt % 12 === 0 ? 12 : hourInt % 12;
    return `${period} ${formattedHour}:${minute}`;
  };

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const toggleTimeDropdown = () => {
    setTimeDropdownOpen(!timeDropdownOpen);
  };

  const handleTimeSelect = async (time) => {
    setSelectedTime(time);
    setTimeDropdownOpen(false);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const formattedTime = time.replace("오전 ", "").replace("오후 ", ""); // API에 맞게 시간을 포맷팅합니다.

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
      console.log("Push time updated:", response.data);
    } catch (error) {
      console.error("Error updating notification time", error);
    }
  };

  const handleLogout = () => {
    console.log("로그아웃");
    navigation.navigate("Login");
  };

  const handleAlbumPress = () => {
    navigation.navigate("Album");
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirmDelete = () => {
    console.log("탈퇴하기");
    setModalVisible(false);
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
      <SafeAreaView style={styles.headerContainer} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={back} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.headerlogo}>
            <Image source={smallLogo} style={styles.icon} />
            <Image source={logotext} style={styles.logotext} />
          </View>
          <Image source={mypagew} style={styles.icon} />
        </View>
      </SafeAreaView>
      <View style={styles.profilecontainer}>
        <View>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>
      </View>
      <View style={styles.infocontainer}>
        <ScrollView style={styles.scrollview}>
          <View style={styles.childinfo}>
            <TouchableOpacity
              style={styles.piccontainer}
              onPress={handleAlbumPress}
            >
              <Text style={styles.notificationText}>사진첩</Text>
              <Text style={styles.notificationSubText}>
                부모님이 남기신 사진들을 확인해보세요
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationContainer}>
            <View>
              <Text style={styles.notificationText}>푸시 알림 켜기</Text>
              <Text style={styles.notificationSubText}>
                특별한 날 부모님의 연락을 받아보세요
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
          <View style={styles.logoutButtonContainer}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>로그아웃</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={toggleModal} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>탈퇴하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>정말 탈퇴하시겠습니까?</Text>
            <Text style={styles.modalSubText}>
              탈퇴하기 버튼을 누르시면 CLONING의 모든 정보가 즉시 삭제되며
              복구할 수 없습니다.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>탈퇴하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>취소하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerlogo: {
    flexDirection: "row",
    alignItems: "center",
  },

  profilecontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginVertical: 30,
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
  infocontainer: {
    flex: 1,
    backgroundColor: "#858AE8",
    borderRadius: 20,
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
    paddingVertical: 22,
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

  timeDropdownContent: {
    marginTop: 10,
  },
  timeOption: {
    paddingVertical: 8,
  },
  timeOptionText: {
    fontSize: 18,
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
  logoutButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 80,
  },
  logoutButton: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#858AE8",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChildMyPage;
