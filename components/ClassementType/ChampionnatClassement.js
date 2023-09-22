import React from 'react'
import { Text, View, Image, ScrollView} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStanding } from '../../redux/features/classementSlice';
import { useEffect } from 'react';



const ChampionnatClassement = ({group, groupId, tournoiId}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.classement.data);

  useEffect(() => {
    dispatch(fetchAllStanding(tournoiId));
  }, [tournoiId, dispatch]);

  return (
    
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Groupe {groupId}</Text>
        
        {/* Ici, vous pourriez ajouter le composant MatchBygroupe si nécessaire */}
        
        <ScrollView horizontal={true}>
          <View>
            {/* Entêtes du tableau */}
            <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
              {['#', '', 'Équipe', 'Pts', 'MJ', 'V', 'N', 'D', 'BP', 'BC', 'Diff'].map((header, index) => (
                <Text key={index} style={{ width: 50, textAlign: 'center', fontWeight: 'bold' }}>{header}</Text>
              ))}
            </View>
  
            {/* Corps du tableau */}
            {group?.map((team, index) => (
              <View key={index} style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                <Text style={{ width: 50, textAlign: 'center' }}>{index + 1}</Text>
                <View style={{ width: 50, alignItems: 'center' }}>
                  <Image 
                    source={{ uri: team.logopath }} 
                    style={{ width: 40, height: 40, resizeMode: 'contain' }}
                  />
                </View>
                <Text style={{ width: 50 }}>{team.name}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.points}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.matchesPlayed}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.wins}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.draws}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.losses}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.goalsScored}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.goalsAgainst}</Text>
                <Text style={{ width: 50, textAlign: 'center' }}>{team.goalsDifference}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
  )
}

export default ChampionnatClassement