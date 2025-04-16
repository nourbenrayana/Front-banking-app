import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import AnimatedCard from "../../components/AnimatedCard";

export default function Dashboard() {
  const router = useRouter();
  const { userData, accountData } = useUser();

  const { fullName } = userData || {};
  const { cardNumber, expiryDate, cardType, status } = accountData || {};

  const handleTransfer = () => {
    router.push("/Payment");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <TouchableOpacity onPress={() => router.replace("/(auth)/welcome")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{fullName || "User"}!</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" />
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

      {/* SERVICES */}
      <View style={styles.creditLimitContainer}>
        <Text style={styles.creditLimit}>Our Services</Text>
        <View style={styles.actions}>
          <Action icon="add-circle-outline" label="Top Up" />
          <Action icon="swap-horizontal-outline" label="Swap" />
          <Action icon="arrow-forward-circle-outline" label="Transfer" onPress={handleTransfer} />
          <Action icon="chatbubble-outline" label="Request" />
        </View>
      </View>

      {/* TRANSACTIONS */}
      <View style={styles.transactions}>
        <Text style={styles.sectionTitle}>Transactions</Text>

        <TransactionItem
          image={require("../../assets/images/avatar1.jpg")}
          name="Dinda Anggita"
          date="26 Feb 2023"
          amount={"+$114.08"}
          positive
        />
        <TransactionItem
          image={require("../../assets/images/avatar2.jpg")}
          name="Arni Hanifah"
          date="17 Jan 2023"
          amount={"-$76.02"}
          positive={false}
        />
      </View>
    </View>
  );
}

function Action({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon} size={20} color="white" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionItem({
  image,
  name,
  date,
  amount,
  positive = true,
}: {
  image: any;
  name: string;
  date: string;
  amount: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.transactionItem}>
      <Image source={image} style={styles.avatar} />
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{name}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      <Text style={positive ? styles.income : styles.expense}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 14, color: "gray" },
  username: { fontSize: 18, fontWeight: "bold" },

  creditLimitContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  creditLimit: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  transactions: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  transactionItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  transactionDetails: { flex: 1 },
  transactionName: { fontSize: 16, fontWeight: "bold" },
  transactionDate: { fontSize: 12, color: "gray" },
  income: { color: "green", fontSize: 16, fontWeight: "bold" },
  expense: { color: "red", fontSize: 16, fontWeight: "bold" },
});
