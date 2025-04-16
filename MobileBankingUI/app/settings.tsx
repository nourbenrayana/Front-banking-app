import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ Import router

type IconName =
  | "filter"
  | "notifications"
  | "location"
  | "settings"
  | "lock-closed"
  | "finger-print"
  | "language"
  | "moon"
  | "push"
  | "map"
  | "at"
  | "key"
  | "search"
  | "repeat"
  | "link"
  | "body";

type Settings = {
  faceId: boolean;
  fingerprint: boolean;
  notifications: boolean;
  location: boolean;
  darkMode: boolean;
};

export default function SettingsScreen() {
  const router = useRouter(); // ✅ Initialise router

  const [settings, setSettings] = useState<Settings>({
    faceId: true,
    fingerprint: true,
    notifications: true,
    location: false,
    darkMode: false,
  });

  const toggleSwitch = (setting: keyof Settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const settingsOptions = [
    {
      section: 'Security',
      data: [
        {
          icon: 'lock-closed' as IconName,
          name: 'Change PIN',
          action: () => router.push('/changercodepin'), // ✅ Redirection ici
          type: 'button',
        },
        {
          icon: 'lock-closed' as IconName,
          name: 'Face ID',
          value: settings.faceId,
          action: () => toggleSwitch('faceId'),
          type: 'switch',
        },
      ]
    },
    {
      section: 'Preferences',
      data: [
        {
          icon: 'language' as IconName,
          name: 'Language',
          value: 'English',
          action: () => console.log('Navigate to Language Settings'),
          type: 'button',
        },
        {
          icon: 'moon' as IconName,
          name: 'Dark Mode',
          value: settings.darkMode,
          action: () => toggleSwitch('darkMode'),
          type: 'switch',
        }
      ]
    },
    {
      section: 'Notifications',
      data: [
        {
          icon: 'notifications' as IconName,
          name: 'App Notifications',
          value: settings.notifications,
          action: () => toggleSwitch('notifications'),
          type: 'switch',
        },
        {
          icon: 'location' as IconName,
          name: 'Location Services',
          value: settings.location,
          action: () => toggleSwitch('location'),
          type: 'switch',
        }
      ]
    }
  ];

  return (
    <ScrollView style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <View style={styles.headerContainer}>
        <Ionicons 
          name="settings" 
          size={28} 
          color={settings.darkMode ? '#64B5F6' : '#1E90FF'} 
          style={{ marginRight: 10 }} 
        />
        <Text style={[styles.header, settings.darkMode && styles.darkHeader]}>
          Settings
        </Text>
      </View>

      {settingsOptions.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, settings.darkMode && styles.darkSectionHeader]}>
            {section.section}
          </Text>
          <View style={[styles.settingsContainer, settings.darkMode && styles.darkSettingsContainer]}>
            {section.data.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.settingItem}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={settings.darkMode ? '#64B5F6' : '#1E90FF'} 
                  />
                  <Text style={[styles.settingText, settings.darkMode && styles.darkSettingText]}>
                    {item.name}
                  </Text>
                  {item.type === 'button' && item.value && (
                    <Text style={[styles.settingValue, settings.darkMode && styles.darkSettingValue]}>
                      {item.value}
                    </Text>
                  )}
                </View>
                {item.type === 'switch' ? (
                  <Switch
                    trackColor={{ false: "#767577", true: settings.darkMode ? "#0D47A1" : "#1E90FF" }}
                    thumbColor={settings[item.name.toLowerCase().replace(' ', '') as keyof Settings] ? "#FFFFFF" : "#F4F3F4"}
                    ios_backgroundColor="#3E3E3E"
                    onValueChange={item.action}
                    value={item.value as boolean}
                  />
                ) : (
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={settings.darkMode ? '#757575' : '#95a5a6'} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    marginBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E90FF',
  },
  darkHeader: {
    color: '#64B5F6',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 8,
    paddingHorizontal: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  darkSectionHeader: {
    color: '#9E9E9E',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  darkSettingsContainer: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  darkSettingItem: {
    borderBottomColor: '#333333',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 16,
    flex: 1,
  },
  darkSettingText: {
    color: '#E0E0E0',
  },
  settingValue: {
    fontSize: 14,
    color: '#7F8C8D',
    marginRight: 8,
  },
  darkSettingValue: {
    color: '#9E9E9E',
  },
});
