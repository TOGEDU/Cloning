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
import { GlobalStyles } from "../../../constants/styles";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const ParentIdPw = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };
  const handleNext = () => {
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmError("");

    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      valid = false;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (password.length < 6) {
      setPasswordError("비밀번호는 6자리 이상이어야 합니다.");
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("비밀번호는 영어, 특수문자, 숫자가 섞여 있어야 합니다.");
      valid = false;
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      valid = false;
    }

    if (valid) {
      navigation.navigate("ParentChildInfo");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>OOO님 반갑습니다!</Text>
          <Text style={styles.subtitle}>
            TOGEDU에 로그인할 때 사용할 {"\n"}이메일과 비밀번호를 입력해 주세요.
          </Text>
          <View style={styles.lineContainer}>
            <View style={styles.lineColor}></View>
            <View style={styles.lineColor}></View>
            <View style={styles.lineColor}></View>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
          </View>
          <View
            style={[
              styles.emailInputContainer,
              emailError ? styles.inputError : null,
            ]}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              style={styles.inputIconLeft}
            >
              <Path
                d="M25 26.25V23.75C25 22.4239 24.4732 21.1521 23.5355 20.2145C22.5978 19.2768 21.3261 18.75 20 18.75H10C8.67392 18.75 7.40215 19.2768 6.46447 20.2145C5.52678 21.1521 5 22.4239 5 23.75V26.25"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M15 13.75C17.7614 13.75 20 11.5114 20 8.75C20 5.98858 17.7614 3.75 15 3.75C12.2386 3.75 10 5.98858 10 8.75C10 11.5114 12.2386 13.75 15 13.75Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <View
            style={[
              styles.inputContainer,
              passwordError ? styles.inputError : null,
            ]}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              style={styles.inputIconLeft}
            >
              <Path
                d="M23.75 13.75H6.25C4.86929 13.75 3.75 14.8693 3.75 16.25V25C3.75 26.3807 4.86929 27.5 6.25 27.5H23.75C25.1307 27.5 26.25 26.3807 26.25 25V16.25C26.25 14.8693 25.1307 13.75 23.75 13.75Z"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M8.75 13.75V8.75C8.75 7.0924 9.40848 5.50269 10.5806 4.33058C11.7527 3.15848 13.3424 2.5 15 2.5C16.6576 2.5 18.2473 3.15848 19.4194 4.33058C20.5915 5.50269 21.25 7.0924 21.25 8.75V13.75"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />

            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={styles.inputIconRight}
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
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              style={styles.inputIconLeft}
            >
              <Path
                d="M23.75 13.75H6.25C4.86929 13.75 3.75 14.8693 3.75 16.25V25C3.75 26.3807 4.86929 27.5 6.25 27.5H23.75C25.1307 27.5 26.25 26.3807 26.25 25V16.25C26.25 14.8693 25.1307 13.75 23.75 13.75Z"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M8.75 13.75V8.75C8.75 7.0924 9.40848 5.50269 10.5806 4.33058C11.7527 3.15848 13.3424 2.5 15 2.5C16.6576 2.5 18.2473 3.15848 19.4194 4.33058C20.5915 5.50269 21.25 7.0924 21.25 8.75V13.75"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChangeText={(text) => setPasswordConfirm(text)}
              secureTextEntry
            />

            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={styles.inputIconRight}
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
          </View>
          {passwordConfirmError ? (
            <Text style={styles.errorText}>{passwordConfirmError}</Text>
          ) : null}

          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary100,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    marginTop: 50,
    fontSize: 30,
    marginLeft: 33,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 20,
    marginTop: 23,
    textAlign: "center",
    alignSelf: "flex-start",
    textAlign: "left",
    marginLeft: 33,
  },
  lineContainer: {
    marginTop: 23,
    flexDirection: "row",
    marginBottom: 44,
  },
  lineColor: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: GlobalStyles.colors.primary100,
  },
  line: {
    width: 68,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: GlobalStyles.colors.primary300,
  },
  emailInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3E3E3",
    borderRadius: 15,
    width: 350,
    height: 54,
    marginBottom: 13,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3E3E3",
    borderRadius: 15,
    width: 350,
    height: 54,
    marginBottom: 13,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputIconLeft: {
    marginLeft: 10,
  },
  inputIconRight: {
    marginRight: 10,
  },
  backBtn: {
    backgroundColor: GlobalStyles.colors.primary300,
    width: 350,
    height: 59,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 109,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  nextBtn: {
    backgroundColor: GlobalStyles.colors.primary200,
    width: 350,
    height: 59,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 31,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 33,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
});

export default ParentIdPw;
