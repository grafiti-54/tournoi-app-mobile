import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Button, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournamentById,
  removeUserTournament,
} from "../redux/features/tournoiSlice";
import moment from "moment";

//Récupération de la liste des tournois suivi par l'utilisateur.
const UserTournamentList = () => {
  const dispatch = useDispatch();

  // Utilisez directement les tournois de l'utilisateur depuis le state Redux
  const userTournaments = useSelector((state) => state.tournoi.userTournaments);
  const tournamentsData = useSelector((state) => state.tournoi.data);
  const loading = useSelector((state) => state.tournoi.loading);
  const error = useSelector((state) => state.tournoi.error);

  // console.log("userTournaments", userTournaments);
  // console.log("tournamentsData", tournamentsData);

  useEffect(() => {
    userTournaments.forEach((tournamentId) => {
      dispatch(fetchTournamentById(tournamentId));
    });
  }, [userTournaments, dispatch]);

  //Fonction de suppression d'un tournoi de la liste.
  const handleRemoveTournament = (tournamentId) => {
    Alert.alert(
      "Supprimer le tournoi",
      "Êtes-vous sûr de vouloir supprimer ce tournoi de votre liste?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => {
            //console.log("Suppression du tournoi avec l'ID:", tournamentId);
            dispatch(removeUserTournament(tournamentId));
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {loading && <Text>Chargement...</Text>}
      {error && <Text>{error}</Text>}
      {userTournaments?.length === 0 && !loading && !error && (
        <Text>Vous n'avez pas de tournois.</Text>
      )}
      {userTournaments?.map((tournamentId, index) => {
        const tournament = tournamentsData[tournamentId];
        {/* console.log("Tournament pour ID", tournamentId, ":", tournament); */}

        if (!tournament) {
          return (
            <Text key={index}>Chargement du tournoi {tournamentId}...</Text>
          );
        }
        return (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: tournament?.imagepath }}
              style={styles.image}
            />
            <Text style={styles.title}>{tournament?.name}</Text>
            <Text style={styles.text}>{tournament?.adresse}</Text>
            <Text style={styles.text}>
              {moment(tournament.horaire_debut).format("HH:mm")}
            </Text>
            <Button
              title="Supprimer"
              onPress={() => handleRemoveTournament(tournament.tournoi_id)}
            />
          </View>
        );
      })}
    </View>
  );
};

// const UserTournamentList = () => {
//   const [userTournaments, setUserTournaments] = useState([]);
//   const dispatch = useDispatch();
//   const tournamentDetails = useSelector((state) => state.tournoi.single);
//   const loading = useSelector((state) => state.tournoi.loading);
//   const error = useSelector((state) => state.tournoi.error);
//   const [storedTournamentIds, setStoredTournamentIds] = useState([]);

//   useEffect(() => {
//     const fetchStoredTournamentIds = async () => {
//       const ids = JSON.parse(await AsyncStorage.getItem("tournaments")) || [];
//       setStoredTournamentIds(ids);
//     };

//     fetchStoredTournamentIds();
//   }, []);

//   useEffect(() => {
//     storedTournamentIds.forEach((tournamentId) => {
//       dispatch(fetchTournamentById(tournamentId));
//     });
//   }, [storedTournamentIds]);

//   useEffect(() => {
//     if (tournamentDetails && tournamentDetails.name) {
//       setUserTournaments((prevTournaments) => [
//         ...prevTournaments,
//         tournamentDetails,
//       ]);
//     }
//   }, [tournamentDetails]);

//   //Fonction de suppression d'un tournoi de la liste.
//   const handleRemoveTournament = async (tournamentId) => {
//     Alert.alert(
//       "Supprimer le tournoi",
//       "Êtes-vous sûr de vouloir supprimer ce tournoi de votre liste?",
//       [
//         {
//           text: "Annuler",
//           style: "cancel",
//         },
//         {
//           text: "Supprimer",
//           onPress: async () => {
//             const updatedTournaments = userTournaments.filter(
//               (t) => t.tournoi_id !== tournamentId
//             );
//             setUserTournaments(updatedTournaments);
//             await AsyncStorage.setItem(
//               "tournaments",
//               JSON.stringify(updatedTournaments.map((t) => t.tournoi_id))
//             );
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   //console.log("Liste des tournois de l'user", userTournaments);

//   return (
//     <View style={styles.container}>
//       {loading && <Text>Chargement...</Text>}
//       {error && <Text>{error}</Text>}
//       {userTournaments.length === 0 && !loading && !error && (
//         <Text>Vous n'avez pas de tournois.</Text>
//       )}
//       {userTournaments?.map((tournament, index) => (
//         <View key={index} style={styles.card}>
//           <Image source={{ uri: tournament?.imagepath }} style={styles.image} />
//           <Text style={styles.title}>{tournament?.name}</Text>
//           <Text style={styles.text}>{tournament?.adresse}</Text>
//           <Text style={styles.text}>
//             {moment(tournament.horaire_debut).format("HH:mm")}
//           </Text>
//           <Button
//             title="Supprimer"
//             onPress={() => handleRemoveTournament(tournament.tournoi_id)}
//           />
//         </View>
//       ))}
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default UserTournamentList;
