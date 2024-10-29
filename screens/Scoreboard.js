import React, { useState, useCallback } from "react";
import { View, Alert } from "react-native";
import { DataTable, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ScoreboardStyles";
import { useFocusEffect } from "@react-navigation/native";

const Scoreboard = () => {
  // Holds the scoreboard entries
  const [scoreboard, setScoreboard] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadScoreboard(); // Loads scoreboard
    }, [])
  );

  // Loads the scoreboard from AsyncStorage
  const loadScoreboard = async () => {
    try {
      const existing = await AsyncStorage.getItem("scoreboard"); // Retrieve scoreboard
      const scores = existing ? JSON.parse(existing) : []; // Parse to json or empty array
      setScoreboard(scores); // Updates the state with scoreboard data
    } catch (error) {
      console.log("Error loading scoreboard:", error);
    }
  };

  // Clears the scoreboard from AsyncStorage and state
  const clearScoreboard = () => {
    try {
      AsyncStorage.removeItem("scoreboard");
      setScoreboard([]);
    } catch (error) {
      console.log("Error clearing scoreboard:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scoreboard</Text>
      {scoreboard.length === 0 ? (
        <Text style={styles.noScoresText}>
          No scores yet. Play a game to get started!
        </Text>
      ) : (
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Player</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Time</DataTable.Title>
            <DataTable.Title numeric>Points</DataTable.Title>
          </DataTable.Header>

          {scoreboard.map((entry, index) => (
            <DataTable.Row key={index} style={styles.tableRow}>
              <DataTable.Cell style={styles.tableCell}>
                {entry.player}
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                {entry.date}
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                {entry.time}
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.tableCell}>
                {entry.points}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      )}
      {scoreboard.length > 0 && (
        <Button
          mode="contained"
          onPress={clearScoreboard}
          style={styles.clearButton}
        >
          Clear Scoreboard
        </Button>
      )}
    </View>
  );
};

export default Scoreboard;
