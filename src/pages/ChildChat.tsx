import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  LogBox,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  IMessage,
} from 'react-native-gifted-chat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound'; // react-native-sound로 대체
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

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

type RootStackParamList = {
  ChatList: undefined;
  ChatRoomScreen: {chatroomId: string};
  ChildMyPage: undefined;
};

type ChildChatNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatList'
>;

const ChildChat: React.FC = () => {
  const navigation = useNavigation<ChildChatNavigationProp>();
  const [messages, setMessages] = useState<IMessage[]>([]); // IMessage로 통일
  const [sound, setSound] = useState<Sound | null>(null); // 사운드 상태 추가

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
          sound.release(); // 컴포넌트가 언마운트될 때 사운드를 정리
        }
      : undefined;
  }, [sound]);

  const playSound = async (audioUri: string) => {
    try {
      const soundInstance = new Sound(audioUri, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.error('오디오 로딩 실패:', error);
          Alert.alert(
            'Failed to play sound',
            'An error occurred while playing the sound.',
          );
          return;
        }
        soundInstance.play();
      });
      setSound(soundInstance);
    } catch (error) {
      if (error instanceof Error) {
        console.error('오디오 재생 실패:', error.message);
        Alert.alert(
          'Failed to play sound',
          'An error occurred while playing the sound.',
        );
      }
    }
  };

  const onBubbleLongPress = async (_context: any, message: IMessage) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication error', 'Please log in again.');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/synthesize`, // API 엔드포인트로 변경
        {text: message.text},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
          timeout: 180000,
        },
      );

      const audioUri = URL.createObjectURL(response.data);
      await playSound(audioUri);
    } catch (error) {
      if (error instanceof Error) {
        console.error('API 요청 실패:', error.message);
        Alert.alert(
          'Failed to fetch the voice',
          error.message || 'An error occurred while fetching the voice.',
        );
      }
    }
  };

  const onSend = async (newMessages: IMessage[] = []) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication error', 'Please log in again.');
        return;
      }

      const sentMessage = newMessages[0];

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
      if (error instanceof Error) {
        console.error('Failed to send the message', error.message);
        Alert.alert(
          'Failed to send the message',
          error.message || 'An error occurred while sending the message.',
        );
      }
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
        user={{_id: 1}}
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
  burger: {
    width: 24,
    height: 24,
  },
  smallLogo: {
    width: 24,
    height: 24,
  },
  logoText: {
    width: 100,
    height: 24,
  },
  myPage: {
    width: 24,
    height: 24,
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
