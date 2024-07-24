import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import back from "../assets/back.png";
import smallLogo from "../assets/smallLogo.png";
import logotext from "../assets/logotext.png";
import mypagew from "../assets/mypagew.png";

const ChatList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ChildChat")}>
          <Image source={back} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.headerlogo}>
          <Image source={smallLogo} style={styles.smallLogo} />
          <Image source={logotext} style={styles.logotext} />
        </View>
        <Image source={mypagew} style={styles.mypagew} />
      </View>
      <View style={styles.listcontainer}>
        <View style={styles.list}>
          <View style={styles.textContainer}>
            <Text style={styles.listtext}>학교생활에 관한 대화</Text>
            <Text style={styles.listsubtext}>Jun6, 2024</Text>
          </View>
        </View>
        <View style={styles.list}>
          <View style={styles.textContainer}>
            <Text style={styles.listtext}>학교생활에 관한 대화</Text>
            <Text style={styles.listsubtext}>Jun6, 2024</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerlogo: {
    flexDirection: "row",
    alignItems: "center",
  },
  listcontainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  list: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 32,
    //paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  listtext: {
    fontSize: 16,
  },
  listsubtext: {
    fontSize: 16,
    color: "#BDBDBD",
  },
});

export default ChatList;
