import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
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
import SignupStart from "./pages/Signup/SignupStart";
import ParentSignup from "./pages/Signup/Parent/ParentSignup";
import ParentSearchCode from "./pages/Signup/Parent/ParentSearchCode";
import ParentIdPw from "./pages/Signup/Parent/ParentIdPw";
import ParentPush from "./pages/Signup/Parent/ParentPush";
import ParentChildInfo from "./pages/Signup/Parent/ParentChildInfo";

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
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          {currentRoute !== "Splash" &&
            currentRoute !== "Login" &&
            currentRoute !== "SignupStart" && (
              <HeaderWrapper currentRoute={currentRoute} />
            )}
          <View style={styles.content}>
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

              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Record" component={Record} />
              <Stack.Screen name="TodayQuestion" component={TodayQuestion} />
              <Stack.Screen
                name="TodayQuestionList"
                component={TodayQuestionList}
              />
              <Stack.Screen name="DiaryList" component={DiaryList} />
              <Stack.Screen name="Diary" component={Diary} />
              <Stack.Screen
                name="RecordingScreen"
                component={RecordingScreen}
              />
            </Stack.Navigator>
          </View>
          {currentRoute !== "Splash" &&
            currentRoute !== "Login" &&
            currentRoute !== "SignupStart" &&
            currentRoute !== "ParentSignup" &&
            currentRoute !== "ParentSearchCode" &&
            currentRoute !== "ParentIdPw" &&
            currentRoute !== "ParentPush" && <Footer />}
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const HeaderWrapper = ({ currentRoute }) => {
  let backgroundColor = "#fff";
  if (currentRoute === "TodayQuestion") {
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
