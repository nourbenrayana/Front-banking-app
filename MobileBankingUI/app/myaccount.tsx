import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

// Informations fixes de la banque
const bankInfo = {
  bankName: 'CaixaBank, S.A.',
  branch: 'Main Branch',
  clientSince: '15/02/2018',
  status: 'Active',
  website: 'https://www.caixabank.com'
};

export default function MyAccountScreen() {
  const [loading, setLoading] = useState(false); // Maintenant inutile mais gardé pour structure
  const { userData, accountData } = useUser();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading bank data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Account</Text>
      </View>

      {/* User Info */}
      <View style={styles.card}>
        <Text style={styles.userName}>{userData.fullName}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Account Number</Text>
            <Text style={styles.infoValue}>{accountData.accountNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Balance</Text>
            <Text style={[styles.infoValue, styles.balance]}>
              {Number(accountData.balance).toFixed(2)} €
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Account Type</Text>
            <Text style={styles.infoValue}>{accountData.accountType}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Currency</Text>
            <Text style={styles.infoValue}>{accountData.currency}</Text>
          </View>
        </View>
      </View>

      {/* Bank Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bank Information</Text>

        <View style={styles.detailItem}>
          <Ionicons name="business" size={18} color="#1E90FF" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Bank</Text>
            <Text style={styles.detailValue}>{bankInfo.bankName}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="location" size={18} color="#1E90FF" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Branch</Text>
            <Text style={styles.detailValue}>{bankInfo.branch}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={18} color="#1E90FF" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Client Since</Text>
            <Text style={styles.detailValue}>{bankInfo.clientSince}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.detailItem}
          onPress={() => Linking.openURL(bankInfo.website)}
        >
          <Ionicons name="globe-outline" size={18} color="#1E90FF" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Website</Text>
            <Text style={[styles.detailValue, { color: '#1E90FF', textDecorationLine: 'underline' }]}>
              {bankInfo.website.replace('https://', '')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Account Status */}
      <View style={[styles.card, styles.statusCard]}>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={18} color="#FFF" />
          <Text style={styles.statusText}>{bankInfo.status}</Text>
        </View>
        <Text style={styles.statusMessage}>Your account is in good standing and active</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
  loadingText: {
    marginTop: 20,
    color: '#1E90FF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#5A7EBC',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight:'500',
    color: '#000000',
  },
  balance: {
    fontSize: 16,
    fontWeight:'500',
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#5A7EBC',
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 3,
  },
  statusCard: {
    backgroundColor: '#E1ECFF',
    borderLeftWidth: 4,
    borderLeftColor: '#1E90FF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  statusText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  statusMessage: {
    color: '#2C3E50',
    fontSize: 15,
  },
});