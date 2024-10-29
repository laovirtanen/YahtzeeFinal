import { StyleSheet } from "react-native";
import Metrics from "../utils/Metrics";
import CommonStyles from "./CommonStyles";

export default StyleSheet.create({
  ...CommonStyles,

  header: {
    fontSize: Metrics.moderateScale(24),
    fontWeight: "bold",
    marginBottom: Metrics.verticalScale(20),
    color: "#333",
    textAlign: "center",
  },
  noScoresText: {
    fontSize: Metrics.moderateScale(16),
    color: "#555",
    textAlign: "center",
    marginBottom: Metrics.verticalScale(20),
  },
  tableHeader: {
    backgroundColor: "#e0e0e0",
  },
  tableRow: {
    height: Metrics.verticalScale(40),
  },
  tableCell: {
    fontSize: Metrics.moderateScale(14),
    color: "#333",
  },
  clearButton: {
    marginTop: Metrics.verticalScale(20),
    backgroundColor: "#6200ee",
    paddingVertical: Metrics.verticalScale(10),
    borderRadius: Metrics.moderateScale(10),
    alignSelf: "center",
    width: "60%",
  },
});
