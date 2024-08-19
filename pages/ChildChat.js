import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { Audio } from "expo-av";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "../api";

import burger from "../assets/burger.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypage from "../assets/mypage.png";
import profileimg from "../assets/profileimg.png";
import sendIcon from "../assets/send.png";
import testVoice from "../assets/testvoice.wav";

const ChildChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [chatroomId, setChatroomId] = useState(null);

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

  const onSend = async (newMessages = []) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token is missing or invalid");
        Alert.alert("Authentication error", "Please log in again.");
        return;
      }

      const sentMessage = newMessages[0];

      // 1. 사용자에게 보낸 메시지를 즉시 화면에 표시
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      if (!chatroomId) {
        // 2. 새로운 채팅방 생성
        const response = await axios.get(`${BASE_URL}/api/chat/chatroom`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            prompt: sentMessage.text,
          },
        });

        const newChatroomId = response.data.chatroomId;
        setChatroomId(newChatroomId);

        const receivedMessages = response.data.messageList.map(
          (msg, index) => ({
            _id: `${newChatroomId}-${index}`,
            text: msg.message,
            createdAt: new Date(), // 이 부분을 실제 응답에 포함된 시간으로 변경 가능
            user: {
              _id: msg.role === 1 ? 2 : 1,
              name: msg.role === 1 ? "Parent AI" : "You",
              avatar: msg.role === 1 ? profileimg : null,
            },
          })
        );

        // 3. 서버에서 받은 메시지를 화면에 추가
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, receivedMessages)
        );
      } else {
        // 4. 기존 채팅방에 메시지 추가 (추가적인 POST 요청이 있을 경우 처리)
        await axios.post(
          `${BASE_URL}/api/chat/chatroom/${chatroomId}/message`,
          {
            message: sentMessage.text,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
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

  const playVoiceMessage = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(testVoice);
      await soundObject.playAsync();

      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          soundObject.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Failed to play the sound", error);
    }
  };

  const handleLongPress = (context, message) => {
    if (message.user._id === 2) {
      playVoiceMessage();
    } else {
      const options = ["Copy Text", "Cancel"];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            Clipboard.setString(message.text);
          }
        }
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
      onLongPress={() => handleLongPress(props.context, props.currentMessage)}
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
