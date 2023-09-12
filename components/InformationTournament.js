import React from 'react'
import { ScrollView, Text } from 'react-native'


const InformationTournament = ({currentTournamentId}) => {
  return (
    <ScrollView>
        <Text>Information du tournoi avec l'id {currentTournamentId}</Text>
    </ScrollView>
  )
}

export default InformationTournament