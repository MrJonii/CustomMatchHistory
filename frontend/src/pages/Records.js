import './Records.css'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images } from '../resources';

const Records = ({season}) => {
  const [records, setRecords] = useState([]);

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

      let entries = [];

      for(let m in matches)
      {
        const match = matches[m];
        const duration = match.duration / 60;

        for(let t in match.teams)
        {
            const team = match.teams[t];

            team.damage = 0;
            team.gold = 0;
            team.kills = 0;

            for(let p in team.players){
              const player = team.players[p];

              team.damage += player.damageDealt;
              team.gold += player.gold;
              team.kills += player.kills;
            }

            for(let p in team.players)
            {
              const side = team.side === 'Blue' ? 0 : 5;
              const player = team.players[p];
              const participant = match.riotMatch.participants[parseInt(p, 10) + side];
              
              let entry = {
                playerId: player.riotId,
                summonerName: player.summonerName,
                champion: player.champion,
                matchId: match.gameId,
                kills: player.kills,
                deaths: player.deaths,
                assists: player.assists,
                kda: ((player.kills + player.assists) / (player.deaths > 0 ? player.deaths : 1)).toFixed(1),
                kp: (100 * (player.kills + player.assists) / (team.kills > 0 ? team.kills : 1)).toFixed(2),
                gold: player.gold,
                goldPerMin: (player.gold / duration).toFixed(1),
                goldShare: (100 * (player.gold / team.gold)).toFixed(2),
                cs: player.cs,
                csPerMin: (player.cs / duration).toFixed(1),
                damageDealt: player.damageDealt,
                damageDealtPerMin: (player.damageDealt / duration).toFixed(1),
                damageDealtShare: (100 * player.damageDealt / team.damage).toFixed(2),
                damageTaken: player.damageTaken,
                heal: participant.stats.totalHeal,
                cc: participant.stats.timeCCingOthers,
                damageTurrets: player.damageTurrets,
                visionScore: player.visionScore,
                wardsPlaced: participant.stats.wardsPlaced,
                wardsCleared: participant.stats.wardsKilled,
                controlWards: participant.stats.visionWardsBoughtInGame,
                critical: participant.stats.largestCriticalStrike,
                multikill: participant.stats.largestMultiKill,
                killingSpree: participant.stats.largestKillingSpree,
                timeAlive: (participant.stats.longestTimeSpentLiving / 60).toFixed(1)
              };

              entries.push(entry);
            }
        }
      }

      let tempRecords = [
        { key: 'kills', display: 'Kills', entries: [] },
        { key: 'deaths', display: 'Deaths', entries: [] },
        { key: 'assists', display: 'Assists', entries: [] },
        { key: 'kda', display: 'KDA', entries: [] },
        { key: 'kp', display: 'Kill Participation', entries: [] },
        { key: 'gold', display: 'Gold', entries: [] },
        { key: 'goldPerMin', display: 'Gold Per Minute', entries: [] },
        { key: 'goldShare', display: 'Gold %', entries: [] },
        { key: 'cs', display: 'CS', entries: [] },
        { key: 'csPerMin', display: 'CS Per Minute', entries: [] },
        { key: 'damageDealt', display: 'Damage Dealt', entries: [] },
        { key: 'damageDealtPerMin', display: 'Damage Dealt Per Minute', entries: [] },
        { key: 'damageDealtShare', display: 'Damage Dealt %', entries: [] },
        { key: 'damageTaken', display: 'Damage Taken', entries: [] },
        { key: 'heal', display: 'Healing Done', entries: [] },
        { key: 'cc', display: 'Crowd Control Score', entries: [] },
        { key: 'damageTurrets', display: 'Damage Dealt To Turrets', entries: [] },
        { key: 'visionScore', display: 'Vision Score', entries: [] },
        { key: 'wardsPlaced', display: 'Wards Placed', entries: [] },
        { key: 'wardsCleared', display: 'Wards Cleared', entries: [] },
        { key: 'controlWards', display: 'Control Wards Purchased', entries: [] },
        { key: 'critical', display: 'Largest Critical Strike', entries: [] },
        { key: 'multikill', display: 'Largest Multikill', entries: [] },
        { key: 'killingSpree', display: 'Longest Killing Spree', entries: [] },
        { key: 'timeAlive', display: 'Longest Time Alive', entries: [] }
      ];

      for(const e in entries){
        const entry = entries[e];

        for(const key in entry){
          const record = tempRecords.find(x => x.key === key);
          if(!record) continue;

          record.entries.push({playerId: entry.playerId, summonerName: entry.summonerName, champion: entry.champion, matchId: entry.matchId, value: entry[key]});
        }
      }

      for(const r in tempRecords){
        const record = tempRecords[r];

        record.entries.sort((left, right) => right.value - left.value);
        record.entries = record.entries.slice(0, 5);
      }

      setRecords(tempRecords);
    }

    fetchMatches();
  }, [season]);

  return (
    <div className="records">
      { records && records.map(record => {
        return (
          <div className='record-container'>
            <p>{record.display}</p>
            <div className="record-container-inner">
            { record.entries && record.entries.map(entry => {
              return (
                  <Link to={`/match-history?id=${entry.matchId}`} style={{textDecoration: 'none'}}>
                    <div className="record-entry">
                        <img style={{margin: '5px'}} className="champion-thumbnail-medium" src={images.champions[`${entry.champion}_0.jpg`]} alt={entry.champion}></img>
                        <div className='record-entry-block' style={{width: '150px'}}>
                          <p>{entry.summonerName}</p>
                        </div>
                        <div className='record-entry-block'>
                          <p>{entry.value}</p>
                        </div>
                    </div>
                  </Link>
              )
            }) }
            </div>
          </div>
        )
      })}
    </div>
  )
};

export default Records