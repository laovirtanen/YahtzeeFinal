import { StyleSheet } from "react-native";
import Metrics from "../utils/Metrics";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: Metrics.moderateScale(20),
    backgroundColor: "#f5f5f5",
  },
  headline: {
    fontSize: Metrics.moderateScale(32),
    color: "#333",
    fontFamily: "Agdasima-Bold",
    marginBottom: Metrics.verticalScale(20),
  },
  input: {
    marginVertical: Metrics.verticalScale(15),
    fontSize: Metrics.moderateScale(18),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Metrics.verticalScale(10),
  },
  submitButton: {
    flex: 1,
    marginRight: Metrics.moderateScale(5),
  },
  clearButton: {
    flex: 1,
    marginLeft: Metrics.moderateScale(5),
  },
  changeNameButton: {
    alignSelf: "flex-end",
  },
  subHeader: {
    fontSize: Metrics.moderateScale(20),
    fontWeight: "600",
    marginBottom: Metrics.verticalScale(10),
    color: "#333",
  },
  rulesText: {
    fontSize: Metrics.moderateScale(16),
    color: "#555",
    marginBottom: Metrics.verticalScale(10),
  },
  snackbar: {
    backgroundColor: "#333",
  },
  snackbarText: {
    color: "#fff",
  },
});
