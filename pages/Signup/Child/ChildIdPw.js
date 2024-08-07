import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChildIdPw = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = async () => {
    if (validateAll()) {
      try {
        const childId = await AsyncStorage.getItem("childId");
        const birthDate = await AsyncStorage.getItem("birthDate");
        const response = await axios.post(
          "http://192.168.35.124:8080/api/sign/child/sign-up",
          {
            childId: childId,
            name: "사용자",
            birthDate: birthDate,
            email: email,
            password: password,
          }
        );

        if (response.data.success) {
          navigation.navigate("SignupFinish");
          console.log(response);
        } else {
          console.error("Signup failed:", response.data.msg);
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  };

  const handleEmailCheck = async () => {
    setEmailCheckMessage("");
    setEmailError("");

    if (email === "") {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.35.124:8080/api/sign/emailduplicationcheck`,
        {
          params: { id: 3, email: email },
        }
      );
      const data = response.data;

      if (!data.success) {
        setEmailError("이미 가입된 이메일입니다.");
      } else {
        setEmailCheckMessage("사용 가능한 이메일입니다.");
      }
    } catch (error) {
      setEmailError("이메일 확인 중 오류가 발생");
      console.log(error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (password.length < 6) {
      setPasswordError("비밀번호는 6자리 이상이어야 합니다.");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("비밀번호는 영어, 특수문자, 숫자가 섞여 있어야 합니다.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validatePasswordConfirm = (password, passwordConfirm) => {
    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    setPasswordConfirmError("");
    return true;
  };

  const validateAll = () => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const passwordConfirmValid = validatePasswordConfirm(
      password,
      passwordConfirm
    );

    return emailValid && passwordValid && passwordConfirmValid;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>OOO님 반갑습니다!</Text>
        <Text style={styles.subtitle}>
          TOGEDU에 로그인할 때 사용할 {"\n"}이메일과 비밀번호를 입력해 주세요.
        </Text>
        <View style={styles.lineContainer}>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
          <View style={styles.lineColor}></View>
        </View>
        <View
          style={[
            styles.emailInputContainer,
            emailError ? styles.inputError : null,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="이메일"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
          />
          <TouchableOpacity
            onPress={handleEmailCheck}
            style={styles.emailCheckButton}
          >
            <Text style={styles.emailCheckButtonText}>중복 확인</Text>
          </TouchableOpacity>
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        {emailCheckMessage ? (
          <Text style={styles.successText}>{emailCheckMessage}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            passwordError ? styles.inputError : null,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.inputIconRight}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <Path
                d="M11.7666 11.7667C11.5377 12.0123 11.2617 12.2093 10.955 12.3459C10.6484 12.4826 10.3173 12.556 9.98166 12.562C9.64598 12.5679 9.31255 12.5061 9.00126 12.3804C8.68997 12.2547 8.40719 12.0675 8.16979 11.8301C7.93239 11.5927 7.74525 11.31 7.61951 10.9987C7.49377 10.6874 7.43202 10.3539 7.43795 10.0183C7.44387 9.68258 7.51734 9.35154 7.65398 9.04487C7.79062 8.73821 7.98763 8.46221 8.23325 8.23333M14.9499 14.95C13.5254 16.0358 11.7908 16.6374 9.99992 16.6667C4.16658 16.6667 0.833252 10 0.833252 10C1.86983 8.06825 3.30753 6.38051 5.04992 5.05L14.9499 14.95ZM8.24992 3.53333C8.82353 3.39907 9.4108 3.33195 9.99992 3.33333C15.8333 3.33333 19.1666 10 19.1666 10C18.6607 10.9463 18.0575 11.8373 17.3666 12.6583L8.24992 3.53333Z"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M0.833252 0.833313L19.1666 19.1666"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            passwordConfirmError ? styles.inputError : null,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChangeText={(text) => {
              setPasswordConfirm(text);
              validatePasswordConfirm(password, text);
            }}
            secureTextEntry={!showPasswordConfirm}
          />

          <TouchableOpacity
            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
            style={styles.inputIconRight}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <Path
                d="M11.7666 11.7667C11.5377 12.0123 11.2617 12.2093 10.955 12.3459C10.6484 12.4826 10.3173 12.556 9.98166 12.562C9.64598 12.5679 9.31255 12.5061 9.00126 12.3804C8.68997 12.2547 8.40719 12.0675 8.16979 11.8301C7.93239 11.5927 7.74525 11.31 7.61951 10.9987C7.49377 10.6874 7.43202 10.3539 7.43795 10.0183C7.44387 9.68258 7.51734 9.35154 7.65398 9.04487C7.79062 8.73821 7.98763 8.46221 8.23325 8.23333M14.9499 14.95C13.5254 16.0358 11.7908 16.6374 9.99992 16.6667C4.16658 16.6667 0.833252 10 0.833252 10C1.86983 8.06825 3.30753 6.38051 5.04992 5.05L14.9499 14.95ZM8.24992 3.53333C8.82353 3.39907 9.4108 3.33195 9.99992 3.33333C15.8333 3.33333 19.1666 10 19.1666 10C18.6607 10.9463 18.0575 11.8373 17.3666 12.6583L8.24992 3.53333Z"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M0.833252 0.833313L19.1666 19.1666"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        {passwordConfirmError ? (
          <Text style={styles.errorText}>{passwordConfirmError}</Text>
        ) : null}

        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>완료</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChildIdPw;

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 30,
    marginLeft: 33,
    fontFamily: "NotoSans700",
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 20,
    marginTop: 23,
    textAlign: "center",
    alignSelf: "flex-start",
    textAlign: "left",
    fontFamily: "NotoSans500",
    marginLeft: 33,
  },
  lineContainer: {
    marginTop: 50,
    flexDirection: "row",
    marginBottom: 50,
  },
  lineColor: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: "#6369D4",
  },
  line: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: "#DADBF5",
  },
  emailInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    width: 350,
    height: 54,
    marginBottom: 13,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    width: 350,
    height: 54,
    marginBottom: 13,
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    fontFamily: "NotoSans500",
  },
  emailCheckButton: {
    backgroundColor: "#ABB0FE",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  emailCheckButtonText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "NotoSans600",
    opacity: 0.5,
  },
  inputIconRight: {
    opacity: 0.5,
  },
  backBtn: {
    backgroundColor: "#ABB0FE",
    width: 245,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 109,
  },
  backBtnText: {
    fontSize: 15,
    fontFamily: "NotoSans600",
    color: "#fff",
  },
  nextBtn: {
    backgroundColor: "#6369D4",
    width: 245,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 31,
  },
  nextBtnText: {
    fontSize: 15,
    fontFamily: "NotoSans600",
    color: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 25,
    alignSelf: "flex-start",
    marginLeft: 33,
    fontFamily: "NotoSans500",
  },
  successText: {
    color: "green",
    marginBottom: 25,
    alignSelf: "flex-start",
    marginLeft: 33,
    fontFamily: "NotoSans500",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
});
