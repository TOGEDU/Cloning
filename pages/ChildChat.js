import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator, // 로딩스피너 추가
  LogBox,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av"; // expo-av 추가

import BASE_URL from "../api";

import burger from "../assets/burger.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypage from "../assets/mypage.png";
import profileimg from "../assets/profileimg.png";
import sendIcon from "../assets/send.png";

// 특정 경고 메시지를 무시하고 숨기기
LogBox.ignoreLogs([
  "Warning: Avatar: Support for defaultProps will be removed from function components in a future major release.",
]);

// 또는 모든 경고를 무시하기
// LogBox.ignoreAllLogs();

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

// Axios response interceptor to log responses
axios.interceptors.response.use(
  function (response) {
    // console.log("서버로부터 응답을 받음:", response);
    return response;
  },
  function (error) {
    console.error("서버 응답 실패:", error);
    return Promise.reject(error);
  }
);

const ChildChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [sound, setSound] = useState(null); // 사운드 상태 추가
  const [loadingVoice, setLoadingVoice] = useState(false); // 음성 로딩 상태 추가

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
          sound.unloadAsync(); // 컴포넌트가 언마운트될 때 사운드를 정리
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

      // 음성 재생이 시작되면 로딩 스피너를 종료
      setLoadingVoice(false);

      await sound.playAsync();
    } catch (error) {
      console.error("오디오 재생 실패:", error);
      Alert.alert(
        "Failed to play sound",
        "An error occurred while playing the sound."
      );
      setLoadingVoice(false); // 실패 시에도 로딩 스피너 끄기
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

      // API 요청 시 로딩 스피너를 활성화
      setLoadingVoice(true);

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
        await playSound(audioUri); // 음성 재생 시작
      };
      fileReader.onerror = (error) => {
        console.error("FileReader 오류:", error);
        Alert.alert(
          "Failed to play sound",
          "An error occurred while processing the audio file."
        );
        setLoadingVoice(false); // 오류 발생 시 로딩 스피너 종료
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
      setLoadingVoice(false); // 오류 발생 시 로딩 스피너 종료
    }
  };

  const onSend = async (newMessages = []) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token is missing or invalid");
        Alert.alert("Authentication error", "Please log in again.");
        return;
      }

      const sentMessage = newMessages[0];
      console.log("Sending message:", sentMessage.text);

      const response = await axios.get(`${BASE_URL}/api/chat/chatroom`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          prompt: sentMessage.text,
        },
      });

      console.log("API response:", response.data);

      const newChatroomId = response.data.chatroomId;

      navigation.navigate("ChatRoomScreen", {
        chatroomId: newChatroomId,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert(
          "Authentication error",
          "Your session has expired. Please log in again."
        );
      } else {
        console.error("Failed to send the message", error);
        Alert.alert(
          "Failed to send the message",
          error.message || "An error occurred while sending the message."
        );
      }
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {loadingVoice && ( // 로딩 상태가 true일 때 로딩 스피너 표시
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#586EE3" />
        </View>
      )}
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // 약간의 투명도 추가
    zIndex: 1,
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
