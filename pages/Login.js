import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.19:8080/api/sign/sign-in",
        {
          email: email,
          password: password,
          fcmToken: "sldijbfg.sdgh.sdoq",
        }
      );

      const data = response.data;

      if (response.data.success) {
        if (data.role === "Parent") {
          navigation.navigate("Home");
        } else {
          navigation.navigate("ChildChat");
        }
        console.log("token:", data.token);
        await AsyncStorage.setItem("authToken", data.token);
      } else {
        console.error("Login failed:", response.data.msg);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.logo}>CLONING</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>아직 계정이 없다면? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignupStart")}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 44,
    fontFamily: "LuckiestGuy-Regular",
    lineHeight: 44,
    color: "#858AE8",
    marginBottom: 80,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: "60%",
    height: 50,
    backgroundColor: "#858AE8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "NotoSans600",
  },
  signupTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#888",
    fontSize: 11,
    fontFamily: "NotoSans500",
    marginRight: 4,
  },
  signupLink: {
    color: "#858AE8",
    fontFamily: "NotoSans500",
    textDecorationLine: "none",
    fontSize: 16,
  },
});

export default Login;
