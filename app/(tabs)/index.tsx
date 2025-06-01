import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import AnimatedCard from "../../components/AnimatedCard";
import config from "@/utils/config";
import ChatbotScreen from "../chatbot"; // Ajuste le chemin si besoin

interface Transaction {
  id: string;
  image: any;
  name: string;
  date: string;
  amount: number;
}

interface ActionProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  color?: string;
  onPress?: () => void;
}

interface TransactionItemProps {
  image: any;
  name: string;
  date: string;
  amount: string;
  positive?: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const { userData, accountData } = useUser();

  const { fullName } = userData || {};
  const { cardNumber, expiryDate, cardType, status, accountId } = accountData || {};

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!userData?.userId) return;

      try {
        const rawUserId = userData.userId.replace(/^users\//, "").replace(/^\/users\//, "");
        const res = await fetch(`${config.BASE_URL}/api/transactions/notifications/unread/count/${rawUserId}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
        setUnreadCount(0);
      }
    };
    fetchUnreadNotifications();
  }, [userData?.userId]);

  useEffect(() => {
    const fetchUserName = async (compteId: string): Promise<string> => {
      try {
        const cleanedId = compteId.replace(/^comptes\//, "");
        const resCompte = await fetch(`${config.BASE_URL}/api/comptes/${cleanedId}`);
        if (!resCompte.ok) return "Unknown";
        const compteData = await resCompte.json();
        const userId = (compteData.userId || compteData.ownerId || "").replace(/^users\//, "");

        const resUser = await fetch(`${config.BASE_URL}/api/users/${userId}`);
        if (!resUser.ok) return "Unknown";
        const userData = await resUser.json();

        return userData.fullName || userData.nom || "Unknown";
      } catch (error) {
        console.error("Error fetching user name:", error);
        return "Unknown";
      }
    };

    const fetchTransactions = async () => {
      if (!accountId) return;

      try {
        const cleanedAccountId = accountId.replace(/^comptes\//, "");
        const res = await fetch(`${config.BASE_URL}/api/transactions/compte/${cleanedAccountId}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const data = await res.json();

        const formatted = await Promise.all(
          data.map(async (tx: any) => {
            const isIncoming = tx.compteDestinataire?.includes(cleanedAccountId);
            const otherCompteId = isIncoming ? tx.compteExpediteur : tx.compteDestinataire;
            const name = await fetchUserName(otherCompteId);

            return {
              id: tx._id,
              image: require("../../assets/images/avatar1.jpg"),
              name,
              date: tx.date,
              amount: isIncoming ? tx.montant : -tx.montant,
            };
          })
        );

        setTransactions(formatted);
      } catch (err) {
        console.error("Error details:", err);
      }
    };

    fetchTransactions();
  }, [accountId]);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  const handleTransfer = () => {
    router.push("/Payment");
  };

  const handlePaymentChoice = () => {
    router.push("/choixdepaiment");
  };

  const handleRequest = () => {
  router.push("/contact");
};

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Hello, {fullName || "User"}!</Text>
            <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/NotificationScreen")}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* CARD */}
        <AnimatedCard
          holderName={fullName || "Card Holder"}
          cardNumber={cardNumber || "XXXX XXXX XXXX XXXX"}
          expiryDate={expiryDate || "MM/YY"}
          cardType={cardType || "VISA"}
          status={status || "inactive"}
          onTransfer={handleTransfer}
        />

        {/* QUICK ACTIONS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <Action icon="arrow-up-outline" label="Send" color="#6C5CE7" onPress={handleTransfer} />
            <Action icon="wallet-outline" label="Pay" color="#FD79A8" onPress={handlePaymentChoice} />
            <Action icon="help-circle-outline" label="Request" color="#E17055" onPress={handleRequest} />
          </View>
        </View>

        {/* TRANSACTIONS */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: "/historique", params: { compteId: accountData?.accountId } })
              }
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                image={tx.image}
                name={tx.name}
                date={new Date(tx.date).toLocaleDateString()}
                amount={`${tx.amount > 0 ? "+" : ""}€${Math.abs(tx.amount).toFixed(2)}`}
                positive={tx.amount > 0}
              />
            ))
          ) : (
            <View style={styles.noTransactions}>
              <Ionicons name="receipt-outline" size={40} color="#DFE6E9" />
              <Text style={styles.noTransactionsText}>No recent transactions</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Chat Bubble */}
      <TouchableOpacity style={styles.chatBubble} onPress={() => setChatVisible(true)}>
        <Ionicons name="chatbubbles-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal visible={chatVisible} animationType="slide" onRequestClose={() => setChatVisible(false)}>
        <View style={{ flex: 1 }}>
          <ChatbotScreen />
          <TouchableOpacity style={styles.closeButton} onPress={() => setChatVisible(false)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

function Action({ icon, label, color = "#3498db", onPress }: ActionProps) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionItem({
  image,
  name,
  date,
  amount,
  positive = true,
}: TransactionItemProps) {
  return (
    <View style={styles.transactionItem}>
      <Image source={image} style={styles.avatar} />
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{name}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        positive ? styles.income : styles.expense
      ]}>
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFD",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
  },
  subtitle: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
  },
  viewAll: {
    color: "#0984E3",
    fontSize: 14,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    alignItems: "center",
    width: 70,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#636E72",
    textAlign: "center",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3436",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#636E72",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  income: {
    color: "#00B894",
  },
  expense: {
    color: "#D63031",
  },
  noTransactions: {
    alignItems: "center",
    paddingVertical: 30,
  },
  noTransactionsText: {
    color: "#636E72",
    marginTop: 10,
  },
  chatBubble: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#2e86de",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#2e86de",
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
});

