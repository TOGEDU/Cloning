import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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
import ChatList from "./pages/ChatList";
import ChildMyPage from "./pages/ChildMyPage";

const Stack = createStackNavigator();

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("Splash");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentRoute("Splash");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onStateChange={(state) => {
          const route = state.routes[state.index];
          setCurrentRoute(route.name);
        }}
      >
        <SafeAreaWrapper currentRoute={currentRoute}>
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
        </SafeAreaWrapper>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const SafeAreaWrapper = ({ children, currentRoute }) => {
  // 각 페이지별로 상단바 색상을 설정
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
  } else if (currentRoute === "SignupStart" || currentRoute === "ChildMyPage") {
    backgroundColor = "#6B73FF"; // SignupStart와 ChildMyPage의 배경색
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  );
};

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
  } else if (currentRoute === "SignupStart" || currentRoute === "ChildMyPage") {
    backgroundColor = "#6B73FF"; // SignupStart와 ChildMyPage의 배경색
  }

  return <Header backgroundColor={backgroundColor} />;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});