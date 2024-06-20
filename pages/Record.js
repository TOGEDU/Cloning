import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Record = () => {
  return (
    <View style={styles.container}>
      <Text>여긴 음성 녹음 페이지</Text>
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
});
