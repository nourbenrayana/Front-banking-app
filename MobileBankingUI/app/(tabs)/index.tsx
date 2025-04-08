import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good night,</Text>
          <Text style={styles.username}>Raffialdo Bayu</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* BALANCE CARD */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={styles.balanceAmount}>$32,872.00</Text>
        <Text style={styles.creditLimit}>Credit Limit $10,000.00</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.actionText}>Top Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="swap-horizontal-outline" size={24} color="white" />
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}
            onPress={() => router.push("/Payment")}
          >
            <Ionicons name="arrow-forward-circle-outline" size={24} color="white" />
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
            <Text style={styles.actionText}>Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TRANSACTIONS */}
      <View style={styles.transactions}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <View style={styles.transactionItem}>
          <Image source={require("../../assets/images/avatar1.jpg")} style={styles.avatar} />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Dinda Anggita</Text>
            <Text style={styles.transactionDate}>26 Feb 2023</Text>
          </View>
          <Text style={styles.income}>$114.08</Text>
        </View>
        <View style={styles.transactionItem}>
          <Image source={require("../../assets/images/avatar2.jpg")} style={styles.avatar} />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Arni Hanifah</Text>
            <Text style={styles.transactionDate}>17 Jan 2023</Text>
          </View>
          <Text style={styles.expense}>-$76.02</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 14, color: "gray" },
  username: { fontSize: 18, fontWeight: "bold" },
  balanceCard: { backgroundColor: "#51AFF7", padding: 20, borderRadius: 15, marginBottom: 20 },
  balanceLabel: { color: "white", fontSize: 14 },
  balanceAmount: { color: "white", fontSize: 28, fontWeight: "bold", marginVertical: 5 },
  creditLimit: { color: "white", fontSize: 12, opacity: 0.7 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  actionButton: { alignItems: "center" },
  actionText: { color: "white", fontSize: 12, marginTop: 5 },
  transactions: { backgroundColor: "white", padding: 20, borderRadius: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  transactionItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  transactionDetails: { flex: 1 },
  transactionName: { fontSize: 16, fontWeight: "bold" },
  transactionDate: { fontSize: 12, color: "gray" },
  income: { color: "green", fontSize: 16, fontWeight: "bold" },
  expense: { color: "red", fontSize: 16, fontWeight: "bold" },
  features: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  featureBox: { backgroundColor: "white", padding: 20, borderRadius: 15, alignItems: "center", flex: 1, marginHorizontal: 5 },
  featureText: { fontSize: 14, fontWeight: "bold", marginTop: 10, textAlign: "center" },
});