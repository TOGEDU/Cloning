/* eslint-disable no-alert */
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LogBox,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../api'; // BASE_URL을 불러옵니다.

// 경고 메시지를 무시합니다.
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// PendingRecording 및 Response 타입 정의
interface RecordingItem {
  id: number;
  text: string;
}

interface VoiceApiResponse {
  progressPercentage: number;
  sentenceList: RecordingItem[];
}

const Record: React.FC = () => {
  const [progress, setProgress] = useState<number>(0); // 초기 진행률을 0으로 설정
  const [pendingRecordings, setPendingRecordings] = useState<RecordingItem[]>([]); // RecordingItem 타입 배열
  const [completedRecordings, setCompletedRecordings] = useState<RecordingItem[]>([]); // 완료된 녹음
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get<VoiceApiResponse>(`${BASE_URL}/api/voice`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const {progressPercentage, sentenceList} = response.data;
        setProgress(progressPercentage);
        setPendingRecordings(sentenceList); // sentenceList를 pendingRecordings로 설정
      } catch (error) {
        console.error('Failed to fetch recordings', error);
      }
    };

    fetchRecordings(); // 컴포넌트가 마운트될 때 API 호출
  }, []);

  const handleRecordComplete = (item: RecordingItem) => {
    setCompletedRecordings([...completedRecordings, item]);
    setPendingRecordings(pendingRecordings.filter(record => record.id !== item.id));
    setProgress(prevProgress =>
      Math.min(100, Math.floor(prevProgress + 100 / (pendingRecordings.length || 1))),
    );
  };

  const handleRecordingPress = (item: RecordingItem) => {
    if (item) {
      navigation.navigate('RecordingScreen', {
        item, // 아이템 전달
        onRecordComplete: handleRecordComplete,
      });
    } else {
      alert('아이템 정보가 없습니다.');
    }
  };

  return (
    <ScrollView style={styles.fullcontainer}>
      <View style={styles.container}>
        <View style={styles.titleprogressContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>음성 기록 진행 현황</Text>
          </View>
          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={200}
              width={15}
              fill={progress}
              tintColor="#6369D4"
              backgroundColor="#e6e6e6"
              rotation={0}
              lineCap="round">
              {() => (
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>{progress}%</Text>
                  <Text style={styles.progressSubText}>
                    {progress === 0 ? '시작해봐요!' : '잘하고 계세요'}
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>

        <View>
          {pendingRecordings.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recordingItem}
              onPress={() => handleRecordingPress(item)}>
              <Text style={styles.recordingText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Record;

const styles = StyleSheet.create({
  fullcontainer: {
    paddingTop: 27,
    backgroundColor: '#F7F8FF',
    flex: 1,
  },
  container: {
    marginBottom: 75,
  },
  titleprogressContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E5E7',
    width: 324,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Noto Sans',
    marginBottom: 18,
    textAlign: 'center',
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 38,
  },
  progressTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 34,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
  },
  progressSubText: {
    fontSize: 14,
    color: '#6369D4',
    fontFamily: 'Noto Sans',
  },
  recordingItem: {
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 13,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
  },
  recordingText: {
    fontSize: 15,
    fontFamily: 'Noto Sans',
    padding: 15,
  },
});
