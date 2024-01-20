import { Link } from 'react-router-dom'
import * as GiIcons from 'react-icons/gi'
import * as AiIcons from 'react-icons/ai'

import {images} from '../resources'

import Participant from "./Participant";

import './Team.css'

const Team = (props) => 
{
  if(!props.isDetailed)
  {
    return (
      <div className="team">
        <p className={'team-resultText' + (props.win ? ' team-resultText-victory' : ' team-resultText-defeat')}>{props.win ? 'VICTORY' : 'DEFEAT'}</p>
        <div className='team-playerContainer'>
          {props.team.players && props.team.players.map((player) => {
            return (
              <Participant player={player} isDetailed={false}></Participant>
            );
          })}
        </div>
      </div>
    );
  }
  else
  {
    let kills = 0;
    let gold = 0;
    let damage = 0;

    for(const i in props.team.players)
    {
      kills += props.team.players[i].kills;
      gold += props.team.players[i].gold;
      damage += props.team.players[i].damageDealt;
    }

    return (
      <div className='team-detailed-playerContainer'>
        <p className={'team-resultText' + (props.win ? ' team-resultText-victory' : ' team-resultText-defeat')}>{props.win ? 'VICTORY' : 'DEFEAT'}</p>
        <div className='team-detailed-teamStats'>
          <div className="bansContainer">
            <p>BANS</p>
            {props.team.bans && props.team.bans.map((ban) => {
              return (
                <Link to={'/champions/' + ban}>
                  <img className="champion-thumbnail-small" src={images.champions[`${ban}_0.jpg`]} alt='champion' style={{ marginRight: '5px', marginTop: '5px' }}></img>
                </Link>
              )
            })}
          </div>
          <div className="killsContainer">
            <GiIcons.GiCrossedSwords style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '5px', marginRight: '5px' }}></GiIcons.GiCrossedSwords>
            <p>{kills}</p>
          </div>
          <div className="goldContainer">
            <GiIcons.GiGoldBar style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '5px', marginRight: '5px' }}></GiIcons.GiGoldBar>
            <p>{gold}</p>
          </div>
        </div>
        <div className="team-detailed-header">
          <GiIcons.GiDeathSkull style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '230px' }}></GiIcons.GiDeathSkull>
          <GiIcons.GiBullyMinion style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '55px' }}></GiIcons.GiBullyMinion>
          <GiIcons.GiGoldBar style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '55px' }}></GiIcons.GiGoldBar>
          <GiIcons.GiBloodySword style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '55px' }}></GiIcons.GiBloodySword>
          <GiIcons.GiBleedingWound style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '60px' }}></GiIcons.GiBleedingWound>
          <AiIcons.AiFillEye style={{ color:'#F0F0F0', width: '32px', height: '32px', marginLeft: '40px' }}></AiIcons.AiFillEye>
        </div>
          {props.team.players && props.team.players.map((player) => {
            return (
              <Participant player={player} teamKills={kills} teamGold={gold} teamDamage={damage} duration={props.duration} isDetailed={true}></Participant>
            );
          })}
        </div>
    )
  }
  
};

export default Team;