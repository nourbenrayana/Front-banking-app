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
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation('privacy');
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.subtitle}>
        {t('lastUpdated')}: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Introduction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('sections.introduction.title')}</Text>
        <Text style={styles.text}>{t('sections.introduction.content')}
        </Text>
      </View>

      {/* Data Collection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('sections.dataCollection.title')}</Text>
        <View style={styles.listItem}>
          <Ionicons name="ellipse" size={8} color="#3498db" style={styles.bullet} />
          <Text style={styles.text}>{t('sections.dataCollection.items1')}</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="ellipse" size={8} color="#3498db" style={styles.bullet} />
          <Text style={styles.text}>{t('sections.dataCollection.items2')}</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="ellipse" size={8} color="#3498db" style={styles.bullet} />
          <Text style={styles.text}>{t('sections.dataCollection.items3')}</Text>
        </View>
      </View>

      {/* Use of Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('sections.dataUse.title')}</Text>
        <Text style={styles.text}>{t('sections.dataUse.content')}</Text>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>{t('sections.dataUse.items1')}</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>{t('sections.dataUse.items2')}</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>{t('sections.dataUse.items3')}</Text>
        </View>
      </View>

      {/* Data Sharing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('sections.dataSharing.title')}</Text>
        <Text style={styles.text}>{t('sections.dataSharing.content')} </Text>
        <View style={styles.listItem}>
          <Ionicons name="business" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}> {t('sections.dataSharing.items1')}</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="shield" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}> {t('sections.dataSharing.items2')}</Text>
        </View>
      </View>

      {/* User Rights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('sections.userRights.title')}</Text>
        <Text style={styles.text}>{t('sections.userRights.content')}:</Text>
        <View style={styles.listItem}>
          <Ionicons name="create" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>{t('sections.userRights.items1')}</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="trash" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>{t('sections.userRights.items2')}</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="download" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.text}>{t('sections.userRights.items3')}</Text>
        </View>
      </View>

     

      {/* Consent Box */}
      <View style={styles.consentBox}>
        <Text style={styles.consentText}>
        {t('sections.consent')}
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
