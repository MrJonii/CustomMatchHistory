import { useState, useEffect } from 'react'

import '../components/PlayerPreview'

import './Players.css'
import PlayerPreview from '../components/PlayerPreview';

function compare(left, right)
{
    // Descending
    if(left.games > right.games) return -1;
    if(left.games < right.games) return 1;

    // Descending
    if(left.winRate > right.winRate) return -1;
    if(left.winRate < right.winRate) return 1;

    const property = left.hasOwnProperty('summonerName') ? 'summonerName' : 'name';

    // Ascending
    if(left[property] < right[property]) return -1;
    if(left[property] > right[property]) return 1;

    return 0;
}

const Players = () => 
{
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const response = await fetch('/api/matches');
      const json = await response.json();
      let matches = [];

      if(response.ok)
      {
        matches = json;
      }

      let tempPlayers = [];

      for(let m in matches)
      {
        const match = matches[m];

        for(let t in match.teams)
        {
            const team = match.teams[t];

            for(let p in team.players)
            {
                const participant = team.players[p];
                let player = tempPlayers.find(x => x.riotId === participant.riotId);

                if(!player)
                {
                    player = {};
                    player.riotId = participant.riotId;
                    player.summonerName = participant.summonerName;
                    player.games = 0;
                    player.wins = 0;
                    player.champions = [];
                    player.roles = [];

                    tempPlayers.push(player)
                }

                let champion = player.champions.find(c => c.name === participant.champion);

                if(!champion)
                {
                    champion = {name: participant.champion, games: 0, wins: 0};
                    player.champions.push(champion);
                }

                let role = player.roles.find(r => r.name === participant.role);

                if(!role)
                {
                    role = {name: participant.role, games: 0, wins: 0};
                    player.roles.push(role);
                }

                champion.games++;
                role.games++;
                player.games++;
                
                if(match.win === team.side)
                {
                    player.wins++;
                    champion.wins++;
                    role.wins++;
                }
            }
        }
      }

      for(let p in tempPlayers)
      {
        let player = tempPlayers[p]

        player.winRate = (player.wins / player.games * 100).toFixed(2);

        for(let c in player.champions)
        {
            let champion = player.champions[c];
            champion.winRate = (champion.wins / champion.games * 100).toFixed(2);
        }

        for(let r in player.roles)
        {
            let role = player.roles[r];
            role.winRate = (role.wins / role.games * 100).toFixed(2);
        }

        player.champions.sort(compare);
        player.roles.sort(compare);
        
        player.champions.slice(0, 5);
      }

      tempPlayers.sort(compare)

      setPlayers(tempPlayers)
    }

    fetchMatches();
  }, []);

  return (
    <div className="players">
        <div className="players-header">
            <p style={{marginLeft: '10px'}}>Summoner Name</p>
            <p style={{marginLeft: '70px'}}>Played</p>
            <p style={{marginLeft: '25px'}}>Won</p>
            <p style={{marginLeft: '35px'}}>Lost</p>
            <p style={{marginLeft: '30px'}}>Win Rate</p>
            <p style={{marginLeft: '100px'}}>Roles</p>
            <p style={{marginLeft: '150px'}}>Champions</p>
        </div>
      {players && players.map((player) => {
        return (
          <PlayerPreview player={player}/>
        );
      })}
    </div>
  )
};

export default Players;