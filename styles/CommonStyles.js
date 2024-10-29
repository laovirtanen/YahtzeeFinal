import { StyleSheet } from "react-native";
import Metrics from "../utils/Metrics";

export default StyleSheet.create({
  headerContainer: {
    paddingTop: Metrics.verticalScale(40),
    paddingBottom: Metrics.verticalScale(10),
    backgroundColor: "#6200ee",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  headerText: {
    fontSize: Metrics.moderateScale(24),
    color: "#fff",
  },
  footerContainer: {
    paddingVertical: Metrics.verticalScale(10),
    backgroundColor: "#6200ee",
    alignItems: "center",
    width: "100%",
  },
  footerText: {
    fontSize: Metrics.moderateScale(14),
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
  snackbar: {
    backgroundColor: "#333",
  },
  snackbarText: {
    color: "#fff",
  },
});
