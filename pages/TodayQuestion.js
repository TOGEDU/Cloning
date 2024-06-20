import React from "react";
import { Text, View, StyleSheet } from "react-native";

const TodayQuestion = () => {
  return (
    <View style={styles.container}>
      <Text>여긴 오늘의 질문 페이지</Text>
    </View>
  );
};

export default TodayQuestion;

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
});
