import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // 2초 후 로그인 화면으로 이동
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
