import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const ChildSignup = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState({
    serviceTerms: false,
    privacyPolicy: false,
    marketingConsent: false,
    additionalTerms: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const handleDetailPress = (title) => {
    setModalTitle(title);
    setIsVisible(true);
  };

  const navigation = useNavigation();

  const handleCheck = () => {
    setIsChecked(!isChecked);
    setTermsChecked({
      serviceTerms: !isChecked,
      privacyPolicy: !isChecked,
      marketingConsent: !isChecked,
      additionalTerms: !isChecked,
    });
  };

  const handleTermsClick = (term) => {
    setTermsChecked((prevTermsChecked) => ({
      ...prevTermsChecked,
      [term]: !prevTermsChecked[term],
    }));
  };
  const allTermsAgreed = Object.values(termsChecked).every(Boolean);

  const handleNext = () => {
    navigation.navigate("ChildSearchCode");
  };

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        환영합니다!{"\n"}TOGEDU에 가입하시려면{"\n"}약관에 동의해 주세요.
      </Text>
      <View style={styles.lineContainer}>
        <View style={styles.lineColor}></View>
        <View style={styles.line}></View>
        <View style={styles.line}></View>
        <View style={styles.line}></View>
      </View>
      <TouchableOpacity onPress={handleCheck} style={styles.agree}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill={termsChecked.privacyPolicy ? "#6369D4" : "#7D7C7C"}
        >
          <Path
            d="M9.948 18.75L4.0105 12.8125L5.49487 11.3281L9.948 15.7812L19.5053 6.22394L20.9897 7.70831L9.948 18.75Z"
            fill={termsChecked.privacyPolicy ? "#6369D4" : "#7D7C7C"}
          />
        </Svg>
        <Text style={styles.agreeText}>
          약관 전체 동의하기 (선택 동의 포함)
        </Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => handleTermsClick("privacyPolicy")}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill={termsChecked.privacyPolicy ? "#6369D4" : "#7D7C7C"}
          >
            <Path
              d="M9.948 18.75L4.0105 12.8125L5.49487 11.3281L9.948 15.7812L19.5053 6.22394L20.9897 7.70831L9.948 18.75Z"
              fill={termsChecked.privacyPolicy ? "#6369D4" : "#7D7C7C"}
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.text}>
          [필수] CLONING 이용 약관
          <TouchableOpacity
            onPress={() => handleDetailPress("TOGEDU 이용 약관")}
          >
            <Text style={styles.detailText}>자세히</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => handleTermsClick("marketingConsent")}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill={termsChecked.marketingConsent ? "#6369D4" : "#7D7C7C"}
          >
            <Path
              d="M9.948 18.75L4.0105 12.8125L5.49487 11.3281L9.948 15.7812L19.5053 6.22394L20.9897 7.70831L9.948 18.75Z"
              fill={termsChecked.marketingConsent ? "#6369D4" : "#7D7C7C"}
            />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.text}>
          [필수] 개인정보 수집 및 이용 동의
          <TouchableOpacity
            onPress={() => handleDetailPress("개인정보 수집 및 이용 동의")}
          >
            <Text style={styles.detailText}>자세히</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => handleTermsClick("additionalTerms")}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill={termsChecked.additionalTerms ? "#6369D4" : "#7D7C7C"}
          >
            <Path
              d="M9.948 18.75L4.0105 12.8125L5.49487 11.3281L9.948 15.7812L19.5053 6.22394L20.9897 7.70831L9.948 18.75Z"
              fill={termsChecked.additionalTerms ? "#6369D4" : "#7D7C7C"}
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.text}>[선택] 광고성 정보 수신 동의 </Text>
      </View>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => handleTermsClick("serviceTerms")}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill={termsChecked.serviceTerms ? "#6369D4" : "#7D7C7C"}
          >
            <Path
              d="M9.948 18.75L4.0105 12.8125L5.49487 11.3281L9.948 15.7812L19.5053 6.22394L20.9897 7.70831L9.948 18.75Z"
              fill={termsChecked.serviceTerms ? "#6369D4" : "#7D7C7C"}
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.text}>
          [선택] 개인정보 수집 및 이용 동의
          <TouchableOpacity
            onPress={() => handleDetailPress("개인정보 수집 및 이용 동의")}
          >
            <Text style={styles.detailText}>자세히</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (allTermsAgreed) {
            handleNext();
          }
        }}
        style={[
          styles.nextBtn,
          !allTermsAgreed && { backgroundColor: "#E3E3E3" },
        ]}
        disabled={!allTermsAgreed}
      >
        <Text style={styles.nextBtnText}>다음</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitle}>
              <Text style={styles.modalTitleText}>{modalTitle}</Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.modalIcon}
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <Path
                    d="M16.6418 14.9244C16.8699 15.1524 16.998 15.4617 16.998 15.7841C16.998 16.1066 16.8699 16.4159 16.6418 16.6439C16.4138 16.8719 16.1045 17 15.782 17C15.4595 17 15.1503 16.8719 14.9222 16.6439L8.5 10.22L2.07575 16.6419C1.84772 16.8699 1.53843 16.998 1.21595 16.998C0.893457 16.998 0.584177 16.8699 0.356142 16.6419C0.128108 16.4138 3.39797e-09 16.1046 0 15.7821C-3.39797e-09 15.4596 0.128108 15.1504 0.356142 14.9224L6.78039 8.50051L0.358165 2.07664C0.130131 1.84862 0.00202311 1.53935 0.00202311 1.21688C0.00202312 0.894415 0.130131 0.585153 0.358165 0.357133C0.586199 0.129112 0.89548 0.00101131 1.21797 0.0010113C1.54046 0.0010113 1.84974 0.129112 2.07777 0.357133L8.5 6.781L14.9242 0.356121C15.1523 0.1281 15.4616 -5.37235e-09 15.7841 0C16.1065 5.37235e-09 16.4158 0.1281 16.6439 0.356121C16.8719 0.584141 17 0.893404 17 1.21587C17 1.53834 16.8719 1.84761 16.6439 2.07563L10.2196 8.50051L16.6418 14.9244Z"
                    fill="#545454"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChildSignup;

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  lineContainer: {
    marginTop: 50,
    flexDirection: "row",
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
  agree: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 42,
    marginBottom: 28,
  },
  radioButton: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    borderWidth: 2,
    borderColor: "#6369D4",
    justifyContent: "center",
    alignItems: "center",
  },
  agreeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 9,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 16,
    marginLeft: 40,
  },
  text: {
    fontSize: 15,
    marginLeft: 11,
  },
  detailText: {
    textDecorationLine: "underline",
    marginLeft: 5,
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
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 350,
    height: 600,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modalTitle: {
    width: 350,
    height: 80,
    backgroundColor: "#6369D4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modalTitleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  modalIcon: {
    position: "absolute",
    right: 24,
  },
});
