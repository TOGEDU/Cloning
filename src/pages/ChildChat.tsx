import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  LogBox,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av'; // expo-av 추가
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';

import BASE_URL from '../api';

import burger from '../../assets/burger.png';
import smallLogo from '../../assets/smallLogo.png';
import logotext from '../../assets/logotext.png';
import mypage from '../../assets/mypage.png';
import profileimg from '../../assets/profileimg.png';
import sendIcon from '../../assets/send.png';

LogBox.ignoreLogs([
  'Warning: Avatar: Support for defaultProps will be removed from function components in a future major release.',
]);

// 네비게이션 스택의 타입 정의
type RootStackParamList = {
  ChatList: undefined;
  ChatRoomScreen: { chatroomId: string };
  ChildMyPage: undefined;
};

// 네비게이션 타입 정의
type ChildChatNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

type Message = {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar?: string;
  };
};

const ChildChat: React.FC = () => {
  const navigation = useNavigation<ChildChatNavigationProp>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null); // 사운드 상태 추가

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: '채팅을 길게 클릭하면 부모님의 목소리를 들을 수 있습니다. 부모님 AI와 채팅을 나눠보세요.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
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

  const playSound = async (audioUri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('오디오 재생 실패:', error);
      Alert.alert(
        'Failed to play sound',
        'An error occurred while playing the sound.',
      );
    }
  };

  const onBubbleLongPress = async (_context: any, message: Message) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Auth token is missing or invalid');
        Alert.alert('Authentication error', 'Please log in again.');
        return;
      }

      console.log('길게 클릭된 메시지:', message.text);

      const response = await axios.post(
        'http://192.168.35.231:8000/synthesize',
        { text: message.text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
          timeout: 180000,
        },
      );

      console.log('API 응답 성공:', response);

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const audioUri = fileReader.result as string;
        await playSound(audioUri);
      };
      fileReader.onerror = (error) => {
        console.error('FileReader 오류:', error);
        Alert.alert(
          'Failed to play sound',
          'An error occurred while processing the audio file.',
        );
      };
      fileReader.readAsDataURL(response.data);
    } catch (error) {
      console.error('API 요청 실패:', error);
      Alert.alert(
        'Failed to fetch the voice',
        error.message || 'An error occurred while fetching the voice.',
      );
    }
  };

  const onSend = async (newMessages: Message[] = []) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Auth token is missing or invalid');
        Alert.alert('Authentication error', 'Please log in again.');
        return;
      }

      const sentMessage = newMessages[0];
      console.log('Sending message:', sentMessage.text);

      const response = await axios.get(`${BASE_URL}/api/chat/chatroom`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          prompt: sentMessage.text,
        },
      });

      const newChatroomId = response.data.chatroomId;

      navigation.navigate('ChatRoomScreen', {
        chatroomId: newChatroomId,
      });
    } catch (error) {
      console.error('Failed to send the message', error);
      Alert.alert(
        'Failed to send the message',
        error.message || 'An error occurred while sending the message.',
      );
    }
  };

  const renderBubble = (props: any) => (
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

  const renderSend = (props: any) => (
    <TouchableOpacity
      style={styles.sendButtonContainer}
      onPress={() => props.onSend({ text: props.text }, true)}>
      <Image source={sendIcon} style={styles.sendButton} />
    </TouchableOpacity>
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
      primaryStyle={styles.inputToolbarPrimary}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
          <Image source={burger} style={styles.burger} />
        </TouchableOpacity>
        <View style={styles.headerLogo}>
          <Image source={smallLogo} style={styles.smallLogo} />
          <Image source={logotext} style={styles.logoText} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ChildMyPage')}>
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

export default ChildChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonContainer: {
    paddingRight: 4,
  },
  inputToolbarContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    marginHorizontal: 16,
    borderTopWidth: 0,
  },
  inputToolbarPrimary: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
  },
  bubbleRight: {
    backgroundColor: '#586EE3',
    borderRadius: 20,
    padding: 10,
  },
  bubbleLeft: {
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    padding: 10,
  },
  textRight: {
    color: '#fff',
  },
  textLeft: {
    color: '#000',
  },
});
