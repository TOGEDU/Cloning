// App.js
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import messaging from "@react-native-firebase/messaging";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase 초기화
import { app, analytics } from "./firebaseConfig";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Record from "./pages/Record";
import RecordingScreen from "./pages/RecordingScreen";
import TodayQuestion from "./pages/TodayQuestion";
import DiaryList from "./pages/DiaryList";
import Diary from "./pages/Diary";
import TodayQuestionList from "./pages/TodayQuestionList";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import ChildChat from "./pages/ChildChat";
import SignupStart from "./pages/Signup/SignupStart";
import ParentSignup from "./pages/Signup/Parent/ParentSignup";
import ParentSearchCode from "./pages/Signup/Parent/ParentSearchCode";
import ParentIdPw from "./pages/Signup/Parent/ParentIdPw";
import ParentPush from "./pages/Signup/Parent/ParentPush";
import ParentChildInfo from "./pages/Signup/Parent/ParentChildInfo";
import ChildSignup from "./pages/Signup/Child/ChildSignup";
import ChildSearchCode from "./pages/Signup/Child/ChildSearchCode";
import ChildIdPw from "./pages/Signup/Child/ChildIdPw";
import ChildInfo from "./pages/Signup/Child/ChildInfo";
import MyPage from "./pages/MyPage";
import SignupFinish from "./pages/Signup/SignupFinish";
import WriteFinish from "./pages/WriteFinish";
import Achieve from "./pages/Achieve";
import ChatList from "./pages/ChatList"; // 경로를 적절히 변경하세요
import ChildMyPage from "./pages/ChildMyPage"; // 경로를 적절히 변경하세요

const Stack = createStackNavigator();

async function postToApi(endpoint, data) {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error posting token to API:", error);
  }
}

async function onAppBootstrap() {
  try {
    const defaultAppMessaging = messaging(); // 기본 앱의 Messaging 서비스 얻기

    // Get the token
    const token = await defaultAppMessaging.getToken();

    // Save the token
    await postToApi("/api/sign/sign-in", { token });
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("Splash");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentRoute("Splash");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    onAppBootstrap(); // FCM 토큰 초기화 함수 호출
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onStateChange={(state) => {
          const route = state.routes[state.index];
          setCurrentRoute(route.name);
        }}
      >
        {currentRoute !== "Splash" ? (
          <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            {currentRoute !== "Splash" &&
              currentRoute !== "Login" &&
              currentRoute !== "SignupStart" &&
              currentRoute !== "SignupFinish" &&
              currentRoute !== "WriteFinish" &&
              currentRoute !== "ChildChat" &&
              currentRoute !== "ChatList" &&
              currentRoute !== "ChildMyPage" && (
                <HeaderWrapper currentRoute={currentRoute} />
              )}
            <View style={styles.content}>
              <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="Splash"
              >
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="ChildChat" component={ChildChat} />

                <Stack.Screen name="SignupStart" component={SignupStart} />
                <Stack.Screen name="ParentSignup" component={ParentSignup} />
                <Stack.Screen
                  name="ParentSearchCode"
                  component={ParentSearchCode}
                />
                <Stack.Screen name="ParentIdPw" component={ParentIdPw} />
                <Stack.Screen name="ParentPush" component={ParentPush} />
                <Stack.Screen
                  name="ParentChildInfo"
                  component={ParentChildInfo}
                />
                <Stack.Screen name="ChildSignup" component={ChildSignup} />
                <Stack.Screen
                  name="ChildSearchCode"
                  component={ChildSearchCode}
                />
                <Stack.Screen name="ChildInfo" component={ChildInfo} />
                <Stack.Screen name="ChildIdPw" component={ChildIdPw} />

                <Stack.Screen name="SignupFinish" component={SignupFinish} />
                <Stack.Screen name="Achieve" component={Achieve} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Record" component={Record} />
                <Stack.Screen name="TodayQuestion" component={TodayQuestion} />
                <Stack.Screen
                  name="TodayQuestionList"
                  component={TodayQuestionList}
                />
                <Stack.Screen name="MyPage" component={MyPage} />
                <Stack.Screen name="DiaryList" component={DiaryList} />
                <Stack.Screen name="Diary" component={Diary} />
                <Stack.Screen
                  name="RecordingScreen"
                  component={RecordingScreen}
                />
                <Stack.Screen name="WriteFinish" component={WriteFinish} />
                <Stack.Screen name="ChatList" component={ChatList} />
                <Stack.Screen name="ChildMyPage" component={ChildMyPage} />
              </Stack.Navigator>
            </View>
            {currentRoute !== "Splash" &&
              currentRoute !== "Login" &&
              currentRoute !== "SignupStart" &&
              currentRoute !== "ParentSignup" &&
              currentRoute !== "ParentSearchCode" &&
              currentRoute !== "ParentIdPw" &&
              currentRoute !== "ParentPush" &&
              currentRoute !== "ParentChildInfo" &&
              currentRoute !== "ChildSignup" &&
              currentRoute !== "ChildSearchCode" &&
              currentRoute !== "ChildInfo" &&
              currentRoute !== "ChildIdPw" &&
              currentRoute !== "SignupFinish" &&
              currentRoute !== "WriteFinish" &&
              currentRoute !== "ChildChat" &&
              currentRoute !== "ChatList" &&
              currentRoute !== "ChildMyPage" && <Footer />}
          </SafeAreaView>
        ) : (
          <View style={styles.safeArea}>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="Splash"
            >
              <Stack.Screen name="Splash" component={Splash} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignupStart" component={SignupStart} />
              <Stack.Screen name="ParentSignup" component={ParentSignup} />
              <Stack.Screen
                name="ParentSearchCode"
                component={ParentSearchCode}
              />
              <Stack.Screen name="ParentIdPw" component={ParentIdPw} />
              <Stack.Screen name="ParentPush" component={ParentPush} />
              <Stack.Screen
                name="ParentChildInfo"
                component={ParentChildInfo}
              />
              <Stack.Screen name="ChildSignup" component={ChildSignup} />
              <Stack.Screen
                name="ChildSearchCode"
                component={ChildSearchCode}
              />
              <Stack.Screen name="ChildInfo" component={ChildInfo} />
              <Stack.Screen name="ChildIdPw" component={ChildIdPw} />
              <Stack.Screen name="SignupFinish" component={SignupFinish} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Record" component={Record} />
              <Stack.Screen name="TodayQuestion" component={TodayQuestion} />
              <Stack.Screen
                name="TodayQuestionList"
                component={TodayQuestionList}
              />
              <Stack.Screen name="WriteFinish" component={WriteFinish} />
              <Stack.Screen name="DiaryList" component={DiaryList} />
              <Stack.Screen name="Diary" component={Diary} />
              <Stack.Screen
                name="RecordingScreen"
                component={RecordingScreen}
              />
              <Stack.Screen name="ChatList" component={ChatList} />
              <Stack.Screen name="ChildMyPage" component={ChildMyPage} />
            </Stack.Navigator>
          </View>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const HeaderWrapper = ({ currentRoute }) => {
  let backgroundColor = "#fff";
  if (currentRoute === "TodayQuestion" || currentRoute === "SignupFinish") {
    backgroundColor = "#ABB0FE";
  } else if (currentRoute === "DiaryList") {
    backgroundColor = "#858AE8";
  } else if (
    currentRoute === "TodayQuestionList" ||
    currentRoute === "Record"
  ) {
    backgroundColor = "#F7F8FF";
  }

  return <Header backgroundColor={backgroundColor} />;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
