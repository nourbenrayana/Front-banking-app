import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

type IconName = 
  | "lock-closed" 
  | "finger-print"
  | "language"
  | "moon"
  | "notifications"
  | "location";

type Settings = {
  faceId: boolean;
  fingerprint: boolean;
  notifications: boolean;
  location: boolean;
  darkMode: boolean;
};

type SettingItem = {
  icon: IconName;
  name: string;
  action?: () => void;
  type: 'button' | 'switch' | 'custom';
  value?: boolean;
  component?: React.ReactNode;
};

type SettingSection = {
  title: string;
  data: SettingItem[];
};

const LanguageSelector = ({ darkMode }: { darkMode: boolean }) => {
  const { t, i18n } = useTranslation('settings');
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const languages = [
    { code: 'en', name: t('languageValue', { lng: 'en' }) },
    { code: 'fr', name: t('languageValue', { lng: 'fr' }) },
    { code: 'pt', name: t('languageValue', { lng: 'pt' }) }
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language)?.name;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLanguageOptions(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowLanguageOptions(!showLanguageOptions)}
        style={styles.languageSelector}
      >
        <Text style={[styles.languageText, darkMode && styles.darkLanguageText]}>
          {currentLanguage}
        </Text>
        <Ionicons
          name={showLanguageOptions ? "chevron-up" : "chevron-down"}
          size={20}
          color={darkMode ? '#9E9E9E' : '#666'}
        />
      </TouchableOpacity>

      {showLanguageOptions && (
        <View style={[styles.languageOptions, darkMode && styles.darkLanguageOptions]}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
              style={[
                styles.languageOption,
                darkMode && styles.darkLanguageOption,
                i18n.language === lang.code && (darkMode ? styles.darkSelectedLanguage : styles.selectedLanguage)
              ]}
            >
              <Text style={[styles.languageOptionText, darkMode && styles.darkLanguageOptionText]}>
                {lang.name}
              </Text>
              {i18n.language === lang.code && (
                <Ionicons name="checkmark" size={18} color={darkMode ? '#64B5F6' : '#1E90FF'} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation('settings');
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

  const settingsOptions: SettingSection[] = [
    {
      title: t('sections.security.title'),
      data: [
        {
          icon: 'lock-closed',
          name: t('sections.security.options.changePin'),
          action: () => router.push('/changercodepin'),
          type: 'button',
        },
        {
          icon: 'finger-print',
          name: t('sections.security.options.faceId'),
          value: settings.faceId,
          action: () => toggleSwitch('faceId'),
          type: 'switch',
        },
      ]
    },
    {
      title: t('sections.preferences.title'),
      data: [
        {
          icon: 'language',
          name: t('sections.preferences.options.language'),
          type: 'custom',
          component: <LanguageSelector darkMode={settings.darkMode} />,
        },
        {
          icon: 'moon',
          name: t('sections.preferences.options.darkMode'),
          value: settings.darkMode,
          action: () => toggleSwitch('darkMode'),
          type: 'switch',
        },
      ]
    },
    {
      title: t('sections.notifications.title'),
      data: [
        {
          icon: 'notifications',
          name: t('sections.notifications.options.appNotifications'),
          value: settings.notifications,
          action: () => toggleSwitch('notifications'),
          type: 'switch',
        },
        {
          icon: 'location',
          name: t('sections.notifications.options.locationServices'),
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
          {t('header')}
        </Text>
      </View>

      {settingsOptions.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, settings.darkMode && styles.darkSectionHeader]}>
            {section.title}
          </Text>
          <View style={[styles.settingsContainer, settings.darkMode && styles.darkSettingsContainer]}>
            {section.data.map((item, index) => (
              <View key={index}>
                {item.type === 'custom' && item.component ? (
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={settings.darkMode ? '#64B5F6' : '#1E90FF'}
                      />
                      <Text style={[styles.settingText, settings.darkMode && styles.darkSettingText]}>
                        {item.name}
                      </Text>
                    </View>
                    {item.component}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.settingItem, settings.darkMode && styles.darkSettingItem]}
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
                    </View>
                    {item.type === 'switch' ? (
                      <Switch
                        trackColor={{ false: "#767577", true: settings.darkMode ? "#0D47A1" : "#1E90FF" }}
                        thumbColor={item.value ? "#FFFFFF" : "#F4F3F4"}
                        ios_backgroundColor="#3E3E3E"
                        onValueChange={item.action}
                        value={item.value ?? false}
                      />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={settings.darkMode ? '#757575' : '#95a5a6'}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
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
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  languageText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  darkLanguageText: {
    color: '#E0E0E0',
  },
  languageOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  darkLanguageOptions: {
    backgroundColor: '#2D2D2D',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  darkLanguageOption: {
    borderBottomColor: '#333333',
  },
  selectedLanguage: {
    backgroundColor: '#F5F9FF',
  },
  darkSelectedLanguage: {
    backgroundColor: '#2A3A4A',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  darkLanguageOptionText: {
    color: '#E0E0E0',
  },
});