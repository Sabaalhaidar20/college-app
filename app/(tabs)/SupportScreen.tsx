import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles";

export default function SupportScreen() {
  const handleContact = () => {
    Alert.alert(
      "Contact Support",
      "You can reach us at: support@peermatch.com\n\nResponse time: within 24 hours."
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.screenTitle}>Support & Help Center</Text>

      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

      <View style={styles.faqCard}>
        <Text style={styles.faqQuestion}>How do I update my profile?</Text>
        <Text style={styles.faqAnswer}>
          Go to the Bio screen and tap “Edit” on the top-right. You can update
          your major, graduation year, interests, and hobbies.
        </Text>
      </View>

      <View style={styles.faqCard}>
        <Text style={styles.faqQuestion}>How can I schedule an Activity?</Text>
        <Text style={styles.faqAnswer}>
          Navigate to the Schedule screen, pick a date using the calendar, and
          tap “Schedule”.
        </Text>
      </View>

      <View style={styles.faqCard}>
        <Text style={styles.faqQuestion}>
          Why is my profile picture not saving?
        </Text>
        <Text style={styles.faqAnswer}>
          Currently, profile pictures are saved locally only. Future updates
          will support cloud sync.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Troubleshooting</Text>

      <View style={styles.faqCard}>
        <Text style={styles.faqQuestion}>App is not loading?</Text>
        <Text style={styles.faqAnswer}>
          Make sure you have an active internet connection. Try restarting the
          app or device.
        </Text>
      </View>

      <View style={styles.faqCard}>
        <Text style={styles.faqQuestion}>Not receiving notifications?</Text>
        <Text style={styles.faqAnswer}>
          Check your device notification settings and ensure permissions are
          granted for this app.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, { marginTop: 30 }]}
        onPress={handleContact}
      >
        <Text style={styles.loginButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
