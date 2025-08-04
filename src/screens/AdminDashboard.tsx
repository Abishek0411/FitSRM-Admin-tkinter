// screens/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getAllUsers, generateQR } from "../api/adminApi";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./../../App";

type Props = NativeStackScreenProps<RootStackParamList, "AdminDashboard">;

interface User {
  user_id: number;
  username: string;
  phone_number: string;
  email: string;
  DOB: string;
  height: number;
  weight: number;
  gender: string;
  blood_group: string;
  credit_balance: number;
}

const AdminDashboard: React.FC<Props> = ({ navigation }) => {
  const [view, setView] = useState<"users" | "qr">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const lower = query.toLowerCase();
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(lower)
      )
    );
  };

  const handleGenerateQR = async () => {
    try {
      if (!name || !amount) {
        Alert.alert("Missing Fields", "Please fill all fields");
        return;
      }
      await generateQR(name, parseFloat(amount));
      Alert.alert("Success", "QR Code generated");
    } catch (err) {
      Alert.alert("Error", "QR Generation Failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchView}>
        <Button title="User View" onPress={() => setView("users")} />
        <Button title="Generate QR" onPress={() => setView("qr")} />
      </View>

      {view === "users" && (
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder="Search users..."
            placeholderTextColor="#000" 
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("TransactionsScreen", {
                      userId: item.user_id,
                      username: item.username,
                    })
                  }
                >
                  <Text style={styles.cardTitle}>{item.username}</Text>
                  <Text style={styles.cardSub}>{item.email}</Text>
                  <Text style={styles.cardSub}>{item.phone_number}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {view === "qr" && (
        <View style={styles.qrForm}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Button title="Generate QR" onPress={handleGenerateQR} />
        </View>
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
  switchView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardSub: {
    fontSize: 14,
    color: "#666",
  },
  qrForm: {
    marginTop: 20,
  },
});

export default AdminDashboard;
