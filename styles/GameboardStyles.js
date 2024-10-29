// styles/GameboardStyles.js
import { StyleSheet } from "react-native";
import Metrics from "../utils/Metrics";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: Metrics.moderateScale(20),
    backgroundColor: "#f5f5f5",
  },
  playerText: {
    fontSize: Metrics.moderateScale(20),
    marginBottom: Metrics.verticalScale(10),
    color: "#333",
  },
  regularScoreText: {
    fontSize: Metrics.moderateScale(18),
    color: "#333",
  },
  bonusText: {
    fontSize: Metrics.moderateScale(18),
    fontWeight: "500",
    marginBottom: Metrics.verticalScale(10),
  },
  bonusPending: {
    color: "#d32f2f",
  },
  bonusAchieved: {
    color: "#4caf50",
  },
  totalScoreText: {
    fontSize: Metrics.moderateScale(18),
    color: "#333",
  },
  throwsText: {
    fontSize: Metrics.moderateScale(18),
    fontWeight: "500",
    marginBottom: Metrics.verticalScale(20),
    color: "#666",
  },
  dicesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: Metrics.verticalScale(25),
  },
  diceWrapper: {
    marginHorizontal: Metrics.moderateScale(10),
    width: Metrics.moderateScale(60),
    height: Metrics.moderateScale(60),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Metrics.moderateScale(10),
  },
  selectedDice: {
    backgroundColor: "#e0e0e0",
  },
  pointsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Metrics.verticalScale(25),
  },
  pointButton: {
    width: "30%",
    alignItems: "center",
    marginVertical: Metrics.verticalScale(10),
    padding: Metrics.moderateScale(15),
    backgroundColor: "#e0e0e0",
    borderRadius: Metrics.moderateScale(10),
    elevation: 2,
  },
  selectedPointButton: {
    backgroundColor: "#a5d6a7",
  },
  pointIcon: {
    fontSize: Metrics.moderateScale(24),
    color: "#333",
  },
  pointText: {
    marginTop: Metrics.verticalScale(5),
    fontSize: Metrics.moderateScale(18),
    color: "#333",
  },
  pointButtonDisabled: {
    backgroundColor: "#aaa",
  },
  gameOverText: {
    fontSize: Metrics.moderateScale(20),
    fontWeight: "bold",
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: Metrics.verticalScale(10),
  },
  snackbar: {
    backgroundColor: "#333",
  },
  bonusSnackbar: {
    backgroundColor: "#4caf50",
  },
  warningSnackbar: {
    backgroundColor: "#FFA726",
  },
  snackbarText: {
    color: "#fff",
  },
  button: {
    marginTop: Metrics.verticalScale(20),
    backgroundColor: "#6200ee",
    paddingVertical: Metrics.verticalScale(15),
    borderRadius: Metrics.moderateScale(10),
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
});
