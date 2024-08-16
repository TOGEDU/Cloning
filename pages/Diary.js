import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "react-native-image-picker";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

// 날짜 가져올거면 route로 가져올 수 있음!

const Diary = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(null);
  const [image, setImage] = useState(null);

  const handleSave = () => {
    // 일기 저장 로직 추가하기
    navigation.replace("WriteFinish");
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <Path
            d="M12.8334 12.8333L31.1667 31.1666M12.8334 31.1666L31.1667 12.8333"
            stroke="#545454"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={[
          { label: "첫째", value: "첫째" },
          { label: "둘째", value: "둘째" },
        ]}
        placeholder={{ label: "자식 선택", value: null }}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

      <Text style={styles.title}>제목</Text>

      <TextInput
        style={styles.titleInput}
        placeholder="일기의 제목을 적어주세요"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.contentTitle}>내용</Text>
      <TextInput
        style={styles.contentInput}
        placeholder="일기의 내용을 적어주세요"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>+ 사진 추가</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>기록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 20,
    zIndex: 1,
  },
  picker: {
    marginLeft: 28,
    color: "#838383",
    marginBottom: 15,
    fontSize: 13,
    fontFamily: "NotoSans",
    width: 100,
    height: 32,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    alignSelf: "flex-start",
    marginLeft: 36,
    fontFamily: "NotoSans",
    marginBottom: 15,
  },
  contentTitle: {
    fontSize: 24,
    alignSelf: "flex-start",
    marginLeft: 36,
    fontFamily: "NotoSans",
    marginBottom: 15,
  },
  titleInput: {
    height: 50,
    width: 330,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#F7F7F7",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  contentInput: {
    width: 330,
    height: 190,
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  imagePicker: {
    width: 330,
    height: 140,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#F7F7F7",
  },
  imagePickerText: {
    color: "#838383",
    fontSize: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  btn: {
    width: 143,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: "#6369D4",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120,
    marginTop: 27,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "NotoSans600",
  },
});
