import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Alert, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserTournament,
  setCurrentTournamentId,
} from "../redux/features/tournoiSlice";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import ManualTournamentInput from "./ManualTournamentInput";

//Composant caméra de l'utilisateur qui permet de scanner un qr code d'un tournoi.
export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(null);
  const [resetScanner, setResetScanner] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const existingTournaments = useSelector(
    (state) => state.tournoi.userTournaments
  );
  //const navigation = useNavigation();
  // const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const baseUrl = process.env.EXPO_PUBLIC_LOCAL_BASE_URL;

  //Vérification permission utilisateur ( parametres permissions ajoutées dans app.json)
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
      //console.log(`Tournament ID: ${tournamentId}`); // Log pour vérifier l'ID du tournoi

      // Vérifier si le tournoi existe déjà dans le store
      if (existingTournaments.includes(tournamentId)) {
        alert("Ce tournoi est déjà dans votre liste.");
        dispatch(setCurrentTournamentId(tournamentId));
        navigation.navigate("Tournoi detail");
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
            onPress: () => {
              //console.log("Ajout annulé");
              setTimeout(() => {
                setScanned(false);
              }, 2000);
            },
            style: "cancel",
          },
          {
            text: "Ajouter",
            onPress: async () => {
              dispatch(setCurrentTournamentId(tournamentId));
              dispatch(addUserTournament(tournamentId));
              navigation.navigate("Tournoi detail");
              setTimeout(() => {
                setScanned(false);
              }, 2000);
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
        <Camera
          key={resetScanner}
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
        />

        <Button
          style={styles.boutonReset}
          title="Scanner un nouveau QR Code"
          onPress={() => {
            setTimeout(() => {
              setScanned(false);
            }, 2000);
            setResetScanner(!resetScanner); // Toggle the reset state to force a re-render
          }}
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
      <View
        style={{
          height: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 35 }}>
          QR-Code Scanner{" "}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 45, color: "#02a3fe" }}>
          TOURNOI-APP
        </Text>
      </View>
      <Text style={styles.paragraph}>Scannez le QR-Code du tournoi.</Text>
      {renderCamera()}
      {/* Ajout manuel de l'id d'un tournoi pour emulateur */}
      {__DEV__ && (
        <ManualTournamentInput
          existingTournaments={existingTournaments}
          setCurrentTournamentId={setCurrentTournamentId}
          addUserTournament={addUserTournament}
        />
      )}
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

//!Sans camera de expo
// <View style={styles.cameraContainer}>
//   <BarCodeScanner
//     key={resetScanner}
//     onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//     style={styles.camera}
//   />
//     <Button
//       style={styles.boutonReset}
//       title="Scanner un nouveau QR Code"
//       onPress={() => {
//         setTimeout(() => {
//           setScanned(false);
//         }, 2000);
//         setResetScanner(!resetScanner); // Toggle the reset state to force a re-render
//       }}
//     />
// </View>
