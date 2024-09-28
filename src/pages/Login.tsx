import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../AuthContext';
import BASE_URL from '../api';

interface DecodedToken {
  exp: number;
  role: 'Parent' | 'Child';
}

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useContext(AuthContext);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/sign/sign-in`, {
        email: email,
        password: password,
        fcmToken: 'sldijbfg.sdgh.sdoq',
      });

      const data = response.data;

      if (data.success) {
        const token = data.token;
        if (token) {
          login(token);

          const decodedToken = jwtDecode<DecodedToken>(token);
          console.log('Decoded Token:', decodedToken);
          console.log('Token expires at:', new Date(decodedToken.exp * 1000));

          if (decodedToken.role === 'Parent') {
            navigation.navigate('Home');
          } else {
            navigation.navigate('ChildChat');
          }
        } else {
          Alert.alert('Error', 'Login failed: No token received');
        }
      } else {
        Alert.alert('Error', `Login failed: ${data.msg}`);
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      if (error.response) {
        Alert.alert('Error', `Login error: ${error.response.data.message}`);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.logo}>CLONING</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>아직 계정이 없다면? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupStart')}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 44,
    fontFamily: 'LuckiestGuy-Regular',
    lineHeight: 44,
    color: '#858AE8',
    marginBottom: 80,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#858AE8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'NotoSans600',
  },
  signupTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#888',
    fontSize: 11,
    fontFamily: 'NotoSans500',
    marginRight: 4,
  },
  signupLink: {
    color: '#858AE8',
    fontFamily: 'NotoSans500',
    textDecorationLine: 'none',
    fontSize: 16,
  },
});

export default Login;
