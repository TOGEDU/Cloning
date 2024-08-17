import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage를 import

import back from "../assets/back.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import pencil from "../assets/pencil.png";
import BASE_URL from "../api";

const ChatList = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]); // API로부터 받은 데이터를 저장할 상태 선언
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // 토큰을 AsyncStorage에서 가져옴
        if (token) {
          const response = await axios.get(`${BASE_URL}/api/chat/rooms`, {
            headers: {
              Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
            },
          });
          setChatRooms(response.data); // 받아온 데이터를 상태에 저장
        } else {
          console.error("토큰이 없습니다.");
        }
      } catch (error) {
        console.error("API 호출 중 에러 발생:", error);
      } finally {
        setLoading(false); // API 호출이 끝나면 로딩 상태 해제
      }
    };

    fetchChatRooms(); // API 호출 함수 실행
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={back} style={styles.back} />
          </TouchableOpacity>
          <View style={styles.headerlogo}>
            <Image source={smallLogo} style={styles.smallLogo} />
            <Image source={logotext} style={styles.logotext} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ChildChat")}>
            <Image source={pencil} style={styles.pencil} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.listcontainer}>
            {chatRooms.map((room) => (
              <View key={room.id} style={styles.list}>
                <View style={styles.textContainer}>
                  <Text style={styles.listtext}>{room.summary}</Text>
                  <Text style={styles.listsubtext}>{room.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
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
  listcontainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  list: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  listtext: {
    fontSize: 16,
  },
  listsubtext: {
    fontSize: 16,
    color: "#BDBDBD",
  },
});

export default ChatList;
