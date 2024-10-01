/* eslint-disable curly */
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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import photoIcon from '../../assets/photoicon.png';
import RNPickerSelect from 'react-native-picker-select';
import {launchImageLibrary} from 'react-native-image-picker';
import Svg, {Path} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import axios from 'axios';
import recordIcon from '../../assets/recordicon.png';
import AudioRecorderPlayer from 'react-native-audio-recorder-player'; // 변경된 부분
import BASE_URL from '../api';

type DiaryDetailRouteProp = RouteProp<{params: {date: string}}, 'params'>;
interface DiaryEntry {
  diaryId: number;
  childName: string;
  content: string;
  image?: string;
}

const DiaryDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DiaryDetailRouteProp>();
  const {date} = route.params;

  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [childrenOptions, setChildrenOptions] = useState<
    {label: string; value: number}[]
  >([]);
  const [diaryData, setDiaryData] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState('');
  const [recording, setRecording] = useState(false); // 변경
  const [recordedUri, setRecordedUri] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const audioRecorderPlayer = new AudioRecorderPlayer(); // 추가

  useEffect(() => {
    const formatDate = (inputDate: Date): string => {
      const year = inputDate.getFullYear();
      const month = inputDate.getMonth() + 1;
      const day = inputDate.getDate();
      return `${year}년 ${month}월 ${day}일`;
    };

    setFormattedDate(formatDate(new Date(date)));

    const fetchDiaryDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('Token not found');

        const response = await axios.get<DiaryEntry[]>(
          `${BASE_URL}/api/diary`,
          {
            params: {date},
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        const formattedChildrenOptions = response.data.map(entry => ({
          label: entry.childName,
          value: entry.diaryId,
        }));
        setChildrenOptions(formattedChildrenOptions);

        setDiaryData(response.data);

        if (response.data.length > 0) {
          const firstDiary = response.data[0];
          setSelectedChild(firstDiary.diaryId);
          setContent(firstDiary.content);
        }
      } catch (error) {
        console.error('Error occurred:', error);
        Alert.alert('Error', 'An error occurred while fetching diary data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryDetail();
  }, [date]);

  useEffect(() => {
    if (selectedChild !== null) {
      const selectedDiary = diaryData.find(
        entry => entry.diaryId === selectedChild,
      );
      if (selectedDiary) {
        setContent(selectedDiary.content);
      }
    }
  }, [selectedChild, diaryData]);

  const handleImagePicker = async () => {
    const options: any = {
      mediaType: 'photo',
      quality: 1, // 0.0 ~ 1.0 사이의 값
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setDiaryData(prevDiaryData =>
          prevDiaryData.map(entry =>
            entry.diaryId === selectedChild
              ? {...entry, image: selectedImage}
              : entry,
          ),
        );
      }
    });
  };

  const handleUpdateDiary = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token not found');

      const selectedDiary = diaryData.find(
        entry => entry.diaryId === selectedChild,
      );
      if (!selectedDiary) return;

      const formData = new FormData();
      formData.append('diaryId', String(selectedChild));
      formData.append('content', content);

      if (selectedDiary.image) {
        formData.append('image', {
          uri: selectedDiary.image,
          type: 'image/jpeg',
          name: 'updated_image.jpg',
        } as any);
      }

      if (recordedUri) {
        formData.append('audio', {
          uri: recordedUri,
          type: 'audio/x-m4a',
          name: 'recording.m4a',
        } as any);
      }

      const response = await axios.put(`${BASE_URL}/api/diary`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        Alert.alert('Success', response.data.msg);
        setIsEditMode(false);
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.msg);
      }
    } catch (error) {
      console.error('Failed to update diary:', error);
      Alert.alert('Error', 'An error occurred while updating the diary.');
    }
  };

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setRecording(true);
      console.log('Recording started at: ', result);
      audioRecorderPlayer.addRecordBackListener(e => {
        console.log('Recording...', e.currentPosition);
      });
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordedUri(result);
      setRecording(false);
      console.log('Recording stopped, file saved at:', result);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const selectedDiary = diaryData.find(
    entry => entry.diaryId === selectedChild,
  );

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

        <Text style={styles.dateText}>{formattedDate}</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={value => setSelectedChild(value)}
            items={childrenOptions}
            placeholder={{label: '자식 선택', value: null}}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
              iconContainer: styles.iconContainer,
            }}
            value={selectedChild}
            Icon={() => (
              <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <Path
                  d="M11 1L6 7L1 1"
                  stroke="#CCCCCC"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          />
        </View>

        {isEditMode ? (
          <>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={handleImagePicker}>
              {selectedDiary?.image ? (
                <Image
                  source={{uri: selectedDiary.image}}
                  style={styles.diaryImage}
                />
              ) : (
                <Image source={photoIcon} style={styles.photoIcon} />
              )}
            </TouchableOpacity>

            <View style={styles.textAreaContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder="내용을 입력하세요"
                multiline
              />
              <TouchableOpacity
                style={styles.recordIconContainer}
                onPress={toggleRecording}>
                <Image source={recordIcon} style={styles.recordIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateDiary}>
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
          </>
        ) : (
          selectedDiary && (
            <View style={styles.diaryContentContainer}>
              {selectedDiary.image ? (
                <Image
                  source={{uri: selectedDiary.image}}
                  style={styles.diaryImage}
                />
              ) : (
                <Text style={styles.noImageText}>이미지가 없습니다.</Text>
              )}
              <Text style={styles.content}>{selectedDiary.content}</Text>
              <View style={styles.editButtonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditMode(true)}>
                  <Text style={styles.editButtonText}>수정하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DiaryDetail;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  dateText: {
    color: '#838383',
    textAlign: 'center',
    fontFamily: 'Noto Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 19.36,
    marginBottom: 10,
  },
  pickerContainer: {
    width: 77,
    height: 32,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 30,
    marginBottom: 28,
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#838383',
    textAlign: 'center',
    fontFamily: 'Noto Sans',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.36,
    paddingRight: 20,
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
  diaryContentContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 36,
  },
  editModeMargin: {
    marginLeft: 28,
  },
  input: {
    height: 50,
    width: 330,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textAreaContainer: {
    width: 330,
    height: 299,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6369D4',
    marginTop: 28,
    position: 'relative',
    justifyContent: 'center',
  },
  textArea: {
    flex: 1,
    padding: 15,
    paddingRight: 50,
    textAlignVertical: 'top',
  },
  content: {
    height: 195,
    width: 324,
    marginTop: 28,
  },
  recordIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  recordIcon: {
    width: 44,
    height: 44,
  },
  imagePicker: {
    width: 330,
    height: 128,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6369D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {
    width: 52,
    height: 52,
  },
  imagePickerText: {
    color: '#838383',
    fontSize: 12,
  },
  diaryImage: {
    width: 330,
    height: 128,
    borderRadius: 20,
  },
  noImageText: {
    color: '#838383',
    fontSize: 16,
  },
  editButtonContainer: {
    marginTop: 130,
    alignItems: 'center',
    width: '100%',
  },
  editButton: {
    display: 'flex',
    width: 143,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    borderRadius: 100,
    backgroundColor: '#6369D4',
  },
  editButtonText: {
    color: '#fff',
    fontFamily: 'NotoSans600',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 28,
    display: 'flex',
    width: 143,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    borderRadius: 100,
    backgroundColor: '#6369D4',
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'NotoSans600',
    fontSize: 16,
  },
});
