/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Svg, {Path} from 'react-native-svg';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../api';
import stopIcon from '../../assets/stopicon.png';
import {launchImageLibrary} from 'react-native-image-picker';

interface ChildOption {
  label: string;
  value: string | number;
}

const Diary: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<string | number>('common');
  const [image, setImage] = useState<any>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [childrenOptions, setChildrenOptions] = useState<ChildOption[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');

  // 오디오 녹음 플레이어 초기화
  const audioRecorderPlayer = new AudioRecorderPlayer();

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;
    setCurrentDate(formattedDate);

    const fetchChildren = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('Token not found');
          return;
        }
        const today = new Date().toISOString().split('T')[0];

        const response = await axios.get(
          `${BASE_URL}/api/diary/check-availability`,
          {
            params: {date: today},
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        const fetchedChildrenOptions = response.data
          .filter((child: any) => !child.isHave)
          .map((child: any) => ({
            label: child.name,
            value: child.parentChildId,
          }));

        const optionsWithCommon = [
          {label: '공통', value: 'common'},
          ...fetchedChildrenOptions,
        ];

        setChildrenOptions(optionsWithCommon);
      } catch (error) {
        console.error('Failed to fetch children:', error);
      }
    };

    fetchChildren();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error("Token doesn't exist");
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const formData = new FormData();
      formData.append('date', today);
      formData.append('content', content);

      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type,
          name: '사진.jpg',
        } as any);
      }

      if (audioPath) {
        formData.append('audio', {
          uri: audioPath,
          type: 'audio/m4a',
          name: 'recording.m4a',
        });
      }

      if (category === 'common') {
        formData.append('parentChildId', '-100');
      } else {
        formData.append('parentChildId', category.toString());
      }

      const response = await axios.post(`${BASE_URL}/api/diary`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === true) {
        navigation.navigate('WriteFinish'); // replace 대신 navigate 사용
      } else if (response.data.success === false) {
        Alert.alert('저장 실패', response.data.msg);
      } else {
        Alert.alert('저장 실패', '일기 저장에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Error message:', error.message);
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]); // 이미지 설정
      }
    });
  };

  // 오디오 녹음 시작
  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e: any) => {
        console.log('Recording...', e.currentPosition);
        return;
      });
      setRecording(true); // 녹음 시작 상태 업데이트
      console.log('Recording started at:', result);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // 오디오 녹음 종료
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setAudioPath(result); // 녹음 파일 경로 저장
      setRecording(false); // 녹음 종료 상태 업데이트
      console.log('Recording stopped, file saved at:', result);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <Path
              d="M12.8334 12.8333L31.1667 31.1666M12.8334 31.1666L31.1667 12.8333"
              stroke="#545454"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.dateText}>{currentDate}</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={value => setCategory(value)}
            items={childrenOptions}
            value={category}
            placeholder={{}}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
              iconContainer: styles.iconContainer,
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <Path
                  d="M11 1L6 7L1 1"
                  stroke="#6369D4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.imagePicker}
          onPress={handleImagePicker}>
          {image ? (
            <Image source={{uri: image.uri}} style={styles.image} />
          ) : (
            <Image
              source={require('../../assets/photoicon.png')}
              style={styles.photoIcon}
            />
          )}
        </TouchableOpacity>

        <View style={styles.contentBox}>
          <TextInput
            style={styles.contentInput}
            placeholder="일기의 내용을 적어주세요"
            placeholderTextColor="#838383"
            value={content}
            onChangeText={setContent}
            multiline
          />
          <TouchableOpacity
            style={styles.recordIconContainer}
            onPress={toggleRecording}>
            <Image
              source={
                recording ? stopIcon : require('../../assets/recordicon.png')
              }
              style={styles.recordIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>기록하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  dateText: {
    marginTop: 100,
    color: '#838383',
    textAlign: 'center',
    fontFamily: 'Noto Sans',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 19.36,
    marginBottom: 16,
  },
  pickerContainer: {
    width: 80,
    height: 32,
    borderRadius: 20,
    marginLeft: 30,
    backgroundColor: '#EFF0FF',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  picker: {
    width: '100%',
    height: '100%',
    flexShrink: 0,
    borderRadius: 20,
    backgroundColor: '#EFF0FF',
    color: '#6369D4',
    textAlign: 'center',
    fontFamily: 'Noto Sans',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.36,
    paddingRight: 20,
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
  contentInput: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#6369D4',
    fontFamily: 'Noto Sans',
    fontWeight: '400',
    lineHeight: 19.36,
  },
  contentBox: {
    width: 330,
    height: 299,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6369D4',
    marginTop: 28,
    position: 'relative',
  },
  recordIconContainer: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  recordIcon: {
    width: 44,
    height: 44,
  },
  imagePicker: {
    width: 330,
    height: 128,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6369D4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#FFF',
  },
  photoIcon: {
    width: 52,
    height: 52,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  btn: {
    width: 143,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#6369D4',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
    marginTop: 28,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'NotoSans600',
  },
});
