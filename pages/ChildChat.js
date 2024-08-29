import React, { useState, useEffect } from "react";
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
import { Audio } from "expo-av";

import burger from "../assets/burger.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypage from "../assets/mypage.png";
import profileimg from "../assets/profileimg.png";
import sendIcon from "../assets/send.png";

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

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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

  const playVoiceMessage = async (text) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token is missing or invalid");
        Alert.alert("Authentication error", "Please log in again.");
        return;
      }

      console.log("Sending request to synthesize voice for text:", text);

      const response = await axios.post(
        "http://172.30.1.79:8000/synthesize",
        { text: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          timeout: 120000, // 타임아웃을 2분으로 설정
        }
      );

      console.log("Received response from API");

      const blob = new Blob([response.data], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      const { sound } = await Audio.Sound.createAsync({ uri: url });
      setSound(sound);
      await sound.playAsync();

      console.log("Audio playback started successfully");
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        Alert.alert(
          "Timeout Error",
          "The request took too long - please try again later."
        );
      } else {
        console.error("Failed to fetch or play the voice message", error);
        Alert.alert(
          "Voice Playback Error",
          error.message ||
            "An error occurred while trying to play the voice message."
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
      onLongPress={() => {
        if (props.position === "left") {
          playVoiceMessage(props.currentMessage.text);
        }
      }}
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
