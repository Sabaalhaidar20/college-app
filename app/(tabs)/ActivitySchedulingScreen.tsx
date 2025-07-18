import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, date?: Date) => {
    setShowPicker(Platform.OS === "ios"); // keep open on iOS
    if (date) setSelectedDate(date);
  };

  const handleSchedule = () => {
    alert(`Meeting scheduled on ${selectedDate.toDateString()}`);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Group: Study Squad</Text>

        <Text style={{ marginTop: 20, fontSize: 16 }}>
          Selected Date: {selectedDate.toDateString()}
        </Text>

        <TouchableOpacity
          style={[styles.loginButton, { marginTop: 20 }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.loginButtonText}>Choose Date</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity
          style={[styles.loginButton, { marginTop: 30 }]}
          onPress={handleSchedule}
        >
          <Text style={styles.loginButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
