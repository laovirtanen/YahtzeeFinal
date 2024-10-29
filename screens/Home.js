import React, { useState, useEffect } from "react";
import { View, Keyboard, ScrollView, ActivityIndicator } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Snackbar,
  Headline,
  Paragraph,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/HomeStyles";
import Constants from "../constants/Constants";

const Home = ({ navigation }) => {
  const [playerName, setPlayerName] = useState("");
  const [storedPlayerName, setStoredPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);

  // Load the player's name from AsyncStorage when mounted
  useEffect(() => {
    const loadPlayerName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("playerName");
        if (storedName !== null) {
          setPlayerName(storedName); // Set retrieved name to state
          setStoredPlayerName(storedName); // Store the name
          setNameSubmitted(true); // Set nameSubmitted to true
        }
      } catch (error) {
        console.log("Error loading player name:", error);
      }
    };

    loadPlayerName();
  }, []); // Runs when component mounts

  // Handle submit name button
  const handleSubmitName = async () => {
    if (playerName.trim() === "") {
      setSnackbarVisible(true);
      return;
    }
    Keyboard.dismiss();
    try {
      setIsLoading(true);
      // Save the player's name to AsyncStorage
      await AsyncStorage.setItem("playerName", playerName.trim());
      setStoredPlayerName(playerName.trim()); // Update the name
      setNameSubmitted(true); // Set nameSubmitted to true
      setIsLoading(false);
    } catch (error) {
      console.log("Error submitting name:", error);
      setIsLoading(false);
    }
  };

  // Handle play button
  const handlePlay = () => {
    navigation.navigate("Gameboard", { resetGame: true });
  };

  // Clear player's name
  const handleClearName = () => {
    setPlayerName("");
    setNameSubmitted(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {!nameSubmitted ? (
          <>
            <Headline style={styles.headline}>Yahtzee Game</Headline>
            <TextInput
              mode="outlined"
              label="Your Name"
              value={playerName}
              onChangeText={setPlayerName}
              autoFocus
              style={styles.input}
              theme={{ colors: { primary: "#6200ee" } }} // input color
            />
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmitName}
                style={styles.submitButton}
              >
                Submit
              </Button>
              <Button
                mode="text"
                onPress={handleClearName}
                style={styles.clearButton}
              >
                Clear
              </Button>
            </View>
            {isLoading && <ActivityIndicator animating={true} />}
          </>
        ) : (
          <>
            <View style={styles.nameContainer}>
              <Headline style={styles.headline}>Hello, {playerName}!</Headline>
              <Button
                mode="text"
                onPress={handleClearName}
                style={styles.changeNameButton}
              >
                Change Name
              </Button>
            </View>
            <Headline style={styles.subHeader}>Rules of the Game:</Headline>
            <Paragraph style={styles.rulesText}>
              <Text style={{ fontWeight: "bold" }}>THE GAME:</Text> Upper
              section of the classic Yahtzee dice game. You have{" "}
              {Constants.NBR_OF_DICES} dices and for every dice you have{" "}
              {Constants.NBR_OF_THROWS} throws. After each throw, you can keep
              dices in order to get same dice spot counts as many as possible.
              In the end of the turn, you must select your points from{" "}
              {Constants.MIN_SPOT} to {Constants.MAX_SPOT}. The game ends when
              all points have been selected. The order for selecting those is
              free.
              {"\n\n"}
              <Text style={{ fontWeight: "bold" }}>POINTS:</Text> After each
              turn, the game calculates the sum for the dices you selected. Only
              the dices having the same spot count are calculated. Inside the
              game, you cannot select the same points from {Constants.MIN_SPOT}{" "}
              to {Constants.MAX_SPOT} again.
              {"\n\n"}
              <Text style={{ fontWeight: "bold" }}>GOAL:</Text> To get points as
              much as possible. {Constants.BONUS_POINTS_LIMIT} points is the
              limit of getting a bonus which gives you {Constants.BONUS_POINTS}{" "}
              points more.
            </Paragraph>
            <Button mode="contained" onPress={handlePlay} style={styles.button}>
              Play
            </Button>
          </>
        )}
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        Please enter your name before proceeding.
      </Snackbar>
    </ScrollView>
  );
};

export default Home;
