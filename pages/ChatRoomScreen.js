import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import moment from "moment";
import { Audio } from "expo-av";

import BASE_URL from "../api";
import burger from "../assets/burger.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypage from "../assets/mypage.png";
import profileimg from "../assets/profileimg.png";
import sendIcon from "../assets/send.png";

const ChatRoomScreen = ({ navigation, route }) => {
  const { chatroomId, initialMessage } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 스피너를 화면 전환 직후 보여주기 위해 초기값을 true로 설정
  const [sound, setSound] = useState(null);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false); // 메시지 전송 로딩 상태

  useEffect(() => {
    fetchMessages(); // useEffect 안에서 바로 호출
  }, [chatroomId, initialMessage]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const getAuthToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Alert.alert("Authentication error", "Please log in again.");
      throw new Error("No auth token found");
    }
    return token;
  };

  const processMessages = (messageList, chatroomId, date) => {
    return messageList.map((msg, index) => {
      const dateTime = moment(`${date} ${msg.time}`, "YYYY-MM-DD HH:mm");
      return {
        _id: `${chatroomId}-${index}`,
        text: msg.message,
        createdAt: dateTime.toDate(),
        user: {
          _id: msg.role === 0 ? 0 : 1,
          name: msg.role === 0 ? "You" : "Parent AI",
          avatar: msg.role === 1 ? profileimg : null,
        },
      };
    });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true); // API 호출 전에 로딩 상태 true로 설정

      const token = await getAuthToken();
      if (!token) {
        throw new Error("No auth token found");
      }

      console.log(
        `API 요청이 서버로 전달됨: ${BASE_URL}/api/chat/chats, roomid: ${chatroomId}`
      ); // API 요청 로그

      // API 요청 실행
      const response = await axios.get(`${BASE_URL}/api/chat/chats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { roomid: chatroomId },
      });

      console.log("API response:", response.data); // API 응답 로그

      const chatMessages = processMessages(
        response.data.messageList,
        response.data.chatroomId,
        response.data.date
      );

      // 만약 초기 메시지가 있다면 추가
      if (initialMessage) {
        chatMessages.push({
          _id: "initial",
          text: initialMessage.text,
          createdAt: new Date(),
          user: { _id: 0, name: "You" },
        });
      }

      setMessages(chatMessages); // 메시지 상태 업데이트
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false); // API 응답 후 로딩 상태 false로 변경
    }
  };

  const playSound = async (audioUri) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(sound);
      setLoadingVoice(false);
      await sound.playAsync();
    } catch (error) {
      console.error("오디오 재생 실패:", error);
      Alert.alert(
        "Failed to play sound",
        "An error occurred while playing the sound."
      );
      setLoadingVoice(false);
    }
  };

  const onBubbleLongPress = async (context, message) => {
    try {
      if (message.user._id === 1) {
        const token = await getAuthToken();
        setLoadingVoice(true);

        const response = await axios.post(
          "http://192.168.0.189:8000/synthesize",
          { text: message.text },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
            timeout: 180000,
          }
        );

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
          setLoadingVoice(false);
        };
        fileReader.readAsDataURL(response.data);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      Alert.alert(
        "Failed to fetch the voice",
        error.message || "An error occurred while fetching the voice."
      );
      setLoadingVoice(false);
    }
  };

  const onSend = async (newMessages = []) => {
    try {
      const token = await getAuthToken();

      setSendingMessage(true); // 메시지 전송 시작 시 로딩 스피너 표시

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      const response = await axios.post(
        `${BASE_URL}/api/message`,
        {
          message: newMessages[0].text,
          chatRoomId: chatroomId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const serverResponseMessage = {
        _id: `${chatroomId}-${newMessages[0]._id}-response`,
        text: response.data.message,
        createdAt: moment(response.data.time, "HH:mm:ss").toDate(),
        user: {
          _id: 1,
          name: "Parent AI",
          avatar: profileimg,
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, serverResponseMessage)
      );
    } catch (error) {
      Alert.alert(
        "Failed to send the message",
        error.message || "An error occurred while sending the message."
      );
    } finally {
      setSendingMessage(false); // 메시지 전송 완료 후 로딩 스피너 숨김
    }
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{ right: styles.bubbleRight, left: styles.bubbleLeft }}
      textStyle={{ right: styles.textRight, left: styles.textLeft }}
      onLongPress={(context, message) => onBubbleLongPress(context, message)}
    />
  );

  const renderAvatar = (props) => {
    if (props.currentMessage.user._id === 0) {
      return null;
    }
    return (
      <Image source={props.currentMessage.user.avatar} style={styles.avatar} />
    );
  };

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

  // 날짜 형식 수정
  const renderDay = (props) => (
    <Day
      {...props}
      dateFormat="YYYY년 MM월 DD일" // 날짜 형식: YYYY년 MM월 DD일
      textStyle={styles.dayText}
    />
  );

  // 시간 형식 수정
  const renderTime = (props) => (
    <Time
      {...props}
      timeFormat="HH:mm" // 시간 형식: HH:mm
      textStyle={styles.timeText}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {loadingVoice && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#586EE3" />
        </View>
      )}
      {(loading || sendingMessage) && ( // 메시지 전송 중일 때도 로딩 스피너 표시
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
      {loading ? ( // 메시지 로딩 중에는 채팅 화면 대신 로딩 스피너를 표시
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#586EE3" />
        </View>
      ) : (
        <GiftedChat
          onSend={onSend}
          user={{ _id: 0 }}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderAvatar={renderAvatar}
          messages={messages}
          renderInputToolbar={renderInputToolbar}
          renderDay={renderDay} // 날짜 렌더링
          renderTime={renderTime} // 시간 렌더링
        />
      )}
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
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
  dayText: {
    color: "#A7A7A7",
    fontSize: 12,
  },
  timeText: {
    color: "#A7A7A7",
    fontSize: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default ChatRoomScreen;
