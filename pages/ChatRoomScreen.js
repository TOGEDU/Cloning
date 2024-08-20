import React, { useEffect, useState } from "react";

import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  useEffect(() => {
    fetchMessages();
  }, [chatroomId, initialMessage]);

  const getAuthToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Alert.alert("Authentication error", "Please log in again.");
      throw new Error("No auth token found");
    }
    return token;
  };

  const processMessages = (messageList, chatroomId, date) => {
    return messageList.map((msg, index) => ({
      _id: `${chatroomId}-${index}`,
      text: msg.message,
      createdAt: new Date(`${date}T${msg.time}:00`),
      user: {
        _id: msg.role === 0 ? 0 : 1,
        name: msg.role === 0 ? "You" : "Parent AI",
        avatar: msg.role === 1 ? profileimg : null,
      },
    }));
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

  const onSend = async (newMessages = []) => {
    try {
      const token = await getAuthToken();

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
      await axios.post(
        `${BASE_URL}/api/chat/chatroom/${chatroomId}/message`,
        { message: newMessages[0].text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.get(`${BASE_URL}/api/chat/chats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { roomid: chatroomId },
      });

      const chatMessages = processMessages(
        response.data.messageList,
        response.data.chatroomId,
        response.data.date
      );

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatMessages)
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
        messages={messages}
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
});

export default ChatRoomScreen;
