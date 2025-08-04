// screens/TransactionsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { getUserTransactions } from "../api/adminApi";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./../../App";

type Props = NativeStackScreenProps<RootStackParamList, "TransactionsScreen">;

interface Transaction {
  transaction_type: string;
  activity_type: string;
  amount: number;
  created_at: string;
}

const TransactionsScreen: React.FC<Props> = ({ route }) => {
  const { userId, username } = route.params;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getUserTransactions(userId);
        setTransactions(data);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions for {username}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.type}>{item.transaction_type} - {item.activity_type}</Text>
              <Text style={styles.amount}>{item.amount} FP</Text>
              <Text style={styles.date}>{item.created_at}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTransactions}>No transactions found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    padding: 12,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    marginBottom: 12,
  },
  type: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  amount: {
    fontSize: 15,
    color: "#007bff",
    marginVertical: 4,
  },
  date: {
    fontSize: 13,
    color: "#777",
  },
  noTransactions: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
});

export default TransactionsScreen;
