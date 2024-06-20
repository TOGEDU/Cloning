import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Diary = () => {
  return (
    <View style={styles.container}>
      <Text>여긴 육아일기 페이지</Text>
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
