/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Day,
  Time,
  IMessage,
} from 'react-native-gifted-chat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Audio} from 'expo-av'; // expo-av 추가
import {StackScreenProps} from '@react-navigation/stack';

import BASE_URL from '../api';
import burger from '../../assets/burger.png';
import smallLogo from '../../assets/smallLogo.png';
import logotext from '../../assets/logotext.png';
import mypage from '../../assets/mypage.png';
import profileimg from '../../assets/profileimg.png';
import sendIcon from '../../assets/send.png';

type RootStackParamList = {
  ChatRoomScreen: {chatroomId: number; initialMessage?: {text: string}};
  ChatList: undefined;
  ChildMyPage: undefined;
};

type ChatRoomScreenProps = StackScreenProps<
  RootStackParamList,
  'ChatRoomScreen'
>;

interface ChatMessage extends IMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar: string | null;
  };
}

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({navigation, route}) => {
  const {chatroomId, initialMessage} = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [chatroomId, initialMessage]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const getAuthToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Authentication error', 'Please log in again.');
      throw new Error('No auth token found');
    }
    return token;
  };

  const processMessages = (
    messageList: any[],
    chatroomId: number,
    date: string,
  ): ChatMessage[] => {
    return messageList.map((msg, index) => {
      const dateTime = moment(`${date} ${msg.time}`, 'YYYY-MM-DD HH:mm');
      return {
        _id: `${chatroomId}-${index}`,
        text: msg.message,
        createdAt: dateTime.toDate(),
        user: {
          _id: msg.role === 0 ? 0 : 1,
          name: msg.role === 0 ? 'You' : 'Parent AI',
          avatar: msg.role === 1 ? profileimg : null,
        },
      };
    });
  };

  const fetchMessages = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${BASE_URL}/api/chat/chats`, {
        headers: {Authorization: `Bearer ${token}`},
        params: {roomid: chatroomId},
      });

      const chatMessages = processMessages(
        response.data.messageList,
        response.data.chatroomId,
        response.data.date,
      );

      if (initialMessage) {
        chatMessages.push({
          _id: 'initial',
          text: initialMessage.text,
          createdAt: new Date(),
          user: {_id: 0, name: 'You'},
        });
      }

      setMessages(chatMessages);
    } catch (error: any) {
      Alert.alert(
        'Failed to fetch messages',
        error.message || 'An error occurred while fetching messages.',
      );
    } finally {
      setLoading(false);
    }
  };

  const playSound = async (audioUri: string) => {
    try {
      const {sound} = await Audio.Sound.createAsync(
        {uri: audioUri},
        {shouldPlay: true},
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

  const onBubbleLongPress = async (context: any, message: ChatMessage) => {
    if (message.user._id === 1) {
      try {
        const token = await getAuthToken();
        const response = await axios.post(
          'http://172.30.1.54:8000/synthesize',
          {text: message.text},
          {
            headers: {Authorization: `Bearer ${token}`},
            responseType: 'blob',
            timeout: 180000,
          },
        );

        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const audioUri = fileReader.result as string;
          await playSound(audioUri);
        };
        fileReader.readAsDataURL(response.data);
      } catch (error: any) {
        Alert.alert(
          'Failed to fetch the voice',
          error.message || 'An error occurred while fetching the voice.',
        );
      }
    }
  };

  const onSend = async (newMessages: IMessage[] = []) => {
    try {
      const token = await getAuthToken();

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages),
      );

      const response = await axios.post(
        `${BASE_URL}/api/message`,
        {
          message: newMessages[0].text,
          chatRoomId: chatroomId,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );

      const serverResponseMessage: ChatMessage = {
        _id: `${chatroomId}-${newMessages[0]._id}-response`,
        text: response.data.message,
        createdAt: moment(response.data.time, 'HH:mm:ss').toDate(),
        user: {
          _id: 1,
          name: 'Parent AI',
          avatar: profileimg,
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, serverResponseMessage),
      );
    } catch (error: any) {
      Alert.alert(
        'Failed to send the message',
        error.message || 'An error occurred while sending the message.',
      );
    }
  };

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{right: styles.bubbleRight, left: styles.bubbleLeft}}
      textStyle={{right: styles.textRight, left: styles.textLeft}}
      onLongPress={(context, message) => onBubbleLongPress(context, message)}
    />
  );

  const renderAvatar = (props: any) => {
    if (props.currentMessage.user._id === 0) {
      return null;
    }
    return (
      <Image source={props.currentMessage.user.avatar} style={styles.avatar} />
    );
  };

  const renderSend = (props: any) => (
    <TouchableOpacity
      style={styles.sendButtonContainer}
      onPress={() => props.onSend({text: props.text}, true)}>
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

  const renderDay = (props: any) => (
    <Day {...props} dateFormat="YYYY년 MM월 DD일" textStyle={styles.dayText} />
  );

  const renderTime = (props: any) => (
    <Time {...props} timeFormat="HH:mm" textStyle={styles.timeText} />
  );

  return (
    <SafeAreaView style={styles.container}>
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
        onSend={onSend}
        user={{_id: 0}}
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
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
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
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
  dayText: {
    color: '#A7A7A7',
    fontSize: 12,
  },
  timeText: {
    color: '#A7A7A7',
    fontSize: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default ChatRoomScreen;
