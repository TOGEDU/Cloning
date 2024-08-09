import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'; 
import BASE_URL from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const diaryImg = require("../assets/diaryListImg.png");

const DiaryList = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        const year = 2024; 
        const month = 6; 
        const response = await axios.get(`${BASE_URL}/api/home/calendar`, {
          params: { year, month },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = response.data;
        const marked = {};

        data.forEach(item => {
          if (item.diary) {
            marked[item.date] = {
              marked: true,
              dotColor: 'yellow',
              activeOpacity: 0
            };
          }
        });

        setMarkedDates(marked);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMarkedDates = () => {
    const today = new Date().toISOString().split("T")[0];
    let markedDates = {
      [today]: {
        marked: true,
      },
    };

    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        customStyles: {
          container: styles.selectedContainer,
          text: styles.selectedText,
        },
      };
    }

    return { ...markedDates, ...markedDates };
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
            console.log(month);
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
