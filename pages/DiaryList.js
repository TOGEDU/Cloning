import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const diaryImg = require("../assets/diaryListImg.png");

const DiaryList = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchDiaryDates = async (year, month) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Retrieved Token:", token);

      const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;

      console.log("Authorization Header:", `Bearer ${token}`);

      const response = await axios.get(`${BASE_URL}/api/diary/calendar`, {
        params: { month: formattedMonth },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response Data:", response.data);

      const data = response.data.dateList || [];
      const marked = {};

      if (data.length > 0) {
        data.forEach((item) => {
          if (item.count > 0) {
            marked[item.date] = {
              marked: true,
              dotColor: "yellow",
              activeOpacity: 0,
            };
          }
        });
      } else {
        console.log("No diary entries for this month.");
      }

      setMarkedDates(marked);
      console.log("Marked Dates:", marked);
    } catch (error) {
      // console.error("Error fetching data:", error);
      // console.error("Error response:", error.response?.data);
      // console.error("Error status:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    fetchDiaryDates(year, month);
  }, []);

  const getMarkedDates = () => {
    const today = new Date().toISOString().split("T")[0];

    const customMarkedDates = {
      ...markedDates,
      [today]: {
        marked: true,
        dotColor: "red",
      },
    };

    if (selectedDate) {
      customMarkedDates[selectedDate] = {
        ...customMarkedDates[selectedDate],
        selected: true,
        customStyles: {
          container: styles.selectedContainer,
          text: styles.selectedText,
        },
      };
    }

    return customMarkedDates;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>날짜를 눌러 {"\n"}일기를 확인해 보세요</Text>
      <Image style={styles.img} source={diaryImg} />
      <View style={styles.bottomContainer}>
        <Calendar
          style={styles.calendar}
          theme={{
            todayTextColor: "black",
            textDayFontSize: 20,
            textDayFontWeight: "bold",
            textMonthFontSize: 20,
            textMonthFontWeight: "bold",
            textSectionTitleColor: "rgba(138, 138, 138, 1)",
          }}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            navigation.navigate("Diary", { date: day.dateString });
          }}
          hideExtraDays={true}
          monthFormat={"M월"}
          onMonthChange={(month) => {
            const year = month.year;
            const newMonth = month.month;
            fetchDiaryDates(year, newMonth);
          }}
          renderArrow={(direction) =>
            direction === "left" ? (
              <Icon name="chevron-left" size={20} color="black" />
            ) : (
              <Icon name="chevron-right" size={20} color="black" />
            )
          }
          markingType={"custom"}
          markedDates={getMarkedDates()}
        />
      </View>
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
    fontFamily: "NotoSans900",
    alignSelf: "flex-start",
    marginLeft: 22,
  },
  img: {
    width: 165,
    height: 126,
    alignSelf: "flex-end",
    marginRight: 22,
    marginBottom: -19,
  },
  bottomContainer: {
    height: 500,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#fff",
    padding: 20,
  },
  calendar: {
    marginTop: 30,
    paddingBottom: 30,
  },
  selectedContainer: {
    backgroundColor: "#858AE8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "NotoSans",
    textAlign: "center",
  },
});
