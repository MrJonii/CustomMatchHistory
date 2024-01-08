import { useState, useEffect } from 'react'

import './Champions.css'
import ChampionPreview from '../components/ChampionPreview';

function compare(left, right)
{
    // Descending
    if(left.presence > right.presence) return -1;
    if(left.presence < right.presence) return 1;

    // Descending
    if(left.bans > right.bans) return -1;
    if(left.bans < right.bans) return 1;

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

const Champions = ({season}) => 
{
  const [champions, setChampions] = useState([]);

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const response = await fetch(`/api/matches?season=${season}`);
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

          champion.winRate = Number((champion.wins / champion.games * 100).toFixed(1));
          champion.banRate = Number((champion.bans / matchCount * 100).toFixed(1));
          champion.pickRate = Number((champion.games / matchCount * 100).toFixed(1));
          champion.presence = Number(((champion.bans + champion.games) / matchCount * 100).toFixed(1));
        }
      }

      tempChampions.sort(compare)

      setChampions(tempChampions)
    }

    fetchMatches();
  }, [season]);

  return (
    <div className="champions">
      {champions && champions.map((champion) => {
        return (
          <ChampionPreview champion={champion}/>
        );
      })}
    </div>
  )
};

export default Champions