import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function ManualTournamentInput({ existingTournaments, setCurrentTournamentId, addUserTournament }) {
    const [manualTournamentId, setManualTournamentId] = useState("");
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const simulateScan = (tournamentId) => {
        // Vérifier si le tournoi existe déjà dans le store
        if (existingTournaments.includes(tournamentId)) {
            alert("Ce tournoi est déjà dans votre liste.");
            dispatch(setCurrentTournamentId(tournamentId));
            navigation.navigate("Tournoi detail");
            return;
        }
        Alert.alert(
            "Ajouter le tournoi",
            "Voulez-vous vraiment ajouter ce tournoi à votre liste?",
            [
                {
                    text: "Annuler",
                    onPress: () => {
                        console.log("Ajout annulé");
                    },
                    style: "cancel",
                },
                {
                    text: "Ajouter",
                    onPress: async () => {
                        dispatch(setCurrentTournamentId(tournamentId));
                        dispatch(addUserTournament(tournamentId));
                        navigation.navigate("Tournoi detail");
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={{ marginVertical: 20 }}>
            <TextInput 
                placeholder="Entrez l'ID du tournoi manuellement"
                onChangeText={text => setManualTournamentId(text)}
                value={manualTournamentId}
                style={{ borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 }}
            />
            <Button 
                title="Ajouter manuellement"
                onPress={() => simulateScan(manualTournamentId)}
            />
        </View>
    );
}
