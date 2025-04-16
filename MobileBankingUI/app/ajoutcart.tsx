import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AddCardScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Card</Text>
          <Text style={styles.headerSubtitle}>
            To add a new card, please fill out the fields below carefully in order to add card successfully.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Card Number */}
          <Text style={styles.label}>Card Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="0931-5131-5321-6477"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          {/* Holder's Name */}
          <Text style={styles.label}>Holder's Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="William Smith"
              placeholderTextColor="#999"
            />
          </View>

          {/* Expiry Date and CVV */}
          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Expiry Date</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="11/25"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>CVV</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="8824"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button avec le nouveau style */}
      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E86DE',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6E7B8F',
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#6E7B8F',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#0A0F24',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  // Nouveau style du bouton
  nextButton: {
    backgroundColor: '#2E86DE',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddCardScreen;