import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PaymentChoiceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Titre avec style */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Payment Options</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* Carte pour le paiement de facture */}
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push("/paimentdefacture")}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, styles.billIcon]}>
            <Ionicons name="document-text" size={28} color="white" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Pay a Bill</Text>
            <Text style={styles.cardSubtitle}>Electricity bills, water, etc.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#a0aec0" />
        </View>
      </TouchableOpacity>

      {/* Carte pour le scan QR Code */}
      <TouchableOpacity 
        style={styles.card}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, styles.qrIcon]}>
            <Ionicons name="qr-code" size={28} color="white" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>QR Code Scanner</Text>
            <Text style={styles.cardSubtitle}>Fast payment via QR</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#a0aec0" />
        </View>
      </TouchableOpacity>

      {/* Décoration en vague */}
      <View style={styles.waveDecoration} />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    paddingTop: 48,
  },
  titleContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E86DE',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  titleUnderline: {
    height: 3,
    width: 100,
    backgroundColor: '#2E86DE',
    alignSelf: 'center',
    marginTop: 8,
    borderRadius: 2,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billIcon: {
    backgroundColor: '#2E86DE',
  },
  qrIcon: {
    backgroundColor: '#2E86DE',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  waveDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#2E86DE',
    opacity: 0.15,
    zIndex: -1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});