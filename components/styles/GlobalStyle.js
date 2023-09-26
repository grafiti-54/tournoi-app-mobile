// GlobalStyle.js
import { StyleSheet } from "react-native";

export const GlobalStyle = StyleSheet.create({
  //Box shadow utilisé sur l'application.
  shadow: {
    shadowColor: "#0a0094",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
  },
  //Container d'affichage des matchs.
  matchContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "row",
    width: "98%",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: "#f0f8fd",
    borderColor: "#a8ddfc",
    padding: 6,
    borderRadius: 35,
    borderWidth: 1,
  },
});
