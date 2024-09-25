import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Record from './pages/Record';
import RecordingScreen from './pages/RecordingScreen';
import TodayQuestion from './pages/TodayQuestion';
import DiaryList from './pages/DiaryList';
import DiaryDetail from './pages/DiaryDetail';
import Diary from './pages/Diary';
import TodayQuestionList from './pages/TodayQuestionList';
import Splash from './pages/Splash';
import Login from './pages/Login';
import ChildChat from './pages/ChildChat';
import SignupStart from './pages/Signup/SignupStart';
import ParentSignup from './pages/Signup/Parent/ParentSignup';
import ParentSearchCode from './pages/Signup/Parent/ParentSearchCode';
import ParentIdPw from './pages/Signup/Parent/ParentIdPw';
import ParentPush from './pages/Signup/Parent/ParentPush';
import ParentChildInfo from './pages/Signup/Parent/ParentChildInfo';
import ChildSignup from './pages/Signup/Child/ChildSignup';
import ChildSearchCode from './pages/Signup/Child/ChildSearchCode';
import ChildIdPw from './pages/Signup/Child/ChildIdPw';
import ChildInfo from './pages/Signup/Child/ChildInfo';
import MyPage from './pages/MyPage';
import SignupFinish from './pages/Signup/SignupFinish';
import WriteFinish from './pages/WriteFinish';
import Achieve from './pages/Achieve';
import ChatList from './pages/ChatList';
import ChildMyPage from './pages/ChildMyPage';
import Album from './pages/Album';
import ImageView from './pages/ImageView';
import ChatRoomScreen from './pages/ChatRoomScreen';
import { AuthProvider } from './AuthContext';

const Stack = createStackNavigator();

// FCM 백그라운드 메시지 핸들러 설정
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

const headerlessRoutes = [
  'Splash',
  'Login',
  'SignupStart',
  'SignupFinish',
  'WriteFinish',
  'ChildChat',
  'ChatList',
  'ChildMyPage',
  'Album',
  'ImageView',
  'ChatRoomScreen',
];

const footerlessRoutes = [
  'Splash',
  'Login',
  'SignupStart',
  'ParentSignup',
  'ParentSearchCode',
  'ParentIdPw',
  'ParentPush',
  'ParentChildInfo',
  'ChildSignup',
  'ChildSearchCode',
  'ChildInfo',
  'ChildIdPw',
  'SignupFinish',
  'WriteFinish',
  'ChildChat',
  'ChatList',
  'ChildMyPage',
  'Album',
  'ImageView',
  'ChatRoomScreen',
  'Diary',
  'DiaryDetail',
];

const App = () => {
  // const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>('Splash');

  // FCM 관련 useEffect
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        // 필요하면 FCM 토큰을 화면에 표시하는 로직을 추가할 수 있습니다.
        // Alert.alert("FCM Token", token);
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    };

    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFCMToken();
      }
    };

    requestPermission();

    // 포그라운드 메시지 처리
    const unsubscribeMessage = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
        Alert.alert(title || 'No Title', body || 'No Body');
      }
    });

    // 토큰 갱신 시 처리
    const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
      console.log('New FCM Token:', token);
    });

    return () => {
      unsubscribeMessage(); // 메시지 리스너 해제
      unsubscribeTokenRefresh(); // 토큰 갱신 리스너 해제
    };
  }, []);

  // 폰트 로딩
  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       'LuckiestGuy-Regular': require('./assets/fonts/LuckiestGuy-Regular.ttf'),
  //       NotoSans: require('./assets/fonts/NotoSans-VariableFont_wdth,wght.ttf'),
  //       NotoSans500: require('./assets/fonts/NotoSans_Condensed-Medium.ttf'),
  //       NotoSans600: require('./assets/fonts/NotoSans_Condensed-SemiBold.ttf'),
  //       NotoSans700: require('./assets/fonts/NotoSans_Condensed-Bold.ttf'),
  //       NotoSans800: require('./assets/fonts/NotoSans_Condensed-ExtraBold.ttf'),
  //       NotoSans900: require('./assets/fonts/NotoSans_ExtraCondensed-Black.ttf'),
  //     });
  //     setFontsLoaded(true);
  //   };

  //   loadFonts();
  // }, []);

  // if (!fontsLoaded) {
  //   return null; // 로딩 중일 때 스플래시 화면이나 로딩 컴포넌트를 표시 가능
  // }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer
          onStateChange={(state: NavigationState | undefined) => {
            if (state) {
              const route = state.routes[state.index];
              setCurrentRoute(route.name);
            }
          }}
        >
          {headerlessRoutes.includes(currentRoute) ? (
            <View style={styles.container}>
              <StatusBar barStyle="dark-content" />
              <ContentWrapper currentRoute={currentRoute}>
                <AppNavigator />
              </ContentWrapper>
              {!footerlessRoutes.includes(currentRoute) && <Footer />}
            </View>
          ) : (
            <SafeAreaView style={styles.container}>
              <StatusBar barStyle="dark-content" />
              <HeaderWrapper currentRoute={currentRoute} />
              <ContentWrapper currentRoute={currentRoute}>
                <AppNavigator />
              </ContentWrapper>
              {!footerlessRoutes.includes(currentRoute) && <Footer />}
            </SafeAreaView>
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

const AppNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="ChildChat" component={ChildChat} />
    <Stack.Screen name="SignupStart" component={SignupStart} />
    <Stack.Screen name="ParentSignup" component={ParentSignup} />
    <Stack.Screen name="ParentSearchCode" component={ParentSearchCode} />
    <Stack.Screen name="ParentIdPw" component={ParentIdPw} />
    <Stack.Screen name="ParentPush" component={ParentPush} />
    <Stack.Screen name="ParentChildInfo" component={ParentChildInfo} />
    <Stack.Screen name="ChildSignup" component={ChildSignup} />
    <Stack.Screen name="ChildSearchCode" component={ChildSearchCode} />
    <Stack.Screen name="ChildInfo" component={ChildInfo} />
    <Stack.Screen name="ChildIdPw" component={ChildIdPw} />
    <Stack.Screen name="SignupFinish" component={SignupFinish} />
    <Stack.Screen name="Achieve" component={Achieve} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Record" component={Record} />
    <Stack.Screen name="TodayQuestion" component={TodayQuestion} />
    <Stack.Screen name="TodayQuestionList" component={TodayQuestionList} />
    <Stack.Screen name="MyPage" component={MyPage} />
    <Stack.Screen name="DiaryList" component={DiaryList} />
    <Stack.Screen name="DiaryDetail" component={DiaryDetail} />
    <Stack.Screen name="Diary" component={Diary} />
    <Stack.Screen name="RecordingScreen" component={RecordingScreen} />
    <Stack.Screen name="WriteFinish" component={WriteFinish} />
    <Stack.Screen name="ChatList" component={ChatList} />
    <Stack.Screen name="ChildMyPage" component={ChildMyPage} />
    <Stack.Screen name="Album" component={Album} />
    <Stack.Screen name="ImageView" component={ImageView} />
    <Stack.Screen
      name="ChatRoomScreen"
      component={ChatRoomScreen}
      options={{ animationEnabled: false }}
    />
  </Stack.Navigator>
);

const ContentWrapper: React.FC<{ children: React.ReactNode; currentRoute: string }> = ({ children, currentRoute }) => {
  let backgroundColor = '#fff';
  if (currentRoute === 'TodayQuestion' || currentRoute === 'SignupFinish') {
    backgroundColor = '#ABB0FE';
  } else if (currentRoute === 'DiaryList') {
    backgroundColor = '#858AE8';
  } else if (currentRoute === 'TodayQuestionList' || currentRoute === 'Record') {
    backgroundColor = '#F7F8FF';
  } else if (currentRoute === 'SignupStart' || currentRoute === 'ChildMyPage') {
    backgroundColor = '#6B73FF';
  }

  return <View style={[styles.content, { backgroundColor }]}>{children}</View>;
};

const HeaderWrapper: React.FC<{ currentRoute: string }> = ({ currentRoute }) => {
  let backgroundColor = '#fff';
  if (currentRoute === 'TodayQuestion' || currentRoute === 'SignupFinish') {
    backgroundColor = '#ABB0FE';
  } else if (currentRoute === 'DiaryList') {
    backgroundColor = '#858AE8';
  } else if (currentRoute === 'TodayQuestionList' || currentRoute === 'Record') {
    backgroundColor = '#F7F8FF';
  } else if (currentRoute === 'SignupStart' || currentRoute === 'ChildMyPage') {
    backgroundColor = '#6B73FF';
  }

  return <Header backgroundColor={backgroundColor} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default App;
