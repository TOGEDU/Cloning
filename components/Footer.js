import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.backgroundShape} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
          >
            <Path
              d="M29.4615 15.4572V27.1225C29.4615 28.289 28.4407 29.3097 27.274 29.3097H22.899C21.7324 29.3097 20.7115 28.289 20.7115 27.1225V22.8938C20.7115 21.144 19.2532 19.6858 17.5032 19.6858C15.7532 19.6858 14.2949 21.144 14.2949 22.8938V27.1225C14.2949 28.289 13.2741 29.3097 12.1074 29.3097H7.73242C6.56576 29.3097 5.54492 28.289 5.54492 27.1225L5.54492 15.4572C5.54492 14.7281 5.83655 14.1448 6.41989 13.7074L16.3365 6.12495C17.0657 5.54168 18.2324 5.54168 18.9615 6.12495L28.8783 13.7074C29.1699 14.1448 29.4615 14.7281 29.4615 15.4572Z"
              fill="white"
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Achieve")}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="28"
            viewBox="0 0 26 28"
            fill="none"
          >
            <Path
              d="M1.08333 28C0.796016 28 0.520466 27.8946 0.317301 27.7071C0.114137 27.5196 0 27.2652 0 27V2.25812C7.75078e-05 1.99611 0.0745025 1.73869 0.215866 1.51149C0.357229 1.28428 0.560599 1.09522 0.805729 0.963125C1.625 0.52375 3.27573 0 6.5 0C9.01943 0 11.8374 0.919375 14.3237 1.73C16.3258 2.38313 18.2169 3 19.5 3C21.1517 2.99539 22.7859 2.68732 24.3073 2.09375C24.4926 2.02156 24.6943 1.99281 24.8945 2.01007C25.0948 2.02732 25.2873 2.09004 25.4549 2.19264C25.6224 2.29524 25.7599 2.43452 25.8551 2.59808C25.9502 2.76163 26 2.94437 26 3.13V16.84C25.9997 17.083 25.9227 17.3207 25.7784 17.5239C25.6341 17.7272 25.4288 17.8872 25.1875 17.9844C24.5978 18.2225 22.4446 19 19.5 19C17.8655 19 15.818 18.5538 13.6507 18.0806C11.2145 17.5494 8.69578 17 6.5 17C4.00359 17 2.72594 17.3487 2.16667 17.5694V27C2.16667 27.2652 2.05253 27.5196 1.84937 27.7071C1.6462 27.8946 1.37065 28 1.08333 28Z"
              fill="white"
              fillOpacity="0.6"
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("MyPage")}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
          >
            <Path
              d="M20.6278 16.7964C21.5224 16.7971 22.3802 17.1294 23.0125 17.7201C23.6448 18.3109 24 19.1119 24 19.947V21.2324C24 22.0348 23.7315 22.8171 23.232 23.4701C20.9128 26.5003 17.1266 28 11.9962 28C6.86293 28 3.07819 26.4989 0.765048 23.4687C0.267206 22.8162 -0.000226295 22.0349 1.43678e-07 21.2338V19.9456C0.000397674 19.1105 0.355969 18.3097 0.988576 17.7192C1.62118 17.1286 2.47907 16.7967 3.37371 16.7964H20.6278ZM11.9947 0C12.9797 -1.37007e-08 13.9551 0.181096 14.8651 0.53295C15.7751 0.884803 16.6019 1.40052 17.2984 2.05066C17.9949 2.7008 18.5473 3.47263 18.9243 4.32208C19.3012 5.17153 19.4952 6.08196 19.4952 7.0014C19.4952 7.92084 19.3012 8.83127 18.9243 9.68072C18.5473 10.5302 17.9949 11.302 17.2984 11.9521C16.6019 12.6023 15.7751 13.118 14.8651 13.4699C13.9551 13.8217 12.9797 14.0028 11.9947 14.0028C10.0055 14.0028 8.09773 13.2652 6.69112 11.9521C5.28451 10.6391 4.49428 8.85829 4.49428 7.0014C4.49428 5.14451 5.28451 3.36368 6.69112 2.05066C8.09773 0.737645 10.0055 0 11.9947 0Z"
              fill="white"
              fillOpacity="0.6"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    alignItems: "center",
  },
  backgroundShape: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    backgroundColor: "#6369D4",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ scaleX: 1.05 }],
  },
  backgroundSvg: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: 15,
  },
  iconButton: {
    padding: 10,
  },
});

export default Footer;
