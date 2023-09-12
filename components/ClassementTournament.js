import React from 'react'
import { ScrollView, Text } from 'react-native'

const ClassementTournament = ({currentTournamentId}) => {
  return (
    <ScrollView>
        <Text>Classement du tournoi avec l'id {currentTournamentId}</Text>
    </ScrollView>
  )
}

export default ClassementTournament