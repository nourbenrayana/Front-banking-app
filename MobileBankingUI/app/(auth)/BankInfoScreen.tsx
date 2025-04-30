import React from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useUser } from '../../context/UserContext';
import config from '../../utils/config';
import { useTranslation } from 'react-i18next';

export default function BankInfoScreen() {
  const { t } = useTranslation("bankInfo");  
  const router = useRouter();
  const { userData, setAccountData } = useUser();

  const [bankAccount, setBankAccount] = React.useState({
    typeCompte: 'courant',
    solde: '',
    devise: 'USD'
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // Vérifie que l'utilisateur est bien connecté
  React.useEffect(() => {
    if (!userData?.userId) {
      Alert.alert(t('error'), t('error_login_first'));
      router.replace('/(auth)/welcome1');
    }
  }, [userData]);

  const handleSubmit = async () => {
    // Validation des champs
    const solde = parseFloat(bankAccount.solde);
    if (isNaN(solde)) {
      Alert.alert(t('error'), t('error_invalid_amount'));
      return;
    }
  
    if (solde < 0) {
      Alert.alert(t('error'), t('error_negative_balance'));
      return;
    }

    if (solde > 1000000) {
      Alert.alert(t('error'), t('error_amount_too_high'));
      return;
    }
  
    try {
      setIsLoading(true);
      // Ensure userId is properly formatted for RavenDB
      const formattedUserId = userData.userId.startsWith("users/") 
        ? userData.userId 
        : `users/${userData.userId}`;
  
      const response = await fetch(`${config.BASE_URL}/api/comptes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeCompte: bankAccount.typeCompte,
          solde: solde,
          userId: formattedUserId,
          devise: bankAccount.devise
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || t('error_generic'));
      }
  
      Alert.alert(t('success'), t('success_account_created'));
      setAccountData({
        accountId: data.compte?.id || '',
        balance: data.compte?.solde || solde,
        creditLimit: data.creditLimit || 0,
        accountNumber: data.compte?.numeroCompte || '',
        accountType: data.compte?.typeCompte || bankAccount.typeCompte,
        currency: data.compte?.devise || bankAccount.devise,
        cardNumber: data.cardNumber || '',
        expiryDate: data.expiryDate || '',
        cardType: data.cardType || 'Visa',
        status: data.compte?.statutCompte || 'active',
      });
      router.replace("/(auth)/SignupSuccessScreen");
    } catch (error) {
      console.error('Account creation error:', error);
      Alert.alert(t('error'), (error as Error).message || t('error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/lotties/Animation - 1744455149945.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>{t('welcome')}, {userData?.fullName || t('user')}</Text>
          <Text style={styles.userInfoSubText}>{t('complete_bank_info')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('account_type')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="wallet-outline" size={22} color="#2E86DE" style={styles.icon} />
            <Picker
              style={styles.picker}
              selectedValue={bankAccount.typeCompte}
              onValueChange={(value) =>
                setBankAccount(prev => ({ ...prev, typeCompte: value }))
              }
              dropdownIconColor="#2E86DE"
              accessibilityLabel={t('account_type')}
            >
              <Picker.Item label={t('current_account')} value="courant" />
              <Picker.Item label={t('savings_account')} value="epargne" />
              <Picker.Item label={t('checking_account')} value="checking" />
              <Picker.Item label={t('business_account')} value="business" />
            </Picker>
          </View>

          <Text style={styles.sectionTitle}>{t('initial_balance')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={22} color="#2E86DE" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={t('enter_amount')}
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              value={bankAccount.solde}
              onChangeText={(text) => {
                if (/^\d*\.?\d{0,2}?$/.test(text)) {
                  setBankAccount(prev => ({ ...prev, solde: text }));
                }
              }}
              accessibilityLabel={t('initial_balance')}
            />
          </View>

          <Text style={styles.sectionTitle}>{t('currency')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="logo-usd" size={22} color="#2E86DE" style={styles.icon} />
            <Picker
              style={styles.picker}
              selectedValue={bankAccount.devise}
              onValueChange={(value) =>
                setBankAccount(prev => ({ ...prev, devise: value }))
              }
              dropdownIconColor="#7C3AED"
              accessibilityLabel={t('currency')}
            >
              <Picker.Item label="USD ($)" value="USD" />
              <Picker.Item label="EUR (€)" value="EUR" />
              <Picker.Item label="TND (د.ت)" value="TND" />
              <Picker.Item label="XOF (CFA)" value="XOF" />
              <Picker.Item label="BRL (R$)" value="BRL" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isLoading}
          accessibilityLabel={t('complete_registration')}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>{t('complete_registration')}</Text>
              <Ionicons name="arrow-forward" size={22} color="white" />
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>{t('already_have_account')} </Text>
          <TouchableOpacity onPress={() => router.replace('../(auth)/login')}>
            <Text style={styles.loginLink}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 16,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  userInfoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  userInfoSubText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
    fontFamily: 'Inter_500Medium',
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  picker: {
    flex: 1,
    marginLeft: 12,
    color: '#1E293B',
    fontFamily: 'Inter_500Medium',
  },
  submitButton: {
    backgroundColor: '#2E86DE',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12
  },
  loginText: {
    color: '#475569',
    fontSize: 14
  },
  loginLink: {
    color: '#2E86DE',
    fontSize: 14,
    fontWeight: '600'
  }
});