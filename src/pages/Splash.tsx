import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

// Navigation 타입 정의 (필요에 따라 StackParamList를 정의)
type RootStackParamList = {
  Splash: undefined,
  Login: undefined,
};

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash',
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const Splash: React.FC<Props> = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // 2초 후 로그인 화면으로 이동
    }, 2000);

    // 컴포넌트 언마운트 시 타이머를 정리
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>그리운 부모님과 대화를 이어가다</Text>
      <Text style={styles.logo}>CLONING</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#858AE8',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'NotoSans',
  },
  logo: {
    fontSize: 66,
    fontFamily: 'LuckiestGuy-Regular',
    color: '#fff',
  },
});

export default Splash;
