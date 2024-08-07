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

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = () => {
    // 임시로 부모, 자식 로그인 구별
    if (email === "12" && password === "12") {
      navigation.replace("Home");
    } else if (email === "56" && password === "56") {
      navigation.replace("ChildChat");
    } else {
      alert("잘못된 이메일 또는 비밀번호입니다.");
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
    fontWeight: "bold",
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
    fontWeight: "600",
  },
  signupTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#888",
    fontSize: 11,
    fontWeight: "500",
    marginRight: 4,
  },
  signupLink: {
    color: "#858AE8",
    textDecorationLine: "none",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Login;
