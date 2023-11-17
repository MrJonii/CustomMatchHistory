import { useState, useEffect } from 'react';

import images from '../resources'
import './Leaderboards.css'
import LeaderboardEntry from '../components/LeaderboardEntry';

const Leaderboards = () => {
  const [matches, setMatches] = useState([]);
  const [champions, setChampions] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [sortStrategy, setSortStrategy] = useState({stat: 'perGame', ascending: false});
  const [selectedStat, setSelectedStat] = useState('kills');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedChampion, setSelectedChampion] = useState('All');

  const compare = (left, right, order) => {
    for(let o in order)
    {
      if(left[order[o].property] < right[order[o].property]) return order[o].ascending ? -1 : 1;
      if(left[order[o].property] > right[order[o].property]) return order[o].ascending ? 1 : -1;
    }

    return 0;
  }

  const sort = (left, right, strategy) => {
    const order = [
      {property: strategy.stat, ascending: strategy.ascending},
      {property: strategy.stat === 'stat' ? 'perGame' : 'stat', ascending: strategy.ascending},
      {property: 'summonerName', ascending: true}
    ];

    return compare(left, right, order)
  }

  const refresh = (stat, role, champion, strategy) => {

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

          if(role !== 'All' && role !== participant.role)
          {
            continue;
          }

          if(champion !== 'All' && champion !== participant.champion)
          {
            continue;
          }

          let player = tempPlayers.find(x => x.riotId === participant.riotId);

          if(!player)
          {
            player = {
              riotId: participant.riotId,
              summonerName: participant.summonerName,
              stat: 0,
              duration: 0,
              games: 0,
              team: 0
            };

            tempPlayers.push(player);
          }

          player.stat += participant[stat];
          player.duration += match.duration;
          player.games += 1;

          for(let x in team.players)
          {
            player.team += team.players[x][stat];
          }
        }
      }
    }

    for(let p in tempPlayers)
    {
      let player = tempPlayers[p];

      player.perGame = (player.stat / player.games);
      const minutes = player.duration / 60;
      player.perMinute = (player.stat / minutes);
      player.teamShare = (100 * player.stat / player.team);
    }

    tempPlayers.sort((left, right) => sort(left, right, strategy));
    setSorted(tempPlayers);
  }

  const handleSelectStat = (event) => {
    setSelectedStat(event.target.value);
    refresh(event.target.value, selectedRole, selectedChampion, sortStrategy);
  }

  const handleSelectRole = (event) => {
    setSelectedRole(event.target.value);
    refresh(selectedStat, event.target.value, selectedChampion, sortStrategy);
  }

  const handleSelectChampion = (event) => {
    setSelectedChampion(event.target.value);
    refresh(selectedStat, selectedRole, event.target.value, sortStrategy);
  }

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const response = await fetch('/api/matches');
      const json = await response.json();

      if(response.ok)
      {
        setMatches(json);
      }

      let tempChampions = [];

      for(let m in json)
      {
        const match = json[m];

        for(let t in match.teams)
        {
            const team = match.teams[t];

            for(let p in team.players)
            {
              const participant = team.players[p];
              tempChampions.push(participant.champion);
            }
        }
      }

      tempChampions.sort();
      setChampions([...new Set(tempChampions)]);
    }
    fetchMatches();
  }, []);

  const handleClickHeader = (strategy) => {
    let tempStrategy = {stat: strategy};

    if(tempStrategy.stat === sortStrategy.stat)
    {
      tempStrategy.ascending = !sortStrategy.ascending;
    }
    else
    {
      tempStrategy.ascending = false;
    }

    setSortStrategy(tempStrategy);
    console.log(selectedStat, selectedRole, selectedChampion, tempStrategy)
    refresh(selectedStat, selectedRole, selectedChampion, tempStrategy);
  }

  const white = '#f0f0f0'
  const red = '#E76161'
  const green = '#9CA777'

  return (
    <div className="leaderboards">
      <div className="leaderboards-selects">
        <select className='drowdown' value={selectedStat} onChange={handleSelectStat}>
          <option value='kills'>Kills</option>
          <option value='deaths'>Deaths</option>
          <option value='assists'>Assists</option>
          <option value='gold'>Gold</option>
          <option value='cs'>CS</option>
          <option value='damageDealt'>Damage Dealt</option>
          <option value='damageTaken'>Damage Taken</option>
          <option value='damageTurrets'>Damage Dealt To Turrets</option>
          <option value='visionScore'>Vision Score</option>
        </select>
        <select className='drowdown' value={selectedRole} onChange={handleSelectRole}>
          <option value='All'>All</option>
          <option value='Top'>Top</option>
          <option value='Jungle'>Jungle</option>
          <option value='Mid'>Mid</option>
          <option value='Adc'>Adc</option>
          <option value='Support'>Support</option>
        </select>
        <select className='drowdown' value={selectedChampion} onChange={handleSelectChampion}>
          <option value='All'>All</option>
          {champions && champions.map((champion) => {
            return (
              <option value={champion}>{champion}</option>
            )
          })}
        </select>
      </div>
      <div className="entries">
        <div className="entriesHeader">
          <p style={{width: '200px'}}>Summoner Name</p>
          <p className='header' style={{color: sortStrategy.stat !== 'perGame' ? white : sortStrategy.ascending ? red : green}} onClick={() => handleClickHeader('perGame')}>Per Game</p>
          <p className='header' style={{color: sortStrategy.stat !== 'total' ? white : sortStrategy.ascending ? red : green}} onClick={() => handleClickHeader('total')}>Total</p>
          <p className='header' style={{color: sortStrategy.stat !== 'perMinute' ? white : sortStrategy.ascending ? red : green}} onClick={() => handleClickHeader('perMinute')}>Per Minute</p>
          <p className='header' style={{color: sortStrategy.stat !== 'teamShare' ? white : sortStrategy.ascending ? red : green}} onClick={() => handleClickHeader('teamShare')}>Team Share</p>
        </div>
        {sorted && sorted.map((entry, index) => {
          return (
            <LeaderboardEntry entry={entry} index={index}></LeaderboardEntry>
          );
        })}
      </div>
    </div>
  )
};

export default Leaderboards