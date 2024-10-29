import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/GameboardStyles";
import Constants from "../constants/Constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import Metrics from "../utils/Metrics";
import { Button, Snackbar, Text } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

// Convert number to word for dice icons
const numberToWord = (number) => {
  const map = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
  };
  return map[number] || "one";
};

const Gameboard = ({ navigation, route }) => {
  const [dices, setDices] = useState(Array(Constants.NBR_OF_DICES).fill(1));
  const [selectedDices, setSelectedDices] = useState(
    Array(Constants.NBR_OF_DICES).fill(false)
  );
  const [throwsLeft, setThrowsLeft] = useState(Constants.NBR_OF_THROWS);
  const [score, setScore] = useState({});
  const [gameEnded, setGameEnded] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [bonusSnackbarVisible, setBonusSnackbarVisible] = useState(false); // This is state for the bonus

  const [selectSnackbarVisible, setSelectSnackbarVisible] = useState(false); // New state for selection message
  const [selectSnackbarMessage, setSelectSnackbarMessage] = useState(""); // Message to show

  // Function to reset all game states to initial values
  const resetGame = () => {
    setDices(Array(Constants.NBR_OF_DICES).fill(1));
    setSelectedDices(Array(Constants.NBR_OF_DICES).fill(false));
    setThrowsLeft(Constants.NBR_OF_THROWS);
    setScore({});
    setGameEnded(false);
    setBonusSnackbarVisible(false); // Reset bonus snackbar
    setSelectSnackbarVisible(false); // Reset select snackbar
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadGameState = async () => {
        try {
          // Retrieve the resetGame parameter
          const resetGameFlag = route.params?.resetGame || false;

          if (resetGameFlag) {
            // If resetGame is true, clear stored game state and reset game
            await AsyncStorage.removeItem("currentGameState");
            resetGame();
            console.log("Game state has been reset due to name change.");
          } else {
            // If not then load existing game state from AsyncStorage
            const storedState = await AsyncStorage.getItem("currentGameState");
            if (storedState !== null) {
              const parsedState = JSON.parse(storedState);
              setDices(parsedState.dices);
              setSelectedDices(parsedState.selectedDices);
              setThrowsLeft(parsedState.throwsLeft);
              setScore(parsedState.score);
              setGameEnded(parsedState.gameEnded);
            }
          }

          // Load the players name from AsyncStorage
          const storedName = await AsyncStorage.getItem("playerName");
          if (storedName !== null) {
            setPlayerName(storedName);
          } else {
            // If no name then navigate back to Home screen
            navigation.navigate("Home");
          }
        } catch (error) {
          console.log("Error loading game state:", error);
        }
      };

      loadGameState();
    }, [route.params])
  );

  // Function to save the current game state to AsyncStorage
  const saveGameState = async () => {
    try {
      const gameState = {
        dices,
        selectedDices,
        throwsLeft,
        score,
        gameEnded,
      };
      await AsyncStorage.setItem("currentGameState", JSON.stringify(gameState));
    } catch (error) {
      console.log("Error saving game state:", error);
    }
  };

  // useEffect to automatically save game state whenever states change
  useEffect(() => {
    if (!gameEnded) {
      saveGameState();
    }
  }, [dices, selectedDices, throwsLeft, score, gameEnded]);

  // Function to handle throwing dices
  const throwDices = () => {
    if (gameEnded || throwsLeft === 0) return; // Prevent throwing if game ended or no throws left

    const newDices = dices.map(
      (dice, index) =>
        selectedDices[index] ? dice : Math.floor(Math.random() * 6) + 1 // Keep selected dices and roll others
    );
    setDices(newDices);
    setThrowsLeft(throwsLeft - 1); // decrement throws by 1
  };

  // Toggle the selection state of a dice
  const toggleSelectDice = (index) => {
    if (gameEnded || throwsLeft === Constants.NBR_OF_THROWS) return; // Prevent selection if game ended or at initial throw

    const newSelected = [...selectedDices];
    newSelected[index] = !newSelected[index];
    setSelectedDices(newSelected);
  };

  // Function to handle selecting points for a specific spot
  const selectPoints = (spot) => {
    if (gameEnded || score.hasOwnProperty(spot)) return; // Prevent selection for some conditions

    if (throwsLeft > 0) {
      // Show message to user
      setSelectSnackbarMessage(
        "You must throw the dice 3 times before selecting a number."
      );
      setSelectSnackbarVisible(true);
      return;
    }

    const count = dices.filter((d) => d === spot).length; // Count dices matching the spot
    const points = count * spot; // Calculate points for the spot

    // Update the score for the selected spot
    const newScore = { ...score, [spot]: points };
    setScore(newScore);

    // Reset throws left and selected dices for the next turn
    setThrowsLeft(Constants.NBR_OF_THROWS);
    setSelectedDices(Array(Constants.NBR_OF_DICES).fill(false));

    // Calculate total score to check for bonus
    const totalScore = Object.values(newScore).reduce((a, b) => a + b, 0);

    // Check if bonus is achieved and show bonus snackbar if achieved
    if (
      totalScore >= Constants.BONUS_POINTS_LIMIT &&
      !bonusSnackbarVisible &&
      totalScore - points < Constants.BONUS_POINTS_LIMIT
    ) {
      setBonusSnackbarVisible(true);
    }

    // Check if all spots have been scored
    if (Object.keys(newScore).length === Constants.MAX_SPOT) {
      setGameEnded(true);
      endGame(newScore); // end game
    }
  };

  // Function to handle the end of the game
  const endGame = async (finalScore) => {
    const totalScore = Object.values(finalScore).reduce((a, b) => a + b, 0);
    const bonusPoints =
      totalScore >= Constants.BONUS_POINTS_LIMIT ? Constants.BONUS_POINTS : 0;
    const totalPoints = totalScore + bonusPoints;

    // Create a new scoreboard entry
    const newEntry = {
      player: playerName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      points: totalPoints,
    };

    try {
      // Retrieve existing scoreboard from AsyncStorage
      const existing = await AsyncStorage.getItem("scoreboard");
      const scoreboard = existing ? JSON.parse(existing) : [];

      // Add the new entry and sort the scoreboard
      scoreboard.push(newEntry);
      scoreboard.sort((a, b) => b.points - a.points);
      const topScores = scoreboard.slice(0, 10); // Keep top 10 scores

      // Save the updated scoreboard back to AsyncStorage
      await AsyncStorage.setItem("scoreboard", JSON.stringify(topScores));
    } catch (error) {
      console.log("Error saving score:", error);
    }
  };

  // Function to start a new game (reset all states)
  const startNewGame = () => {
    resetGame();
  };

  // Calculations for displaying scores and bonus information
  const totalScore = Object.values(score).reduce((a, b) => a + b, 0);
  const bonusPoints =
    totalScore >= Constants.BONUS_POINTS_LIMIT ? Constants.BONUS_POINTS : 0;
  const totalPoints = totalScore + bonusPoints;
  const pointsNeeded = Constants.BONUS_POINTS_LIMIT - totalScore;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Layout platform for better scalability
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.playerText}>Player: {playerName}</Text>

          <Text style={styles.regularScoreText}>
            Regular Score: {totalScore}
          </Text>

          <Text
            style={[
              styles.bonusText,
              pointsNeeded > 0 ? styles.bonusPending : styles.bonusAchieved,
            ]}
          >
            {pointsNeeded > 0
              ? `Points needed for bonus: ${pointsNeeded}`
              : `Bonus achieved! 🎉 +${bonusPoints} points`}
          </Text>

          <Text style={styles.totalScoreText}>Total Points: {totalPoints}</Text>

          {!gameEnded && (
            <Text style={styles.throwsText}>Throws Left: {throwsLeft}</Text>
          )}

          <View style={styles.dicesContainer}>
            {dices.map((dice, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => toggleSelectDice(index)}
              >
                <View
                  style={[
                    styles.diceWrapper,
                    selectedDices[index] && styles.selectedDice, // Highlight selected dices
                  ]}
                >
                  <Icon
                    name={`dice-${numberToWord(dice)}`} // numeric dice icon
                    size={Metrics.moderateScale(60)}
                    color={selectedDices[index] ? "#6200ee" : "#333"} // Change color if selected
                    style={styles.dice}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>

          {!gameEnded && (
            <Button
              mode="contained"
              onPress={throwDices}
              disabled={throwsLeft === 0} // Disable if no throws left
              style={[
                styles.button,
                throwsLeft === 0 && styles.buttonDisabled, // Apply disabled style
              ]}
            >
              Throw Dices
            </Button>
          )}

          <View style={styles.pointsContainer}>
            {Array.from({ length: Constants.MAX_SPOT }, (_, i) => i + 1).map(
              (spot) => (
                <TouchableWithoutFeedback
                  key={spot}
                  onPress={() => selectPoints(spot)}
                  disabled={gameEnded || score.hasOwnProperty(spot)} // Disable if game ended or spot already selected
                >
                  <View
                    style={[
                      styles.pointButton,
                      score.hasOwnProperty(spot) && styles.selectedPointButton, // Highlight if spot is scored
                      gameEnded && styles.pointButtonDisabled, // Disabled if game has ended
                    ]}
                  >
                    <Text style={styles.pointIcon}>{spot}️⃣</Text>
                    <Text style={styles.pointText}>
                      {score.hasOwnProperty(spot) ? score[spot] : "0"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            )}
          </View>

          {gameEnded ? (
            <View style={{ marginTop: Metrics.verticalScale(20) }}>
              <Text style={styles.gameOverText}>
                Game ENDED! Your total points: {totalPoints}
              </Text>
              <Button
                mode="contained"
                onPress={startNewGame}
                style={styles.button}
              >
                Start New Game
              </Button>
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={startNewGame}
              style={[styles.button, { marginTop: Metrics.verticalScale(20) }]}
            >
              Start New Game
            </Button>
          )}
        </View>
      </ScrollView>

      <Snackbar
        visible={bonusSnackbarVisible || selectSnackbarVisible}
        onDismiss={() => {
          setBonusSnackbarVisible(false);
          setSelectSnackbarVisible(false);
        }}
        duration={3000}
        style={[
          styles.snackbar,
          bonusSnackbarVisible
            ? styles.bonusSnackbar
            : selectSnackbarVisible
            ? styles.warningSnackbar
            : styles.snackbar,
        ]}
      >
        <Text style={styles.snackbarText}>
          {bonusSnackbarVisible
            ? `Bonus achieved! 🎉 ${Constants.BONUS_POINTS} points awarded!`
            : selectSnackbarVisible
            ? selectSnackbarMessage
            : ""}
        </Text>
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

export default Gameboard;
