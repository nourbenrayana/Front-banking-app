import { View, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { getExchangeRate } from "../../utils/api";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import LottieView from 'lottie-react-native';
import RNPickerSelect from 'react-native-picker-select';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';


const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'JPY', value: 'JPY' },
  { label: 'BRL', value: 'BRL' },
  { label: 'TND', value: 'TND' },
  { label: 'SEK', value: 'SEK' },
  { label: 'AUD', value: 'AUD' },
  { label: 'CAD', value: 'CAD' },

  // Ajoutez d'autres devises selon vos besoins
];

export default function ExchangeScreen() {
  const [base, setBase] = useState("TND");
  const [target, setTarget] = useState("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('exchange');

  const handleConvert = async () => {
    if (!base || !target) {
      Alert.alert("Erreur", "Veuillez sélectionner les devises");
      return;
    }
    
    setLoading(true);
    try {
      const data = await getExchangeRate(base.toUpperCase(), target.toUpperCase());
      setResult(data.rate);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Échec de la conversion.");
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setBase(target);
    setTarget(base);
    setResult(null);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
      <LottieView
        source={require('../../assets/lotties/Animation - 1744034491337.json')}
        autoPlay
        loop
        style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 20 }}
      />
        <Animated.Text entering={FadeIn.duration(1000)} style={styles.title}>
       {t("title")}
        </Animated.Text>
        
        <View style={styles.card}>
          {/* Base Currency */}
          <View style={styles.currencyContainer}>
            <Text style={styles.label}> {t("labels.from")}</Text>
            <RNPickerSelect
              onValueChange={(value) => setBase(value)}
              items={currencyOptions}
              value={base}
              style={pickerSelectStyles}
            />
          </View>
          
          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <MaterialIcons name="swap-vert" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Target Currency */}
          <View style={styles.currencyContainer}>
            <Text style={styles.label}>{t("labels.to")}</Text>
            <RNPickerSelect
              onValueChange={(value) => setTarget(value)}
              items={currencyOptions}
              value={target}
              style={pickerSelectStyles}
            />
          </View>
        </View>
        
        {/* Convert Button */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleConvert}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t('buttonLoading') : t('button')}
          </Text>
        </TouchableOpacity>
        
        {/* Result */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              1 {base.toUpperCase()} = 
            </Text>
            <Text style={styles.resultValue}>
              {result.toFixed(4)} {target.toUpperCase()}
            </Text>
            
            <View style={styles.rateTrend}>
              <MaterialIcons 
                name={result > 1 ? "trending-up" : "trending-down"} 
                size={28} 
                color={result > 1 ? Colors.light.success : Colors.light.warning} 
              />
            </View>
          </View>
        )}
        
        {/* Info */}
        <Text style={styles.infoText}>
      {t('info')}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold", // équivalent à "700" mais plus lisible
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: 32,
    letterSpacing: 1, // espacement entre les lettres pour un effet plus aéré
    textTransform: "uppercase", // tout en majuscules pour un effet "branding"
    fontFamily: "System", // ou une font personnalisée si tu en as une (ex: 'Poppins-Bold')
  },
  
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  currencyContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.light.secondary,
    marginBottom: 8,
    fontWeight: "500", // "500" est également valide
  },
  swapButton: {
    backgroundColor: Colors.light.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 8,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600", // "600" est valide
  },
  resultContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
  },
  resultText: {
    fontSize: 18,
    color: Colors.light.secondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: "700", // "700" est valide
    color: Colors.light.primary,
    marginBottom: 8,
  },
  rateTrend: {
    marginTop: 8,
  },
  infoText: {
    textAlign: "center",
    color: Colors.light.secondaryText,
    fontSize: 14,
    marginTop: 16,
  },
});

// Styles for the picker
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: Colors.light.inputBackground,
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600' as '600', // Type assertion or use the numeric value 600
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
  },
  inputAndroid: {
    backgroundColor: Colors.light.inputBackground,
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600' as '600', // Type assertion or use the numeric value 600
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
  },
});
