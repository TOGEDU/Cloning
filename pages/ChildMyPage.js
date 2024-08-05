import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import back from "../assets/back.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypagew from "../assets/mypagew.png";
import profileimg from "../assets/profileimg.png";
import chevronDown from "../assets/chevron-down.png";
import chevronUp from "../assets/chevron-up.png";

const ChildMyPage = () => {
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("오전 9:00");

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const toggleTimeDropdown = () => {
    setTimeDropdownOpen(!timeDropdownOpen);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("로그아웃");
    navigation.navigate("Login");
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
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("ChildChat")}>
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
          <Text style={styles.nameText}>이은지</Text>
          <Text style={styles.emailText}>cloning@gmail.com</Text>
        </View>
      </View>
      <View style={styles.infocontainer}>
        <ScrollView style={styles.scrollview}>
          <View style={styles.childinfo}>
            <TouchableOpacity style={styles.piccontainer}>
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
          <View style={styles.logoutButtonContainer}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>로그아웃</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>탈퇴하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    backgroundColor: "#FFF", // Header background color
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
  icon: {
    width: 24,
    height: 24,
  },
  logotext: {
    width: 80,
    height: 24,
    marginLeft: 8,
  },
  profilecontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginVertical: 10,
    alignItems: "center",
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
    flex: 1,
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
  chevronIcon: {
    width: 20,
    height: 20,
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
});

export default ChildMyPage;
