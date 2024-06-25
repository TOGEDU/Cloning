import React from "react";
import { Text, View, StyleSheet } from "react-native";

const TodayQuestionList = () => {
  return (
    <View style={styles.container}>
      <Text>여긴 오늘의 질문 목록 페이지</Text>
    </View>
  );
};

export default TodayQuestionList;

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
});
