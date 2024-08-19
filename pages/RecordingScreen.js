import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import axios from "axios";
import BASE_URL from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RecordingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item, onRecordComplete } = route.params;

  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingState, setRecordingState] = useState("idle"); // 'idle', 'recording', 'paused', 'listening'

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

  const uploadRecording = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!item || !item.id) {
        alert("아이템 정보가 올바르게 전달되지 않았습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("id", item.id.toString()); // 문장 아이디 추가
      formData.append("voiceRecord", {
        uri,
        name: "recording.mp3",
        type: "audio/mpeg",
      });

      const response = await axios.post(`${BASE_URL}/api/voice`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("녹음이 성공적으로 업로드되었습니다.");
      } else {
        alert("녹음 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("녹음 업로드 중 오류 발생", error);
      alert("녹음 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleComplete = async () => {
    if (sound && recording) {
      const uri = recording.getURI();
      await uploadRecording(uri);
    }

    if (onRecordComplete) {
      onRecordComplete(item);
      navigation.goBack();
    }
  };

  const renderButton = (title, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.itemText}>
          {item ? item.text : "No text available"}
        </Text>
      </View>

      {recordingState === "idle" &&
        renderButton("녹음하기", handleRecordButtonPress)}
      {recordingState === "recording" &&
        renderButton("녹음중지", handleRecordButtonPress)}
      {recordingState === "paused" &&
        renderButton("녹음듣기", handlePauseButtonPress)}
      {recordingState === "listening" && (
        <View>
          {renderButton("다시하기", handleRestart)}
          {renderButton("녹음완료", handleComplete)}
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
  button: {
    backgroundColor: "#ABB0FE",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginHorizontal: 115,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
