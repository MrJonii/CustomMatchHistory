import { useState, useEffect } from 'react'

import './Champions.css'
import ChampionPreview from '../components/ChampionPreview';

function compare(left, right)
{
    // Descending
    if(left.games + left.bans > right.games + right.bans) return -1;
    if(left.games + left.bans < right.games + right.bans) return 1;

    // Descending
    if(left.games > right.games) return -1;
    if(left.games < right.games) return 1;

    // Descending
    if(left.wins > right.wins) return -1;
    if(left.wins < right.wins) return 1;

    // Ascending
    if(left.name < right.name) return -1;
    if(left.name > right.name) return 1;

    return 0;
}

const Champions = () => 
{
  const [champions, setChampions] = useState([]);

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

      let tempChampions = [];

      const matchCount = matches.length;

      for(let m in matches)
      {
        const match = matches[m];

        for(let t in match.teams)
        {
            const team = match.teams[t];

            for(let b in team.bans)
            {
              let champion = tempChampions.find(x => x.name === team.bans[b]);

              if(!champion)
              {
                champion = {};
                tempChampions.push(champion);
                
                champion.name = team.bans[b];
                champion.games = 0;
                champion.bans = 0;
                champion.wins = 0;
              }

              champion.bans++;
            }

            for(let p in team.players)
            {
                const participant = team.players[p];

                let champion = tempChampions.find(x => x.name === participant.champion);

                if(!champion)
                {
                  champion = {}
                  tempChampions.push(champion)
                  
                  champion.name = participant.champion;
                  champion.games = 0;
                  champion.bans = 0;
                  champion.wins = 0;
                }

                champion.games++;

                if(match.win === team.side)
                {
                  champion.wins++;
                }
            }
        }

        for(let c in tempChampions)
        {
          let champion = tempChampions[c];

          champion.winRate = (champion.wins / champion.games * 100).toFixed(2);
          champion.banRate = (champion.bans / matchCount * 100).toFixed(2);
          champion.pickRate = (champion.games / matchCount * 100).toFixed(2);
          champion.presence = ((champion.bans + champion.games) / matchCount * 100).toFixed(2);
        }
      }

      tempChampions.sort(compare)

      setChampions(tempChampions)
    }

    fetchMatches();
  }, []);

  return (
    <div className="champions">
        <div className="champions-header">
            <p style={{marginLeft: '10px'}}>Champion</p>
            <p style={{marginLeft: '120px'}}>Presence</p>
            <p style={{marginLeft: '15px'}}>Pick Rate</p>
            <p style={{marginLeft: '15px'}}>Ban Rate</p>
            <p style={{marginLeft: '15px'}}>Win Rate</p>
            <p style={{marginLeft: '20px'}}>Picked</p>
            <p style={{marginLeft: '30px'}}>Banned</p>
            <p style={{marginLeft: '35px'}}>Won</p>
            <p style={{marginLeft: '50px'}}>Lost</p>
        </div>
      {champions && champions.map((champion) => {
        return (
          <ChampionPreview champion={champion}/>
        );
      })}
    </div>
  )
};

export default Champions