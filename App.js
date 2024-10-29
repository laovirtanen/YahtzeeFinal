import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Gameboard from "./screens/Gameboard";
import Scoreboard from "./screens/Scoreboard";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useFonts } from "expo-font";

const Tab = createBottomTabNavigator(); //Bottom tab instance

export default function App() {
  const [fontsLoaded] = useFonts({
    // Load custom font
    "Agdasima-Bold": require("./assets/fonts/Agdasima-Bold.ttf"),
  });

  // Loading if font not loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // Native paper theme
    <PaperProvider theme={MD3LightTheme}>
      <NavigationContainer>
        <View style={styles.mainContainer}>
          <Header />
          <View style={styles.tabContainer}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                  const icons = {
                    Home: "home",
                    Gameboard: "dice-6",
                    Scoreboard: "clipboard-list",
                  };
                  return (
                    <Icon name={icons[route.name]} size={size} color={color} />
                  );
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: styles.tabBar,
              })}
            >
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Gameboard" component={Gameboard} />
              <Tab.Screen name="Scoreboard" component={Scoreboard} />
            </Tab.Navigator>
          </View>
          <Footer />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    paddingBottom: 5,
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
