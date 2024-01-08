import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {images, colors} from '../resources';

import './Player.css'

function compare(left, right)
{
    // Descending
    if(left.games > right.games) return -1;
    if(left.games < right.games) return 1;

    // Descending
    if(left.wins > right.wins) return -1;
    if(left.wins < right.wins) return 1;

    // Descending
    if(Number(left.kda) > Number(right.kda)) return -1;
    if(Number(left.kda) < Number(right.kda)) return 1;

    // Ascending
    if(left.name < right.name) return -1;
    if(left.name > right.name) return 1;

    return 0;
}

const Player = ({season}) => {

    const { id } = useParams();

    const [player, setPlayer] = useState({});
    const [roles, setRoles] = useState([]);
    const [champions, setChampions] = useState([]);

    useEffect(() => {
        const fetchMatches = async () =>
        {
          const response = await fetch(`/api/matches?season=${season}`);
          const json = await response.json();

          if(!response.ok)
          {
            return;
          }
    
          let tempPlayer = {
            games: 0,
            wins: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            cs: 0,
            gold: 0,
            dmg: 0,
            teamGold: 0,
            teamDmg: 0,
            teamKills: 0,
            duration: 0
          };

          let tempRoles = [];
          let tempChampions = [];
          
          const matchCount = json.length;
    
          for(let m in json)
          {
            const match = json[m];
    
            for(let t in match.teams)
            {
                const team = match.teams[t];

                for(let p in team.players)
                {
                  const participant = team.players[p];
                  
                  if(participant.riotId !== id)
                  {
                    continue;
                  }

                  tempPlayer.summonerName = participant.summonerName;

                  let champion = tempChampions.find(x => x.name === participant.champion);

                  if(!champion)
                  {
                    champion = {};
                    champion.name = participant.champion;

                    champion.games = 0;
                    champion.wins = 0;
                    champion.kills = 0;
                    champion.deaths = 0;
                    champion.assists = 0;
                    champion.cs = 0;
                    champion.gold = 0;
                    champion.dmg = 0;
                    champion.teamGold = 0;
                    champion.teamDmg = 0;
                    champion.teamKills = 0;
                    champion.duration = 0;

                    tempChampions.push(champion);
                  }

                  let role = tempRoles.find(x => x.name === participant.role);

                  if(!role)
                  {
                    role = {};
                    role.name = participant.role;

                    role.games = 0;
                    role.wins = 0;
                    role.kills = 0;
                    role.deaths = 0;
                    role.assists = 0;
                    role.cs = 0;
                    role.gold = 0;
                    role.dmg = 0;
                    role.teamGold = 0;
                    role.teamDmg = 0;
                    role.teamKills = 0;
                    role.duration = 0;

                    tempRoles.push(role);
                  }

                  tempPlayer.games++;
                  champion.games++;
                  role.games++;

                  if(match.win === team.side)
                  {
                    tempPlayer.wins++;
                    champion.wins++;
                    role.wins++;
                  }

                  tempPlayer.kills += participant.kills;
                  champion.kills += participant.kills;
                  role.kills += participant.kills;

                  tempPlayer.deaths += participant.deaths;
                  champion.deaths += participant.deaths;
                  role.deaths += participant.deaths;

                  tempPlayer.assists += participant.assists;
                  champion.assists += participant.assists;
                  role.assists += participant.assists;

                  tempPlayer.cs += participant.cs;
                  champion.cs += participant.cs;
                  role.cs += participant.cs;

                  tempPlayer.gold += participant.gold;
                  champion.gold += participant.gold;
                  role.gold += participant.gold;

                  tempPlayer.dmg += participant.damageDealt;
                  champion.dmg += participant.damageDealt;
                  role.dmg += participant.damageDealt;

                  tempPlayer.duration += match.duration;
                  champion.duration += match.duration;
                  role.duration += match.duration;
                  
                  for(let i in team.players)
                  {
                    tempPlayer.teamGold += team.players[i].gold;
                    champion.teamGold += team.players[i].gold;
                    role.teamGold += team.players[i].gold;

                    tempPlayer.teamDmg += team.players[i].damageDealt;
                    champion.teamDmg += team.players[i].damageDealt;
                    role.teamDmg += team.players[i].damageDealt;

                    tempPlayer.teamKills += team.players[i].kills;
                    champion.teamKills += team.players[i].kills;
                    role.teamKills += team.players[i].kills;
                  }
                }
            }
          }

          const setStats = (obj) => {
            obj.winRate = (100 * obj.wins / obj.games).toFixed(1);
            obj.takedowns = obj.kills + obj.assists;
            obj.kp = (100 * obj.takedowns / obj.teamKills).toFixed(1);
            obj.kda = obj.deaths === 0 ? obj.takedowns : (obj.takedowns / obj.deaths).toFixed(1);
            obj.kpg = (obj.kills / obj.games).toFixed(1);
            obj.dpg = (obj.deaths / obj.games).toFixed(1);
            obj.apg = (obj.assists / obj.games).toFixed(1);
            obj.cspg = (obj.cs / obj.games).toFixed(1);
            obj.goldpg = (obj.gold / obj.games).toFixed(1);
            obj.dmgpg = (obj.dmg / obj.games).toFixed(1);
            
            const duration = obj.duration / 60;

            obj.cspmin = (obj.cs / duration).toFixed(1);
            obj.goldpmin = (obj.gold / duration).toFixed(1);
            obj.dmgpmin = (obj.dmg / duration).toFixed(1);
            obj.goldshare = (100 * obj.gold / obj.teamGold).toFixed(1);
            obj.dmgshare = (100 * obj.dmg / obj.teamDmg).toFixed(1);
          }

          for(let c in tempChampions)
          {
            let champion = tempChampions[c];
            setStats(champion);
          }

          for(let r in tempRoles)
          {
            let role = tempRoles[r];
            setStats(role);
          }

          setStats(tempPlayer);

          setPlayer(tempPlayer);

          tempRoles.sort(compare);
          tempChampions.sort(compare);

          setRoles(tempRoles);
          setChampions(tempChampions);
        }

        fetchMatches();
    }, [id, season]);

    const navigate = useNavigate();

    return (
        <div className='player-detail'>
            <div className="player-inner">
                <div className="player-inner-header">
                    <p className="playerName" style={{margin: '10px', marginLeft: '30px'}}>{player.summonerName}</p>
                    <div className="player-inner-keyStats-container">
                    <div className="player-inner-keyStats">
                            <div className="stat">
                                <p className="stat-header">Win Rate</p>
                                <p className="stat-value"style={{color: player.winRate > 45 ? colors.green : player.winRate > 20 ? colors.yellow : colors.red}}>{player.winRate}%</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">Played</p>
                                <p className="stat-value">{player.games}</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">Won</p>
                                <p className="stat-value" style={{color: colors.green}}>{player.wins}</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">Lost</p>
                                <p className="stat-value" style={{color: colors.red}}>{player.games - player.wins}</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">KDA</p>
                                <p className="stat-value" style={{color: player.kda > 5 ? colors.green : player.kda > 2 ? colors.yellow : colors.red}}>{player.kda}</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">CS/min</p>
                                <p className="stat-value" style={{color: player.cspmin > 8.5 ? colors.green : player.cspmin > 5.5 ? colors.yellow : colors.red}}>{player.cspmin}</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">Gold/min</p>
                                <p className="stat-value" style={{color: player.goldpmin > 400 ? colors.green : player.goldpmin > 300 ? colors.yellow : colors.red}}>{player.goldpmin}</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">Gold %</p>
                                <p className="stat-value" style={{color: player.goldshare > 25 ? colors.green : player.goldshare > 15 ? colors.yellow : colors.red}}>{player.goldshare}%</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">DMG/min</p>
                                <p className="stat-value" style={{color: player.dmgpmin > 850 ? colors.green : player.dmgpmin > 600 ? colors.yellow : colors.red}}>{player.dmgpmin}</p>
                            </div>
                            <div className="stat">
                                <p className="stat-header">DMG %</p>
                                <p className="stat-value" style={{color: player.dmgshare > 25 ? colors.green : player.dmgshare > 15 ? colors.yellow : colors.red}}>{player.dmgshare}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="player-inner-stats">
                    {roles && roles.map(role => {
                        return (
                            <div className="player">
                                <img style={{margin: '5px'}} className="role-thumbnail-medium" src={images.roles[`${role.name}.png`]} alt={role.name}></img>
                                <p style={{textAlign: 'start', width: '150px', marginLeft: '10px'}}></p>
                                <div className="roleStat">
                                    <p className="stat-header">Win Rate</p>
                                    <p className="stat-value" style={{color: role.winRate > 55 ? colors.green : role.winRate > 45 ? colors.yellow : colors.red}}>{role.winRate}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Played</p>
                                    <p className="stat-value">{role.games}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Won</p>
                                    <p className="stat-value" style={{color: colors.green}}>{role.wins}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Lost</p>
                                    <p className="stat-value" style={{color: colors.red}}>{role.games - role.wins}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">KDA</p>
                                    <p className="stat-value" style={{color: role.kda > 5 ? colors.green : role.kda > 2 ? colors.yellow : colors.red}}>{role.kda}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Kills</p>
                                    <p className="stat-value">{role.kpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Deaths</p>
                                    <p className="stat-value">{role.dpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Assists</p>
                                    <p className="stat-value">{role.apg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">KP</p>
                                    <p className="stat-value" style={{color: role.kp > 70 ? colors.green : role.kp > 40 ? colors.yellow : colors.red}}>{role.kp}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">CS</p>
                                    <p className="stat-value">{role.cspg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">CS/min</p>
                                    <p className="stat-value" style={{color: role.cspmin > 8.5 ? colors.green : role.cspmin > 5.5 ? colors.yellow : colors.red}}>{role.cspmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold</p>
                                    <p className="stat-value">{role.goldpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold/min</p>
                                    <p className="stat-value" style={{color: role.goldpmin > 400 ? colors.green : role.goldpmin > 300 ? colors.yellow : colors.red}}>{role.goldpmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold %</p>
                                    <p className="stat-value" style={{color: role.goldshare > 25 ? colors.green : role.goldshare > 15 ? colors.yellow : colors.red}}>{role.goldshare}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG</p>
                                    <p className="stat-value">{role.dmgpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG/min</p>
                                    <p className="stat-value" style={{color: role.dmgpmin > 850 ? colors.green : role.dmgpmin > 600 ? colors.yellow : colors.red}}>{role.dmgpmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG %</p>
                                    <p className="stat-value" style={{color: role.dmgshare > 25 ? colors.green : role.dmgshare > 15 ? colors.yellow : colors.red}}>{role.dmgshare}%</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="player-inner-stats">
                    {champions && champions.map(champion => {
                        return (
                            <div className="player" onClick={() => navigate('/champions/' + champion.name)}>
                                <img style={{margin: '5px'}} className="champion-thumbnail-medium" src={images.champions[`${champion.name}_0.jpg`]} alt={champion.name}></img>
                                <p style={{textAlign: 'start', width: '150px', marginLeft: '10px'}}>{champion.name}</p>
                                <div className="roleStat">
                                    <p className="stat-header">Win Rate</p>
                                    <p className="stat-value" style={{color: champion.winRate > 55 ? colors.green : champion.winRate > 45 ? colors.yellow : colors.red}}>{champion.winRate}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Played</p>
                                    <p className="stat-value">{champion.games}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Won</p>
                                    <p className="stat-value" style={{color: colors.green}}>{champion.wins}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Lost</p>
                                    <p className="stat-value" style={{color: colors.red}}>{champion.games - champion.wins}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">KDA</p>
                                    <p className="stat-value" style={{color: champion.kda > 5 ? colors.green : champion.kda > 2 ? colors.yellow : colors.red}}>{champion.kda}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Kills</p>
                                    <p className="stat-value">{champion.kpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Deaths</p>
                                    <p className="stat-value">{champion.dpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Assists</p>
                                    <p className="stat-value">{champion.apg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">KP</p>
                                    <p className="stat-value" style={{color: champion.kp > 70 ? colors.green : champion.kp > 40 ? colors.yellow : colors.red}}>{champion.kp}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">CS</p>
                                    <p className="stat-value">{champion.cspg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">CS/min</p>
                                    <p className="stat-value" style={{color: champion.cspmin > 8.5 ? colors.green : champion.cspmin > 5.5 ? colors.yellow : colors.red}}>{champion.cspmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold</p>
                                    <p className="stat-value">{champion.goldpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold/min</p>
                                    <p className="stat-value" style={{color: champion.goldpmin > 400 ? colors.green : champion.goldpmin > 300 ? colors.yellow : colors.red}}>{champion.goldpmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold %</p>
                                    <p className="stat-value" style={{color: champion.goldshare > 25 ? colors.green : champion.goldshare > 15 ? colors.yellow : colors.red}}>{champion.goldshare}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG</p>
                                    <p className="stat-value">{champion.dmgpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG/min</p>
                                    <p className="stat-value" style={{color: champion.dmgpmin > 850 ? colors.green : champion.dmgpmin > 600 ? colors.yellow : colors.red}}>{champion.dmgpmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG %</p>
                                    <p className="stat-value" style={{color: champion.dmgshare > 25 ? colors.green : champion.dmgshare > 15 ? colors.yellow : colors.red}}>{champion.dmgshare}%</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Player;