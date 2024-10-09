import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
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
import profileimg from "../assets/suk.png";
import sendIcon from "../assets/send.png";

const ChatRoomScreen = ({ navigation, route }) => {
  const { chatroomId, initialMessage, loading: initialLoading } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(initialLoading || true); // 초기 로딩 상태 설정
  const [sound, setSound] = useState(null);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false); // 메시지 전송 로딩 상태

  // 의존성 배열에 chatroomId 추가
  useEffect(() => {
    // 새로운 채팅방으로 이동할 때 상태 초기화
    setMessages([]);
    setLoading(true); // 새 채팅방을 로드할 때 로딩 상태로 설정
    fetchMessages();
  }, [chatroomId]); // chatroomId가 변경될 때마다 실행

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
      console.error("Auth token is missing or invalid");
      throw new Error("No auth token found");
    }
    console.log("Auth token retrieved:", token); // 토큰이 올바르게 받아오는지 확인
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
      const token = await getAuthToken();
      console.log("ChatroomId is:", chatroomId); // chatroomId가 undefined인지 확인
      if (!chatroomId || chatroomId === "temp-id" || !token) {
        console.error("Invalid chatroomId or token");
        return; // chatroomId가 없거나 'temp-id'일 때 API 요청을 하지 않음
      }

      // API 요청 로그 추가
      console.log(
        `Making API request to fetch chats for room ID: ${chatroomId}`
      );

      const response = await axios.get(`${BASE_URL}/api/chat/chats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { roomid: chatroomId },
      });

      console.log("API Response: ", response.data); // 응답 데이터 확인

      const chatMessages = processMessages(
        response.data.messageList,
        response.data.chatroomId,
        response.data.date
      );

      if (initialMessage) {
        chatMessages.push({
          _id: "initial",
          text: initialMessage.text,
          createdAt: new Date(),
          user: { _id: 0, name: "You" },
        });
      }

      setMessages(chatMessages); // 메시지 업데이트
      setLoading(false); // 메시지 로드 완료 후 로딩 상태 해제
    } catch (error) {
      console.error("Failed to fetch messages:", error);
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
      setLoadingVoice(false); // 에러가 나도 로딩 스피너 종료
    }
  };

  const onBubbleLongPress = async (context, message) => {
    try {
      if (message.user._id === 1) {
        const token = await getAuthToken();
        setLoadingVoice(true);

        const response = await axios.post(
          "http://13.113.253.45:8000/synthesize", // ChildChat과 동일한 URL 사용
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
          setLoadingVoice(false); // 에러가 나도 로딩 스피너 종료
        };
        fileReader.readAsDataURL(response.data);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      setLoadingVoice(false); // 에러가 나도 로딩 스피너 종료
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
      console.error("Failed to send the message:", error); // 에러는 콘솔에만 표시
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
      {(loading || sendingMessage) && ( // 메시지 로딩 중일 때 로딩 스피너 표시
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
      {!loading ? ( // 메시지 로딩 중에는 스피너를 표시하고, 완료되면 채팅 화면 표시
        <GiftedChat
          onSend={onSend}
          user={{ _id: 0 }}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderAvatar={renderAvatar}
          messages={messages}
          renderInputToolbar={renderInputToolbar}
          renderDay={renderDay}
          renderTime={renderTime}
        />
      ) : (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#586EE3" />
        </View>
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
