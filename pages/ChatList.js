import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage를 import합니다.
import axios from "axios"; // axios를 import합니다.
import BASE_URL from "../api"; // BASE_URL을 import합니다.

import back from "../assets/back.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypagew from "../assets/mypagew.png";
import pencil from "../assets/pencil.png";

const ChatList = ({ navigation }) => {
  const [chatList, setChatList] = useState([]); // 채팅 목록을 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // AsyncStorage에서 토큰을 가져옴
        const response = await axios.get(`${BASE_URL}/api/chat/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`, // 가져온 토큰을 헤더에 추가
          },
        });
        setChatList(response.data.chatList); // 응답 데이터로 채팅 목록 상태를 업데이트
      } catch (error) {
        console.error("Failed to fetch chat list:", error); // 에러 발생 시 로그 출력
      } finally {
        setLoading(false); // 데이터 로딩 완료 후 로딩 상태를 false로 변경
      }
    };

    fetchChatList(); // 컴포넌트가 마운트될 때 fetchChatList 함수 호출
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
          <TouchableOpacity
  onPress={() => navigation.navigate("ChildChat", { initial: true })}>
  <Image source={pencil} style={styles.pencil} />
</TouchableOpacity>


        </View>
        <ScrollView>
          <View style={styles.listcontainer}>
            {chatList.map((chat) => (
              <TouchableOpacity key={chat.id}>
                <View style={styles.list}>
                  <View style={styles.textContainer}>
                    <Text style={styles.listtext}>{chat.summary}</Text>
                    <Text style={styles.listsubtext}>{chat.date}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatList;
