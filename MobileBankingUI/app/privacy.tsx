import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicy() {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Introduction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          We are committed to protecting your privacy. This policy explains how
          we collect, use, and safeguard your information when you use our
          application.
        </Text>
      </View>

      {/* Data Collection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Data We Collect</Text>
        <View style={styles.listItem}>
          <Ionicons name="ellipse" size={8} color="#3498db" style={styles.bullet} />
          <Text style={styles.text}>Personal identification (name, email, phone)</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="ellipse" size={8} color="#3498db" style={styles.bullet} />
          <Text style={styles.text}>Device information (model, OS version)</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="ellipse" size={8} color="#3498db" style={styles.bullet} />
          <Text style={styles.text}>Usage data (app interactions, features used)</Text>
        </View>
      </View>

      {/* Use of Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Use of Your Data</Text>
        <Text style={styles.text}>We use the information we collect to:</Text>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Provide and maintain our service</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Improve user experience</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Ensure application security</Text>
        </View>
      </View>

      {/* Data Sharing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>
          We do not sell your personal data. We may share information with:
        </Text>
        <View style={styles.listItem}>
          <Ionicons name="business" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Service providers (for app functionality)</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="shield" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Legal authorities (when required by law)</Text>
        </View>
      </View>

      {/* User Rights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.text}>You have the right to:</Text>
        <View style={styles.listItem}>
          <Ionicons name="create" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Access and update your information</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="trash" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Request deletion of your data</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="download" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>Export your data</Text>
        </View>
      </View>

     

      {/* Consent Box */}
      <View style={styles.consentBox}>
        <Text style={styles.consentText}>
          By using our application, you consent to our Privacy Policy.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Important pour voir le dernier élément
  },
  header: {
    marginBottom: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#3498db',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: "#34495e",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bullet: {
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  contactText: {
    marginLeft: 10,
    color: "#3498db",
    fontSize: 15,
  },
  consentBox: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#90caf9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  consentText: {
    fontSize: 14,
    color: "#1976d2",
    textAlign: "center",
    fontStyle: "italic",
  },
});
