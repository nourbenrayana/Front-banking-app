import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import config from '../utils/config';
import { useTranslation } from 'react-i18next';

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
  isReceived: boolean;
};

const useDestinataires = (transactions: Transaction[]) => {
  const [destinataires, setDestinataires] = useState<Record<string, string>>({});
  const { t } = useTranslation('transactionHistory');

  useEffect(() => {
    const fetchNames = async () => {
      const uniqueIds = new Set<string>();

      transactions.forEach(tx => {
        if (tx.compteDestinataire) uniqueIds.add(tx.compteDestinataire.replace('comptes/', ''));
        if (tx.compteExpediteur) uniqueIds.add(tx.compteExpediteur.replace('comptes/', ''));
      });

      const namesMap: Record<string, string> = {};

      await Promise.all(Array.from(uniqueIds).map(async (id) => {
        try {
          const compteRes = await fetch(`${config.BASE_URL}/api/comptes/${id}`);
          const compteData = await compteRes.json();

          if (compteData.userId) {
            const userId = compteData.userId.replace('users/', '');
            const userRes = await fetch(`${config.BASE_URL}/api/users/${userId}`);
            const userData = await userRes.json();
            namesMap[`comptes/${id}`] = userData.fullName || userData.nom || t('transactions.unknown');
          }
        } catch (e) {
          console.error(`Error fetching user for account ${id}`, e);
          namesMap[`comptes/${id}`] = t('transactions.unknown');
        }
      }));

      setDestinataires(namesMap);
    };

    if (transactions.length > 0) fetchNames();
  }, [transactions, t]);

  return destinataires;
};

const TransactionHistoryScreen = () => {
  const { t } = useTranslation('transactionHistory');
  const params = useLocalSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const compteId = (params.compteId as string) || 'default-compte-id';
  const destinataires = useDestinataires(transactions);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const cleanId = compteId.replace('comptes/', '');
        const res = await fetch(`${config.BASE_URL}/api/transactions/compte/${cleanId}`);
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [compteId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('transactions.today');
    if (date.toDateString() === yesterday.toDateString()) return t('transactions.yesterday');

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const groupTransactions = () => {
    const grouped: { [date: string]: TransactionItem[] } = {};
    const normalizeCompteId = (id: string = '') => id.replace('comptes/', '');

    transactions.forEach((tx) => {
      if (selectedFilter !== 'all') {
        const isReceived = normalizeCompteId(tx.compteDestinataire) === normalizeCompteId(compteId);
        if ((selectedFilter === 'incoming' && !isReceived) ||
            (selectedFilter === 'outgoing' && isReceived)) {
          return;
        }
      }

      const date = formatDate(tx.date);
      if (!grouped[date]) grouped[date] = [];

      const isReceived = normalizeCompteId(tx.compteDestinataire) === normalizeCompteId(compteId);

      const sender = tx.compteExpediteur || '';
      const recipient = tx.compteDestinataire || '';

      const senderName = destinataires[sender] || t('transactions.unknown');
      const recipientName = destinataires[recipient] || t('transactions.unknown');

      let icon: keyof typeof MaterialIcons.glyphMap = 'account-balance';
      let title = t('header.title');
      let description = '';

      if (tx.typeTransaction === 'Payment') {
        title = isReceived ? t('transactions.paymentReceived') : t('transactions.paymentSent');
        icon = isReceived ? 'call-received' : 'call-made';
        description = isReceived
          ? `${t('transactions.from')} ${senderName}`
          : `${t('transactions.to')} ${recipientName}`;
      } else if (tx.typeTransaction === 'Deposit') {
        title = t('transactions.deposit');
        icon = 'account-balance-wallet';
        description = `${t('transactions.from')} ${senderName}`;
      } else if (tx.typeTransaction === 'Withdrawal') {
        title = t('transactions.withdrawal');
        icon = 'money-off';
        description = `${t('transactions.to')} ${recipientName}`;
      }

      const time = new Date(tx.date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      grouped[date].push({
        type: tx.typeTransaction,
        title,
        description,
        time,
        amount: tx.montant,
        icon,
        isReceived,
      });
    });

    return Object.entries(grouped).map(([date, items]) => ({
      id: date,
      date,
      items,
    }));
  };

  const groupedTransactions = groupTransactions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <FontAwesome name="history" size={24} color="#fff" style={{ marginRight: 12 }} />
          <Text style={styles.headerTitle}>{t('header.title')}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {['all', 'incoming', 'outgoing'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.activeFilter]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
              {t(`header.filters.${filter}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="account-balance-wallet" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>{t('empty.title')}</Text>
          <Text style={styles.emptySubtext}>{t('empty.subtitle')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {groupedTransactions.map((group) => (
            <View key={group.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.date}</Text>
              {group.items.map((item, index) => (
                <TouchableOpacity key={`${group.id}-${index}`} style={styles.transactionCard}>
                  <View style={[
                    styles.transactionIcon,
                    item.isReceived ? styles.receivedIcon : styles.sentIcon
                  ]}>
                    <MaterialIcons
                      name={item.icon}
                      size={20}
                      color={item.isReceived ? '#10B981' : '#EF4444'}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionDesc}>{item.description}</Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text style={[
                      styles.transactionAmount,
                      item.isReceived ? styles.positiveAmount : styles.negativeAmount,
                    ]}>
                      {item.isReceived ? '+' : '-'}{item.amount.toFixed(2)}€
                    </Text>
                    <Text style={styles.transactionTime}>{item.time}</Text>
                  </View>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#2E86DE',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#2E86DE',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  receivedIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  sentIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDesc: {
    fontSize: 13,
    color: '#6B7280',
    flexShrink: 1,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  positiveAmount: {
    color: '#10B981',
  },
  negativeAmount: {
    color: '#EF4444',
  },
  transactionTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TransactionHistoryScreen;