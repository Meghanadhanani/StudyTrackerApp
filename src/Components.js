import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Components = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate days for the entire year
  const generateYearDays = (year) => {
    const days = [];
    let currentDate = new Date(year, 0, 1); // Start from January 1st

    while (currentDate.getFullYear() === year) {
      const dayOfWeek = daysOfWeek[currentDate.getDay()];
      const dayOfMonth = currentDate.getDate();

      days.push({
        day: dayOfWeek,
        date: dayOfMonth,
        id: currentDate.toDateString(),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const [selectedDay, setSelectedDay] = useState(null); // State for the selected day
  const yearDays = generateYearDays(new Date().getFullYear()); // Generate days for the current year

  // Reset selectedDay to today's date whenever the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const today = new Date();
      const todayObject = {
        day: daysOfWeek[today.getDay()],
        date: today.getDate(),
        id: today.toDateString(),
      };

      setSelectedDay(todayObject); // Reset to today's date
    }, [])
  );

  // Function to handle day selection
  const handleDaySelect = (day) => {
    setSelectedDay(day); // Update the selected day
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollcon}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {yearDays.map((day, index) => (
          <View
            key={index}
            style={[
              styles.dayCard,
              selectedDay?.id === day.id
                ? styles.selectedDay
                : styles.unselectedDay,
            ]}
            onTouchEnd={() => handleDaySelect(day)} // Update selected day on touch
          >
            <Text
              style={[
                styles.dayText,
                selectedDay?.id === day.id && styles.selectedText,
              ]}
            >
              {day.day}
            </Text>
            <Text
              style={[
                styles.dateText,
                selectedDay?.id === day.id && styles.selectedText,
              ]}
            >
              {day.date}
            </Text>
          </View>
        ))}
      </ScrollView>
      </View>
      <View style={styles.plusCon}>
        {/* <Text style={{color:"#bb9679"}}>Hello</Text> */}
        <Icon name="plus" color="white" size={25} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E9E5', // Light warm beige
    padding: 10,
    position: "relative",
  },
  scrollcon: {
    backgroundColor: '#F1E9E5', // Same as container for consistency
    justifyContent: 'center',
    padding: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  dayCard: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginRight: 10,
  },
  selectedDay: {
    backgroundColor: '#BB9679', // Warm beige for selected day
  },
  unselectedDay: {
    backgroundColor: '#E0CBBE', // Light beige for unselected day
  },
  dayText: {
    color: '#8B5E4D', // Muted brown for day text
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#121212', // Same as dayText for unselected days
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFF', // White for selected day text
  },
  plusCon: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: '#BB9679', // Highlight red for the plus button
    padding: 15,
    borderRadius: 10,
  },
});


export default Components;
