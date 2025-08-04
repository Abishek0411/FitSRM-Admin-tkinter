// App.tsx
import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, useColorScheme } from "react-native";
import AdminDashboard from "./src/screens/AdminDashboard";
import TransactionsScreen from "./src/screens/TransactionsScreen";

// Define navigation param types
export type RootStackParamList = {
  AdminDashboard: undefined;
  TransactionsScreen: { userId: number; username: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={DefaultTheme}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Stack.Navigator
          initialRouteName="AdminDashboard"
          screenOptions={{
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { fontWeight: "bold" },
            headerTintColor: "#000",
          }}
        >
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{ title: "Admin Panel" }}
          />
          <Stack.Screen
            name="TransactionsScreen"
            component={TransactionsScreen}
            options={({ route }) => ({
              title: `Transactions - ${route.params.username}`,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
