import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {images, colors} from '../resources';

import './Champion.css';

function compare(left, right)
{
    // Descending
    if(left.picks > right.picks) return -1;
    if(left.picks < right.picks) return 1;

    // Descending
    if(left.wins > right.wins) return -1;
    if(left.wins < right.wins) return 1;

    // Descending
    if(Number(left.kda) > Number(right.kda)) return -1;
    if(Number(left.kda) < Number(right.kda)) return 1;

    // Ascending
    if(left.summonerName < right.summonerName) return -1;
    if(left.summonerName > right.summonerName) return 1;

    return 0;
}

const Champion = () => {
    const { id } = useParams();

    const [players, setPlayers] = useState([]);
    const [wins, setWins] = useState(0);
    const [bans, setBans] = useState(0);
    const [picks, setPicks] = useState(0);
    const [matchCount, setMatchCount] = useState(0);

    useEffect(() => {
        const fetchMatches = async () =>
        {
          const response = await fetch('/api/matches');
          const json = await response.json();

          if(!response.ok)
          {
            return;
          }
    
          let tempPlayers = [];
          let tempWins = 0;
          let tempBans = 0;
          let tempPicks = 0;

          setMatchCount(json.length);
    
          for(let m in json)
          {
            const match = json[m];
    
            for(let t in match.teams)
            {
                const team = match.teams[t];
    
                for(let b in team.bans)
                {
                    const ban = team.bans[b];

                    if(ban === id)
                    {
                        tempBans++;
                    }
                }

                for(let p in team.players)
                {
                  const participant = team.players[p];
                  
                  if(participant.champion !== id)
                  {
                    continue;
                  }

                  let player = tempPlayers.find(x => x.riotId === participant.riotId);

                  if(!player)
                  {
                    player = {};
                    player.riotId = participant.riotId;
                    player.summonerName = participant.summonerName;

                    player.picks = 0;
                    player.wins = 0;
                    player.kills = 0;
                    player.deaths = 0;
                    player.assists = 0;
                    player.cs = 0;
                    player.gold = 0;
                    player.dmg = 0;
                    player.teamGold = 0;
                    player.teamDmg = 0;
                    player.teamKills = 0;
                    player.duration = 0;

                    tempPlayers.push(player);
                  }

                  tempPicks++;
                  player.picks++;

                  if(match.win === team.side)
                  {
                    tempWins++;
                    player.wins++;
                  }

                  player.kills += participant.kills;
                  player.deaths += participant.deaths;
                  player.assists += participant.assists;
                  player.cs += participant.cs;
                  player.gold += participant.gold;
                  player.dmg += participant.damageDealt;
                  player.duration += match.duration;
                  
                  for(let i in team.players)
                  {
                    player.teamGold += team.players[i].gold;
                    player.teamDmg += team.players[i].damageDealt;
                    player.teamKills += team.players[i].kills;
                  }
                }
            }
          }

          for(let p in tempPlayers)
          {
            let player = tempPlayers[p];

            player.winRate = (100 * player.wins / player.picks).toFixed(1);
            player.takedowns = player.kills + player.assists;
            player.kp = (100 * player.takedowns / player.teamKills).toFixed(1);
            player.kda = player.deaths === 0 ? player.takedowns : (player.takedowns / player.deaths).toFixed(1);
            player.kpg = (player.kills / player.picks).toFixed(1);
            player.dpg = (player.deaths / player.picks).toFixed(1);
            player.apg = (player.assists / player.picks).toFixed(1);
            player.cspg = (player.cs / player.picks).toFixed(1);
            player.goldpg = (player.gold / player.picks).toFixed(1);
            player.dmgpg = (player.dmg / player.picks).toFixed(1);
            
            const duration = player.duration / 60;

            player.cspmin = (player.cs / duration).toFixed(1);
            player.goldpmin = (player.gold / duration).toFixed(1);
            player.dmgpmin = (player.dmg / duration).toFixed(1);
            player.goldshare = (100 * player.gold / player.teamGold).toFixed(1);
            player.dmgshare = (100 * player.dmg / player.teamDmg).toFixed(1);
          }

          tempPlayers.sort(compare);

          setWins(tempWins);
          setBans(tempBans);
          setPicks(tempPicks);
          setPlayers(tempPlayers);
        }

        fetchMatches();
    }, [id]);

    const presence = (100 * (picks + bans) / matchCount).toFixed(1);
    const winRate = (100 * wins / picks).toFixed(1);
    const pickRate = (100 * picks / matchCount).toFixed(1);
    const banRate = (100 * bans / matchCount).toFixed(1);
    const loses = picks - wins;

    const navigate = useNavigate();

    return (
        <div className='champion'>
            <div className="champion-inner">
                <div className="champion-inner-header">
                    <img style={{margin: '10px 20px'}} className="champion-thumbnail" src={images.champions[`${id}_0.jpg`]} alt={id}></img>
                    <p className="championName">{id}</p>
                        <div className="champion-inner-keyStats-container">
                            <div className="champion-inner-keyStats">
                                <div className="stat">
                                    <p className="stat-header">Presence</p>
                                    <p className="stat-value"style={{color: presence > 45 ? colors.green : presence > 20 ? colors.yellow : colors.red}}>{presence}%</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-header">Pick Rate</p>
                                    <p className="stat-value">{pickRate}%</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-header">Ban Rate</p>
                                    <p className="stat-value">{banRate}%</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-header">Win Rate</p>
                                    <p className="stat-value" style={{color: winRate > 55 ? colors.green : winRate > 45 ? colors.yellow : colors.red}}>{isNaN(winRate) ? '' : winRate + '%'}</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-header">Banned</p>
                                    <p className="stat-value" style={{color: colors.red}}>{bans}</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-header">Played</p>
                                    <p className="stat-value" style={{color: colors.green}}>{picks}</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-header">Won</p>
                                    <p className="stat-value" style={{color: colors.green}}>{wins}</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-header">Lost</p>
                                    <p className="stat-value" style={{color: colors.red}}>{loses}</p>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="champion-inner-playerStats">
                    {players && players.map(player => {
                        return (
                            <div className="player" onClick={() => navigate('/players/' + player.riotId)}>
                                <p style={{textAlign: 'start', width: '150px'}}>{player.summonerName}</p>
                                <div className="roleStat">
                                    <p className="stat-header">Win Rate</p>
                                    <p className="stat-value" style={{color: player.winRate > 55 ? colors.green : player.winRate > 45 ? colors.yellow : colors.red}}>{player.winRate}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Played</p>
                                    <p className="stat-value">{player.picks}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Won</p>
                                    <p className="stat-value" style={{color: colors.green}}>{player.wins}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Lost</p>
                                    <p className="stat-value" style={{color: colors.red}}>{player.picks - player.wins}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">KDA</p>
                                    <p className="stat-value" style={{color: player.kda > 5 ? colors.green : player.kda > 2 ? colors.yellow : colors.red}}>{player.kda}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Kills</p>
                                    <p className="stat-value">{player.kpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Deaths</p>
                                    <p className="stat-value">{player.dpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Assists</p>
                                    <p className="stat-value">{player.apg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">KP</p>
                                    <p className="stat-value" style={{color: player.kp > 70 ? colors.green : player.kp > 40 ? colors.yellow : colors.red}}>{player.kp}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">CS</p>
                                    <p className="stat-value">{player.cspg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">CS/min</p>
                                    <p className="stat-value" style={{color: player.cspmin > 8.5 ? colors.green : player.cspmin > 5.5 ? colors.yellow : colors.red}}>{player.cspmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold</p>
                                    <p className="stat-value">{player.goldpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold/min</p>
                                    <p className="stat-value" style={{color: player.goldpmin > 400 ? colors.green : player.goldpmin > 300 ? colors.yellow : colors.red}}>{player.goldpmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">Gold %</p>
                                    <p className="stat-value" style={{color: player.goldshare > 25 ? colors.green : player.goldshare > 15 ? colors.yellow : colors.red}}>{player.goldshare}%</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG</p>
                                    <p className="stat-value">{player.dmgpg}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG/min</p>
                                    <p className="stat-value" style={{color: player.dmgpmin > 850 ? colors.green : player.dmgpmin > 600 ? colors.yellow : colors.red}}>{player.dmgpmin}</p>
                                </div>
                                <div className="roleStat">
                                    <p className="stat-header">DMG %</p>
                                    <p className="stat-value" style={{color: player.dmgshare > 25 ? colors.green : player.dmgshare > 15 ? colors.yellow : colors.red}}>{player.dmgshare}%</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Champion;