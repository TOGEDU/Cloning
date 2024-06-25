import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const RecordingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const handleComplete = () => {
    const onRecordComplete = route.params?.onRecordComplete;
    if (onRecordComplete) {
      onRecordComplete(item);
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (route.params?.onRecordComplete) {
      navigation.setParams({ onRecordComplete: route.params.onRecordComplete });
    }
  }, [route.params?.onRecordComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.notetext}>
        녹음할 때 유의해주세요 {"\n"}
        {"\n"}
        {"\n"}
        .(마침표)와 ,(쉼표)는 쉬어 {"\n"}
        ?(물음표)는 의문문으로 읽어주세요 {"\n"}
        {"\n"}
        {"\n"}
        모든 문장은 일정한 속도로 ! {"\n"}
        초당 3.8 글자에서 3.9 글자가 적당합니다 {"\n"}
        {"\n"}
        {"\n"}
        숨소리, 키보드 소리, 에어컨 소리 등 {"\n"}
        잡음이 들어기지 않도록 주의해주세요
      </Text>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
      </View>

      <Button title="녹음 완료" onPress={handleComplete} />
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    backgroundColor: "white",
    paddingTop: 50,
  },
  notetext: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 70,
    color: "#989797",
  },
  itemContainer: {
    backgroundColor: "#6369D4",
    borderRadius: 20,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
    color: "white",
    paddingVertical: 20,
    textAlign: "center",
  },
});
