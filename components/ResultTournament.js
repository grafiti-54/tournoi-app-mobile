import React from 'react'
import { ScrollView, Text } from 'react-native'

const ResultTournament = ({currentTournamentId}) => {
  return (
    <ScrollView>
        <Text>Resultat du tournoi avec l'id {currentTournamentId}</Text>
    </ScrollView>
  )
}

export default ResultTournament