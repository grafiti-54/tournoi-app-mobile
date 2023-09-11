import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  //Fonction du scan d'un qr-code.
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const regex = new RegExp(`^${baseUrl}/tournament/(\\d+)$`);
    const match = data.match(regex);
    if (match) {
      const tournamentId = match[1];
      console.log(`Tournament ID: ${tournamentId}`); // Log pour vérifier l'ID du tournoi

      // Vérifier si le tournoi existe déjà dans AsyncStorage
      const existingTournamentId = await AsyncStorage.getItem("tournamentId");
      if (existingTournamentId === tournamentId) {
        alert("Ce tournoi est déjà dans votre liste.");
        setTimeout(() => {
          setScanned(false);
        }, 5000);
        return;
      }

      Alert.alert(
        "Ajouter le tournoi",
        "Voulez-vous vraiment ajouter ce tournoi à votre liste?",
        [
          {
            text: "Annuler",
            onPress: () => console.log("Ajout annulé"),
            style: "cancel",
          },
          {
            text: "Ajouter",
            onPress: async () => {
            //   alert(
            //     `Bar code with type ${type} and data ${data} has been scanned!`
            //   );
              await AsyncStorage.setItem("tournamentId", tournamentId);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      alert("Le QR code scanné n'est pas valide pour cette application.");
    }
    setTimeout(() => {
      setScanned(false);
    }, 5000);
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Pas la permission pour utiliser la caméra.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SCAN TOURNOI-APP</Text>
      <Text style={styles.paragraph}>Scannez le QR-Code du tournoi.</Text>
      {renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: "90%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
});
