import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const img = require('../assets/clap.png');

type RootStackParamList = {
  Home: undefined;
};

type WriteFinishScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

const WriteFinish: React.FC = () => {
  const navigation = useNavigation<WriteFinishScreenNavigationProp>();

  const handleFinishPress = () => {
    // 작성완료 로직 추가
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>기록 완료!!</Text>
      <Image source={img} style={styles.img} />
      <TouchableOpacity style={styles.nextBtn} onPress={handleFinishPress}>
        <Text style={styles.nextBtnText}>홈으로 가기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WriteFinish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ABB0FE',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'NotoSans600',
    marginBottom: 50,
  },
  img: {
    width: 280,
    height: 300,
  },
  nextBtn: {
    backgroundColor: '#6369D4',
    width: 245,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 31,
  },
  nextBtnText: {
    fontSize: 15,
    fontFamily: 'NotoSans600',
    color: '#fff',
  },
});
