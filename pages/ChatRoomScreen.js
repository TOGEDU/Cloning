import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Text,
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
import { Audio } from "expo-av"; // expo-av 추가

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
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null); // 사운드 상태 추가

  useEffect(() => {
    fetchMessages();
  }, [chatroomId, initialMessage]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // 컴포넌트가 언마운트될 때 사운드를 정리
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
      const token = await getAuthToken();

      const response = await axios.get(`${BASE_URL}/api/chat/chats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { roomid: chatroomId },
      });

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

      setMessages(chatMessages);
    } catch (error) {
      Alert.alert(
        "Failed to fetch messages",
        error.message || "An error occurred while fetching messages."
      );
    } finally {
      setLoading(false);
    }
  };

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
      if (message.user._id === 1) {
        // 상대방의 메시지일 경우에만 처리
        const token = await getAuthToken();

        console.log("길게 클릭된 메시지:", message.text);

        console.log("API 요청 시작:", message.text);

        const response = await axios.post(
          "http://172.30.1.78:8000/synthesize", // ChildChat과 동일한 URL 사용
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
      }
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
      const token = await getAuthToken();

      // 먼저 사용자가 보낸 메시지를 화면에 추가
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      // 서버에 메시지 전송
      const response = await axios.post(
        `${BASE_URL}/api/message`,
        {
          message: newMessages[0].text,
          chatRoomId: chatroomId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 서버로부터 받은 응답 메시지를 화면에 추가
      const serverResponseMessage = {
        _id: `${chatroomId}-${newMessages[0]._id}-response`, // 고유 ID 생성
        text: response.data.message, // 서버에서 받은 메시지
        createdAt: moment(response.data.time, "HH:mm:ss").toDate(), // 서버에서 받은 시간
        user: {
          _id: 1,
          name: "Parent AI",
          avatar: profileimg, // Parent AI만 아바타 표시
        },
      };

      // 응답 메시지를 추가
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, serverResponseMessage)
      );
    } catch (error) {
      Alert.alert(
        "Failed to send the message",
        error.message || "An error occurred while sending the message."
      );
    }
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{ right: styles.bubbleRight, left: styles.bubbleLeft }}
      textStyle={{ right: styles.textRight, left: styles.textLeft }}
      onLongPress={(context, message) => onBubbleLongPress(context, message)} // 길게 누르기 이벤트 핸들러 추가
    />
  );

  const renderAvatar = (props) => {
    // user._id가 0이면 사용자 메시지로, 아바타를 숨깁니다.
    if (props.currentMessage.user._id === 0) {
      return null; // 아바타를 렌더링하지 않음
    }
    // AI 메시지일 경우에는 아바타를 렌더링합니다.
    return (
      <Image
        source={props.currentMessage.user.avatar} // 프로필 이미지 지정
        style={styles.avatar}
      />
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

  const renderDay = (props) => {
    const { currentMessage, previousMessage } = props;
    const currentCreatedAt = moment(currentMessage.createdAt);
    const previousCreatedAt = moment(previousMessage.createdAt);

    if (
      !previousMessage._id ||
      !currentCreatedAt.isSame(previousCreatedAt, "day")
    ) {
      return (
        <Day
          {...props}
          dateFormat="YYYY년 MM월 DD일"
          textStyle={styles.dayText}
        />
      );
    }
    return null;
  };

  const renderTime = (props) => {
    return <Time {...props} timeFormat="HH:mm" textStyle={styles.timeText} />;
  };

  return (
    <SafeAreaView style={styles.container}>
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
        onSend={onSend}
        user={{ _id: 0 }}
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar} // 아바타 렌더링 함수 추가
        messages={messages}
        renderInputToolbar={renderInputToolbar}
        renderDay={renderDay}
        renderTime={renderTime}
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
