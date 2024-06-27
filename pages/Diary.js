import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Diary = () => {
  return (
    <View style={styles.container}>
      <Text>여기서 일기 작성 페이지로 바로 넘어가야함</Text>
    </View>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
});
