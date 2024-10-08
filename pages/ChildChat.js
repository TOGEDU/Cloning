import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  LogBox,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Day,
  Time,
} from "react-native-gifted-chat";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av"; // expo-av 추가
import moment from "moment"; // moment.js 추가

import BASE_URL from "../api";

import burger from "../assets/burger.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypage from "../assets/mypage.png";
import profileimg from "../assets/profileimg.png";
import sendIcon from "../assets/send.png";

LogBox.ignoreLogs([
  "Warning: Avatar: Support for defaultProps will be removed from function components in a future major release.",
]);

// 또는 모든 경고를 무시하기
LogBox.ignoreAllLogs();

// Axios request interceptor to log requests
axios.interceptors.request.use(
  function (config) {
    console.log("API 요청이 서버로 전달됨:", config.url, config.data);
    return config;
  },
  function (error) {
    console.error("API 요청 전송 실패:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.error("서버 응답 실패:", error);
    return Promise.reject(error);
  }
);

const ChildChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "채팅을 길게 클릭하면 부모님의 목소리를 들을 수 있습니다. 부모님 AI와 채팅을 나눠보세요.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: profileimg,
        },
      },
    ]);
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async (audioUri) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("오디오 재생 실패:", error);
      Alert.alert(
        "Failed to play sound",
        "An error occurred while playing the sound."
      );
    }
  };

  const onBubbleLongPress = async (context, message) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token is missing or invalid");
        Alert.alert("Authentication error", "Please log in again.");
        return;
      }

      console.log("길게 클릭된 메시지:", message.text);
      console.log("API 요청 시작:", message.text);

      const response = await axios.post(
        "http://13.113.253.45:8000/synthesize",
        { text: message.text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          timeout: 180000,
        }
      );

      console.log("API 응답 성공:", response);

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const audioUri = fileReader.result;
        await playSound(audioUri);
      };
      fileReader.onerror = (error) => {
        console.error("FileReader 오류:", error);
        Alert.alert(
          "Failed to play sound",
          "An error occurred while processing the audio file."
        );
      };
      fileReader.readAsDataURL(response.data);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error("API 요청이 타임아웃되었습니다.", error);
      } else {
        console.error("API 요청 실패:", error);
      }
      Alert.alert(
        "Failed to fetch the voice",
        error.message || "An error occurred while fetching the voice."
      );
    }
  };

  const onSend = async (newMessages = []) => {
    try {
      const sentMessage = newMessages[0];
      console.log("Sending message:", sentMessage.text);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token is missing or invalid");
        Alert.alert("Authentication error", "Please log in again.");
        return;
      }

      // 화면 전환 시 로딩 상태를 함께 넘김
      navigation.navigate("ChatRoomScreen", {
        chatroomId: "temp-id", // 실제 chatroomId는 나중에 설정
        initialMessage: sentMessage,
        loading: true, // 로딩 상태를 함께 넘김
      });

      const response = await axios.get(`${BASE_URL}/api/chat/chatroom`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          prompt: sentMessage.text,
        },
      });

      const newChatroomId = response.data.chatroomId;

      // 새로운 chatroomId로 화면을 업데이트 (API 완료 후)
      navigation.navigate("ChatRoomScreen", {
        chatroomId: newChatroomId,
        loading: false, // 로딩 완료
      });
    } catch (error) {
      console.error("Failed to send the message", error);
      Alert.alert(
        "Failed to send the message",
        error.message || "An error occurred while sending the message."
      );
    }
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.bubbleRight,
        left: styles.bubbleLeft,
      }}
      textStyle={{
        right: styles.textRight,
        left: styles.textLeft,
      }}
      onLongPress={onBubbleLongPress}
    />
  );

  const renderSend = (props) => (
    <TouchableOpacity
      style={styles.sendButtonContainer}
      onPress={() => props.onSend({ text: props.text }, true)}
    >
      <Image source={sendIcon} style={styles.sendButton} />
    </TouchableOpacity>
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
      primaryStyle={styles.inputToolbarPrimary}
    />
  );

  // 날짜 표시 형식 수정
  const renderDay = (props) => (
    <Day
      {...props}
      dateFormat="YYYY년 MM월 DD일" // 날짜 형식을 'YYYY년 MM월 DD일'로 변경
      textStyle={{ color: "#A7A7A7", fontSize: 12 }}
    />
  );

  // 시간 표시 형식 수정
  const renderTime = (props) => (
    <Time
      {...props}
      timeFormat="HH:mm" // 시간 형식을 'HH:mm'으로 유지
      textStyle={{ color: "#A7A7A7", fontSize: 10 }}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
          <Image source={burger} style={styles.burger} />
        </TouchableOpacity>
        <View style={styles.headerLogo}>
          <Image source={smallLogo} style={styles.smallLogo} />
          <Image source={logotext} style={styles.logoText} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ChildMyPage")}>
          <Image source={mypage} style={styles.myPage} />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderDay={renderDay} // 날짜 렌더링
        renderTime={renderTime} // 시간 렌더링
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerLogo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendButtonContainer: {
    paddingRight: 4,
  },
  inputToolbarContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: 30,
    marginHorizontal: 16,
    borderTopWidth: 0,
  },
  inputToolbarPrimary: {
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    width: 32,
    height: 32,
  },
  bubbleRight: {
    backgroundColor: "#586EE3",
    borderRadius: 20,
    padding: 10,
  },
  bubbleLeft: {
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    padding: 10,
  },
  textRight: {
    color: "#fff",
  },
  textLeft: {
    color: "#000",
  },
});

export default ChildChat;
