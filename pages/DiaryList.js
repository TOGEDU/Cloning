import React from "react";
import { Text, View, StyleSheet,Image } from "react-native";

const diaryImg = require("../assets/diaryListImg.png");

const DiaryList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>날짜를 눌러 {"\n"}일기를 확인해 보세요</Text>
      <Image style={styles.img} source={diaryImg} />
      <View style={styles.bottomContainer}></View>
    </View>
  );
};

export default DiaryList;

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#858AE8",
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "900",
    alignSelf:'flex-start',
    marginLeft:22,

  },
  img:{
    width:165,
    height:126,
    alignSelf:'flex-end',
    marginRight:22,
    marginBottom:-19,
  },
  bottomContainer: {
    height: 500,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#fff",
  },
});
