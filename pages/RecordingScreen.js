import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

const RecordingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item, onRecordComplete } = route.params;

  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingState, setRecordingState] = useState("idle"); // 'idle', 'recording', 'paused', 'listening'

  const handleComplete = () => {
    if (onRecordComplete) {
      onRecordComplete(item);
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (route.params?.onRecordComplete) {
      navigation.setParams({ onRecordComplete: route.params.onRecordComplete });
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [route.params?.onRecordComplete]);

  const handleRecordButtonPress = async () => {
    if (recordingState === "idle") {
      await startRecording();
    } else if (recordingState === "recording") {
      await stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("오디오 녹음 권한이 필요합니다.");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setRecordingState("recording");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const { sound } = await recording.createNewLoadedSoundAsync();
      setSound(sound);
      setRecordingState("paused");
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const handlePauseButtonPress = () => {
    if (sound) {
      sound.playAsync();
    }
    setRecordingState("listening");
  };

  const handleRestart = () => {
    setRecording(null);
    setSound(null);
    setRecordingState("idle");
  };

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

      {recordingState === "idle" && (
        <Button title="녹음하기" onPress={handleRecordButtonPress} />
      )}
      {recordingState === "recording" && (
        <Button title="녹음중지" onPress={handleRecordButtonPress} />
      )}
      {recordingState === "paused" && (
        <Button title="녹음듣기" onPress={handlePauseButtonPress} />
      )}
      {recordingState === "listening" && (
        <View>
          <Button title="다시하기" onPress={handleRestart} />
          <Button title="녹음 완료" onPress={handleComplete} />
        </View>
      )}
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
