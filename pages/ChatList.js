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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../api";

import back from "../assets/back.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import pencil from "../assets/pencil.png";

const ChatList = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/api/chat/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChatList(response.data.chatList);
      } catch (error) {
        console.error("Failed to fetch chat list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatList();
  }, []);

  // 채팅방 조회 함수
  const handleChatRoomPress = async (roomid) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/api/chat/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          roomid: roomid, // 요청 파라미터에 roomid 전달
        },
      });

      // 채팅방 데이터를 가져온 후 ChatRoomScreen 화면으로 이동
      navigation.navigate("ChatRoomScreen", {
        chatroomId: response.data.chatroomId,
        messageList: response.data.messageList,
      });
    } catch (error) {
      console.error("Failed to fetch chat room:", error);
    }
  };

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
            onPress={() =>
              navigation.navigate("ChildChat", {
                initial: true,
              })
            }
          >
            <Image source={pencil} style={styles.pencilIcon} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.listcontainer}>
            {chatList.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                onPress={() => handleChatRoomPress(chat.id)} // 리스트 아이템을 눌렀을 때 채팅방 조회 함수 호출
              >
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
