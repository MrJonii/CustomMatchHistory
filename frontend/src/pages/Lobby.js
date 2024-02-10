import { useState, useEffect } from 'react'

import './Lobby.css'

import {images} from '../resources'

function toggleOptions(id) 
{
    let options = document.querySelector(`#${id}`);
    options.style.display = options.style.display === 'none' ? 'block' : 'none';
  }

function selectOption(id, option)
{
    let selectedOption = document.querySelector(`#${id}`);
    console.log(selectedOption)
    selectedOption.innerHTML = option.innerHTML;
    toggleOptions();
}


function compare(left, right)
{
    // Descending
    if(left.games > right.games) return -1;
    if(left.games < right.games) return 1;

    // Descending
    if(left.wins > right.wins) return -1;
    if(left.wins < right.wins) return 1;

    // Ascending
    if(left.name< right.name) return -1;
    if(left.name > right.name) return 1;

    return 0;
}

const Lobby = () => 
{
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const response = await fetch(`/api/matches`);
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
                    player.top = [];
                    player.jg = [];
                    player.mid = [];
                    player.adc = [];
                    player.supp = [];

                    tempPlayers.push(player)
                }

                let champion = null;

                if(participant.role === 'Top'){
                    champion = player.top.find(c => c.name === participant.champion);
                }else if(participant.role === 'Jungle'){
                    champion = player.jg.find(c => c.name === participant.champion);
                }else if(participant.role === 'Mid'){
                    champion = player.mid.find(c => c.name === participant.champion);
                }else if(participant.role === 'Adc'){
                    champion = player.adc.find(c => c.name === participant.champion);
                }else if(participant.role === 'Support'){
                    champion = player.supp.find(c => c.name === participant.champion);
                }

                if(!champion){
                    champion = {name: participant.champion, games: 0, wins: 0};
                }

                if(participant.role === 'Top'){
                    player.top.push(champion);
                }else if(participant.role === 'Jungle'){
                    player.jg.push(champion);
                }else if(participant.role === 'Mid'){
                    player.mid.push(champion);
                }else if(participant.role === 'Adc'){
                    player.adc.push(champion);
                }else if(participant.role === 'Support'){
                    player.supp.push(champion);
                }

                champion.games++;

                if(match.win === team.side){
                    champion.wins++;
                }
            }
        }
      }

      for(let p in tempPlayers)
      {
        let player = tempPlayers[p]

        player.top.sort(compare);
        player.jg.sort(compare);
        player.mid.sort(compare);
        player.adc.sort(compare);
        player.supp.sort(compare);
    }

      setPlayers(tempPlayers);
    }

    fetchMatches();
  }, []);

  const handlePlayerChange = (event) => {
    let select = event.target;

    if(select.options[0].value === 'null'){
        select.remove(0);
    }

    const player = players.find(p => p.riotId === select.value);

    let champion = null;

    if(select.classList.contains('role-top')){
        champion = player.top.length > 0 ? player.top[0] : null;
    }else if(select.classList.contains('role-jg')){
        champion = player.jg.length > 0 ? player.jg[0] : null;
    }else if(select.classList.contains('role-mid')){
        champion = player.mid.length > 0 ? player.mid[0] : null;
    }else if(select.classList.contains('role-adc')){
        champion = player.adc.length > 0 ? player.adc[0] : null;
    }else if(select.classList.contains('role-supp')){
        champion = player.supp.length > 0 ? player.supp[0] : null;
    }

    select.style.background = `url(resources/champions/${champion ? champion.name : 'Yuumi'}_0.jpg) center/cover`;
    let element = document.querySelector(`#${'lp' + select.id[2]}`);
    element.innerHTML = player.summonerName;
  }

  const handleClick = (event) => {
    event.target.style.backgroundColor = '#202020'
  }

  return (
    <div className="lobby">
        <img src={images.lobby['lobby.png']} alt='lobby' style={{width: '1000px', height: '1000px'}}></img>
        <select id='ls1' className='lobby-select role-top' style={{transform: 'translate(-400%, 360%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>TOP</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp1' className="player-text" style={{transform: 'translate(-120%, 1350%)'}}></p>
        <select id='ls2' className='lobby-select role-top' style={{transform: 'translate(-320%, 290%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>TOP</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp2' className="player-text" style={{transform: 'translate(-95%, 700%)'}}></p>
        <select id='ls3' className='lobby-select role-jg' style={{transform: 'translate(-280%, 610%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>JUNGLE</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp3' className="player-text" style={{transform: 'translate(-85%, 1630%)'}}></p>
        <select id='ls4' className='lobby-select role-jg' style={{transform: 'translate(40%, 370%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>JUNGLE</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select> 
        <p id='lp4' className="player-text" style={{transform: 'translate(10%, 930%)'}}></p>           
        <select id='ls5' className='lobby-select role-mid' style={{transform: 'translate(10%, 750%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>MID</option>
                {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp5' className="player-text" style={{transform: 'translate(0%, 2450%)'}}></p>
        <select id='ls6' className='lobby-select role-mid' style={{transform: 'translate(100%, 670%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>MID</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp6'className="player-text" style={{transform: 'translate(30%, 1800%)'}}></p>
        <select id='ls7' className='lobby-select role-adc' style={{transform: 'translate(430%, 1210%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>ADC</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp7'className="player-text" style={{transform: 'translate(90%, 3350%)'}}></p>
        <select id='ls8' className='lobby-select role-supp' style={{transform: 'translate(510%, 1300%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>SUPP</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp8'className="player-text" style={{transform: 'translate(150%, 3100%)'}}></p>
        <select id='ls9' className='lobby-select role-adc' style={{transform: 'translate(520%, 1130%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>ADC</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp9' className="player-text" style={{transform: 'translate(150%, 4050%)'}}></p>
        <select id='lp10' className='lobby-select role-supp' style={{transform: 'translate(600%, 1220%)'}} onChange={handlePlayerChange} onClick={handleClick}>
            <option value='null'>SUPP</option>
            {players && players.map(player => {
                return (
                    <option value={player.riotId}>{player.summonerName}</option>
                )
            })}
        </select>
        <p id='lp10' className="player-text" style={{transform: 'translate(220%, 3800%)'}}></p>
    </div>
  )
};

export default Lobby;