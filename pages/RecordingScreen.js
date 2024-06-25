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
      <Text style={styles.title}>{item}</Text>
      <Button title="녹음 완료" onPress={handleComplete} />
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
