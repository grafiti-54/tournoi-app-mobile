import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearUserMatchs, fetchAllMatch } from "../redux/features/matchSlice";
import { useEffect } from "react";

const UserMatchList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Récupérer la liste des matchs et des matchs favoris depuis le state Redux
  const allMatchs = useSelector((state) => state.match.data);
  //console.log("Tous les matchs:", allMatchs);
  const userMatchsIds = useSelector((state) => state.match.userMatchs);
  // console.log(
  //   "liste des id des matchs favoris de l'utilisateur : ",
  //   userMatchsIds
  // );

  // Filtrer les matchs pour obtenir seulement les matchs favoris
  const userMatchs = allMatchs
    .filter((match) => match) // exclure les éléments null
    .filter((match) => userMatchsIds.includes(match.match_id)); // assurez-vous que match_id est une chaîne
    //console.log("Matchs favoris:", userMatchs);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllMatch()); // Assurez-vous de passer l'ID du tournoi si nécessaire
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);


  //Supression de tous les matchs de la liste des favoris.
  const handleClearUserMatchs = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer tous les matchs suivis ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Oui, supprimer",
          onPress: () => dispatch(clearUserMatchs())
        }
      ]
    );
  };
  // console.log("Matchs filtrés:", userMatchs);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      {userMatchs?.map((match) => (
        <View
          key={match?.match_id}
          style={{ margin: 10, padding: 10, backgroundColor: "#f0f0f0" }}
        >
          <Text>Match ID: {match?.match_id}</Text>
          <Text>Équipe à domicile: {match?.Domicile.name}</Text>
          <Text>Score à domicile: {match?.dom_equipe_score}</Text>
          <Text>Équipe extérieure: {match?.Exterieur.name}</Text>
          <Text>Score extérieur: {match?.ext_equipe_score}</Text>
          <Text>Est en direct: {match?.is_live ? "Oui" : "Non"}</Text>
        </View>
      ))}
      <Button title="Supprimer tous les matchs suivis" onPress={handleClearUserMatchs} />
    </View>
  );
};

export default UserMatchList;
