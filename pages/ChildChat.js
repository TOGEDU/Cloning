import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import axios from "axios"; // Axios import 추가
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage import 추가

import { Audio } from "expo-av";

import burger from "../assets/burger.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypage from "../assets/mypage.png";
import profileimg from "../assets/profileimg.png";
import sendIcon from "../assets/send.png";
import testVoice from "../assets/testvoice.wav"; // 오디오 파일 임포트

import BASE_URL from "../api"; // BASE_URL 임포트

const ChildChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

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
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // AsyncStorage에서 토큰 가져오기
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        // API 요청 보내기
        const response = await axios.get(`${BASE_URL}/api/chat/chatroom`, {
          headers: {
            Authorization: `Bearer ${token}`, // 가져온 토큰 사용
          },
          params: {
            prompt: newMessages[0].text, // 사용자가 보낸 메시지를 prompt로 설정
          },
        });

        // API 응답 처리 (예: 채팅창에 응답 메시지 추가)
        const apiMessage = {
          _id: response.data.id,
          text: `API 응답 ID: ${response.data.id}`, // API로부터 받은 ID를 처리
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: profileimg,
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, apiMessage)
        );
      } else {
        console.error("토큰을 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("API 요청에 실패했습니다.", error);
    }
  };

  const playVoiceMessage = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(testVoice); // 오디오 파일 로드
      await soundObject.playAsync(); // 오디오 파일 재생

      // 재생이 끝나면 리소스를 해제
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
      // 특정 사용자 메시지에서만 재생
      playVoiceMessage();
    } else {
      // 기본 메뉴 표시
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
