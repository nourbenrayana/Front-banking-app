import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import config from '../utils/config';

type Transaction = {
  _id: string;
  date: string;
  typeTransaction: string;
  compteExpediteur?: string;
  compteDestinataire?: string;
  montant: number;
  destinataireNom?: string;
};

type TransactionItem = {
  type: string;
  title: string;
  description: string;
  time: string;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const TransactionHistoryScreen = () => {
  const params = useLocalSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const compteId = params.compteId as string || 'default-compte-id';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const id = typeof compteId === 'string' ? compteId : '';
        console.log('🔍 compteId utilisé dans la requête :', id);
        if (!id) {
          console.warn('ID du compte non fourni');
          return;
        }
  
        const cleanId = id.replace('comptes/', ''); // Enlève "comptes/" s'il est là
        const response = await fetch(`${config.BASE_URL}/api/transactions/compte/${cleanId}`);

        console.log('📥 Réponse brute :', response);
        const text = await response.text();
        console.log('📄 Contenu brut :', text);

        let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error('❌ Erreur de parsing JSON:', e);
            return;
          }

  
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.warn('Réponse inattendue :', data);
          setTransactions([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, [compteId]);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const groupTransactions = () => {
    const grouped: { [date: string]: TransactionItem[] } = {};
  
    transactions.forEach((tx) => {
      const date = formatDate(tx.date);
      if (!grouped[date]) grouped[date] = [];
  
      const isReceived =
        tx.compteDestinataire === `comptes/${compteId}` ||
        tx.compteDestinataire === compteId;
  
      grouped[date].push({
        type: tx.typeTransaction,
        title:
          tx.typeTransaction === 'Virement'
            ? isReceived
              ? 'Virement reçu'
              : 'Virement envoyé'
            : 'Transaction',
        description:
          tx.typeTransaction === 'Virement'
            ? `${isReceived ? '←' : '→'} ${tx.destinataireNom || tx.compteDestinataire}`
            : 'Transaction',
        time: new Date(tx.date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: isReceived ? tx.montant : -tx.montant,
        icon: 'account-balance',
      });
    });
  
    return Object.entries(grouped).map(([date, items], index) => ({
      id: index.toString(),
      date,
      items,
    }));
  };
  
  const groupedTransactions = groupTransactions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique des transactions</Text>
        <TouchableOpacity>
          <MaterialIcons name="filter-list" size={24} color="#2E86DE" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E86DE" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {groupedTransactions.map((group) => (
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
      )}
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