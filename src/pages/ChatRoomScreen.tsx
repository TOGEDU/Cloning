/* eslint-disable @typescript-eslint/no-shadow */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Day,
  Time,
  IMessage,
  BubbleProps,
} from 'react-native-gifted-chat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Sound from 'react-native-sound';

import BASE_URL from '../api';
import burger from '../../assets/burger.png';
import smallLogo from '../../assets/smallLogo.png';
import logotext from '../../assets/logotext.png';
import mypage from '../../assets/mypage.png';
import profileimg from '../../assets/profileimg.png';
import sendIcon from '../../assets/send.png';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  ChatList: undefined;
  ChatRoomScreen: {chatroomId: string; initialMessage: {text: string} | null};
  ChildMyPage: undefined;
};

// Props 타입 정의
type ChatRoomScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatRoomScreen'
>;
type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoomScreen'>;

interface ChatRoomScreenProps {
  navigation: ChatRoomScreenNavigationProp;
  route: ChatRoomScreenRouteProp;
}

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({navigation, route}) => {
  const {chatroomId, initialMessage} = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadingVoice, setLoadingVoice] = useState(false);

  // 메시지 가져오기 함수
  const fetchMessages = useCallback(async () => {
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
    } catch (error) {
      Alert.alert(
        'Failed to fetch messages',
        (error as Error).message ||
          'An error occurred while fetching messages.',
      );
    }
  }, [chatroomId, initialMessage]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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
    chatroomId: string,
    date: string,
  ): IMessage[] => {
    return messageList.map((msg, index) => {
      const dateTime = moment(`${date} ${msg.time}`, 'YYYY-MM-DD HH:mm');
      return {
        _id: `${chatroomId}-${index}`,
        text: msg.message,
        createdAt: dateTime.toDate(),
        user: {
          _id: msg.role === 0 ? 0 : 1,
          name: msg.role === 0 ? 'You' : 'Parent AI',
          avatar: msg.role === 1 ? profileimg : undefined,
        },
      };
    });
  };

  const playSound = async (audioUri: string) => {
    setLoadingVoice(true);
    const sound = new Sound(audioUri, Sound.MAIN_BUNDLE, error => {
      if (error instanceof Error) {
        console.error('오디오 로딩 실패:', error.message);
        Alert.alert(
          'Failed to play sound',
          'An error occurred while playing the sound.',
        );
        setLoadingVoice(false);
        return;
      }

      sound.play(success => {
        if (success) {
          console.log('오디오 재생 성공');
        } else {
          console.error('오디오 재생 실패');
        }
        setLoadingVoice(false);
        sound.release();
      });
    });
  };

  const onBubbleLongPress = async (_: any, message: IMessage) => {
    try {
      if (message.user._id === 1) {
        const token = await getAuthToken();

        setLoadingVoice(true);

        const response = await axios.post(
          'http://172.20.75.246:8000/synthesize',
          {text: message.text},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',
            timeout: 180000,
          },
        );

        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const audioUri = fileReader.result as string;
          await playSound(audioUri);
        };
        fileReader.onerror = error => {
          console.error('FileReader 오류:', error);
          Alert.alert(
            'Failed to play sound',
            'An error occurred while processing the audio file.',
          );
          setLoadingVoice(false);
        };
        fileReader.readAsDataURL(response.data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          'Failed to fetch the voice',
          error.message || 'An error occurred while fetching the voice.',
        );
      }
      setLoadingVoice(false);
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

      const serverResponseMessage: IMessage = {
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
        GiftedChat.append(previousMessages, [serverResponseMessage]),
      );
    } catch (error) {
      Alert.alert(
        'Failed to send the message',
        (error as Error).message ||
          'An error occurred while sending the message.',
      );
    }
  };

  const renderBubble = (props: BubbleProps<IMessage>) => (
    <Bubble
      {...props}
      wrapperStyle={{right: styles.bubbleRight, left: styles.bubbleLeft}}
      textStyle={{right: styles.textRight, left: styles.textLeft}}
      onLongPress={(_: any, message: IMessage) => onBubbleLongPress(_, message)}
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

  const renderDay = (props: any) => {
    const {currentMessage, previousMessage} = props;
    const currentCreatedAt = moment(currentMessage.createdAt);
    const previousCreatedAt = moment(previousMessage?.createdAt);

    if (
      !previousMessage?._id ||
      !currentCreatedAt.isSame(previousCreatedAt, 'day')
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

  const renderTime = (props: any) => {
    return <Time {...props} timeFormat="HH:mm" textStyle={styles.timeText} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {loadingVoice && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#586EE3" />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
          <Image source={burger} />
        </TouchableOpacity>

        <View style={styles.headerLogo}>
          <Image source={smallLogo} />
          <Image source={logotext} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ChildMyPage')}>
          <Image source={mypage} />
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
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
