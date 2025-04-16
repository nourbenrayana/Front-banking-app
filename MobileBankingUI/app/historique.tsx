import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Définir uniquement les noms d'icônes autorisés
type MaterialIconName =
  | 'shopping-cart'
  | 'account-balance'
  | 'restaurant'
  | 'directions-car'
  | 'work'
  | 'receipt';

type TransactionItem = {
  type: string;
  title: string;
  description: string;
  time: string;
  amount: number;
  icon: MaterialIconName;
};

type TransactionGroup = {
  id: string;
  date: string;
  items: TransactionItem[];
};

const TransactionHistoryScreen = () => {
  const transactions: TransactionGroup[] = [
    {
      id: '1',
      date: 'Aujourd\'hui',
      items: [
        {
          type: 'shopping',
          title: 'Amazon Market',
          description: 'Achat en ligne',
          time: '14:45',
          amount: -42.99,
          icon: 'shopping-cart',
        },
        {
          type: 'transfer',
          title: 'Virement reçu',
          description: 'De: Marie Dupont',
          time: '09:30',
          amount: 150.0,
          icon: 'account-balance',
        },
      ],
    },
    {
      id: '2',
      date: 'Hier',
      items: [
        {
          type: 'food',
          title: 'Restaurant Chez Paul',
          description: 'Déjeuner',
          time: '12:30',
          amount: -28.5,
          icon: 'restaurant',
        },
        {
          type: 'transport',
          title: 'Uber',
          description: 'Trajet travail',
          time: '08:15',
          amount: -12.75,
          icon: 'directions-car',
        },
      ],
    },
    {
      id: '3',
      date: '12 Mai 2023',
      items: [
        {
          type: 'salary',
          title: 'Salaire',
          description: 'Compagnie XYZ',
          time: '00:00',
          amount: 2450.0,
          icon: 'work',
        },
        {
          type: 'bill',
          title: 'Facture EDF',
          description: 'Paiement mensuel',
          time: '00:00',
          amount: -85.3,
          icon: 'receipt',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique des transactions</Text>
        <TouchableOpacity>
          <MaterialIcons name="filter-list" size={24} color="#2E86DE" />
        </TouchableOpacity>
      </View>

      {/* Liste des transactions */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {transactions.map((group) => (
          <View key={group.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.date}</Text>

            {group.items.map((item, index) => (
              <TouchableOpacity key={index} style={styles.transactionCard}>
                <View style={styles.transactionIcon}>
                  <MaterialIcons name={item.icon} size={24} color="#2E86DE" />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionDesc}>{item.description}</Text>
                  <Text style={styles.transactionTime}>{item.time}</Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    item.amount > 0 ? styles.positiveAmount : styles.negativeAmount,
                  ]}
                >
                  {item.amount > 0 ? '+' : ''}
                  {item.amount.toFixed(2)}€
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E86DE',
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86DE',
    marginBottom: 10,
    marginLeft: 5,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#2E86DE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 134, 222, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A3A',
    marginBottom: 3,
  },
  transactionDesc: {
    fontSize: 13,
    color: '#6C7A8A',
    marginBottom: 3,
  },
  transactionTime: {
    fontSize: 12,
    color: '#6C7A8A',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  positiveAmount: {
    color: '#2ECC71',
  },
  negativeAmount: {
    color: '#E74C3C',
  },
});

export default TransactionHistoryScreen;