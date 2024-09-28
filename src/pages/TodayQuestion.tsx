import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, Recording } from 'expo-av';

const img = require('../../assets/todayquestionimg.png');
const recordIcon = require('../../assets/recordicon2.png');
const stopIcon = require('../../assets/stopicon2.png');

const TodayQuestion: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [recording, setRecording] = useState<Recording | null>(null);
  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error("Token doesn't exist");
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/dailyquestion/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const todayQuestion = response.data;

        if (todayQuestion && todayQuestion.question) {
          setQuestionId(todayQuestion.questionId);
          setQuestion(todayQuestion.question);

          if (todayQuestion.text) {
            setText(todayQuestion.text);
            setIsEditing(true);
          }
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
        }
      }
    };

    fetchQuestion();
  }, []);

  const handleWriteFinish = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error("Token doesn't exist");
        return;
      }

      const response = isEditing
        ? await axios.put(
            `${BASE_URL}/api/dailyquestion`,
            {
              questionId: questionId,
              text: text,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
        : await axios.post(
            `${BASE_URL}/api/dailyquestion`,
            {
              questionId: questionId,
              text: text,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

      const successMessage = isEditing
        ? '질문 답변 변경 완료'
        : '질문 답변 추가 완료';

      if (response.data === successMessage) {
        navigation.replace('WriteFinish');
      } else {
        console.error('Error during response:', response.data);
      }
    } catch (error) {
      console.error('Error during request:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted') {
        console.log('Starting recording..');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        );
        setRecording(recording);
        console.log('Recording started');
      } else {
        console.error('Permission to access microphone is required!');
        Alert.alert(
          'Permission Denied',
          'Permission to access microphone is required!',
        );
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');

      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecording(null);
      console.log('Recording stopped and stored at', uri);

      // 서버로 녹음 파일 전송
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri!.replace('file://', '') : uri!, // iOS와 Android의 파일 경로 처리
        type: 'audio/m4a', // 파일 유형
        name: 'recording.m4a', // 파일 이름
      });

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error("Token doesn't exist");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/diary/transcribe`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Transcription result:', response.data);

      if (response.data.text) {
        setText(response.data.text);
      } else {
        console.warn('No text received from the server.');
      }
    } catch (err) {
      console.error('Failed to stop recording or send audio file', err);
      Alert.alert('Error', 'Failed to process the audio file.');
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <View style={styles.container}>
        <View style={styles.topBackground}>
          <Text style={styles.title}>
            자녀에게 해주고 싶은 한 마디! {'\n'}질문에 답변해 주세요
          </Text>
          <Image source={img} style={styles.img} />
        </View>
        <View style={styles.middleBox}>
          <Text style={styles.middleText}>
            {question ? question : '오늘의 질문이 없습니다.'}
          </Text>
        </View>

        <View style={styles.answerBox}>
          <TextInput
            style={styles.answerInput}
            placeholder="답변을 입력해 주세요"
            placeholderTextColor="#AEAEAE"
            multiline
            scrollEnabled
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity
            style={styles.recordIconContainer}
            onPress={toggleRecording}>
            <Image
              source={recording ? stopIcon : recordIcon}
              style={styles.recordIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleWriteFinish}>
          <Text style={styles.btnText}>
            {isEditing ? '수정하기' : '기록하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TodayQuestion;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  topBackground: {
    backgroundColor: '#ABB0FE',
    height: 318,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: -130,
  },
  title: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'NotoSans900',
    lineHeight: 35,
    marginTop: 20,
  },
  img: {
    width: 340,
    height: 195,
  },
  middleBox: {
    width: 331,
    height: 94,
    backgroundColor: '#fff',
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: -47,
    paddingHorizontal: 40,
  },
  middleText: {
    fontSize: 18,
    letterSpacing: -0.36,
    lineHeight: 27,
    fontFamily: 'NotoSans',
    textAlign: 'center',
  },
  answerBox: {
    width: 331,
    height: 138,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    position: 'relative',
  },
  answerInput: {
    color: '#AEAEAE',
    fontSize: 16,
    fontFamily: 'NotoSans600',
  },
  recordIconContainer: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  recordIcon: {
    width: 36,
    height: 36,
  },
  btn: {
    width: 143,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#6369D4',
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 15,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'NotoSans600',
  },
});
