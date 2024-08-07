import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Svg, { Path } from "react-native-svg";

const images = {
  월: require("../assets/mon.png"),
  화: require("../assets/tue.png"),
  수: require("../assets/wed.png"),
  목: require("../assets/thu.png"),
  금: require("../assets/fri.png"),
  토: require("../assets/sat.png"),
  일: require("../assets/sun.png"),
};

const days = ["월", "화", "수", "목", "금", "토", "일"];

const Achieve = () => {
  const data = {
    // 임시 데이터
    월: { diary: true, question: true },
    화: { diary: false, question: true },
    수: { diary: true, question: false },
    목: { diary: true, question: true },
    금: { diary: false, question: false },
    토: { diary: true, question: true },
    일: { diary: true, question: true },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.t1}>기록현황을{"\n"}확인해 보세요</Text>
      <Text style={styles.t2}>
        육아일기와 오늘의 질문을 모두 작성하면{"\n"}배지를 획득할 수 있습니다
      </Text>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="365"
        height="285"
        viewBox="0 0 365 285"
        fill="none"
        style={styles.svg}
      >
        <Path
          d="M81.7344 3.99943H277.735C277.735 3.99943 338.532 3.00185 356.734 54.5004C374.937 105.999 324.235 141.999 324.235 141.999H35.2344C35.2344 141.999 -7.94623 181.999 7.23479 231.499C22.4158 280.999 81.7344 280.999 81.7344 280.999H277.735"
          stroke="#FBA38F"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.circleContainer}>
        {days.map((day, index) => (
          <View key={day} style={[styles.circle, styles[`circle${index}`]]}>
            {data[day].diary && data[day].question ? (
              <Image source={images[day]} style={styles.image} resizeMode="contain" />
            ) : (
              <View style={styles.emptyCircle} />
            )}
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Achieve;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 40,
    flex: 1,
  },
  t1: {
    fontSize: 30,
    fontWeight: "600",
    marginLeft: 33,
  },
  t2: {
    color: "#838383",
    fontSize: 15,
    marginLeft: 33,
    marginTop: 8,
  },
  svg: {
    position: "absolute",
    top: 254,
    left: 15,
  },
  circleContainer: {
    position: "relative",
    marginTop: 100,
    height: 400,
  },
  circle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    width: 89,
    height: 89,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 89,
    height: 89,
  },
  dayText: {
    marginTop: 5,
    color: "#838383",
  },
  circle0: {
    // 월
    top: -35,
    left: 50,
  },
  circle1: {
    // 화
    top: -35,
    right: 120,
  },
  circle2: {
    // 수
    top: 97,
    left: 252,
  },
  circle3: {
    // 목
    top: 97,
    right: 153,
  },
  circle4: {
    // 금
    top: 97,
    left: 40,
  },
  circle5: {
    // 토
    bottom: 55,
    right: 220,
  },
  circle6: {
    // 일
    bottom: 55,
    right: 90,
  },
});
