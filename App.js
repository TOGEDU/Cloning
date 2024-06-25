import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Record from "./pages/Record";
import RecordingScreen from "./pages/RecordingScreen";
import Diary from "./pages/Diary";
import TodayQuestion from "./pages/TodayQuestion";
import DiaryList from "./pages/DiaryList";
import TodayQuestionList from "./pages/TodayQuestionList";

const Stack = createStackNavigator();

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("");

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onStateChange={(state) => {
          const route = state.routes[state.index];
          setCurrentRoute(route.name);
        }}
      >
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <HeaderWrapper currentRoute={currentRoute} />
          <View style={styles.content}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Record" component={Record} />
              <Stack.Screen name="Diary" component={Diary} />
              <Stack.Screen name="TodayQuestion" component={TodayQuestion} />
              <Stack.Screen
                name="TodayQuestionList"
                component={TodayQuestionList}
              />
              <Stack.Screen name="DiaryList" component={DiaryList} />
              <Stack.Screen
                name="RecordingScreen"
                component={RecordingScreen}
              />
            </Stack.Navigator>
          </View>
          <Footer />
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
