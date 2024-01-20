import { Link } from 'react-router-dom'

import {images} from '../resources'

import './Participant.css'

const Participant = (props) => 
{
  if (!props.isDetailed)
  {
    return (
      <div className='participant-shared participant'>
          <Link to={'/champions/' +  props.player.champion}>
            <img className={ props.player.mvp !== undefined ? "champion-thumbnail mvp" : "champion-thumbnail"} src={images.champions[`${props.player.champion}_0.jpg`]} alt='champion'></img>
          </Link>
          <Link to={'/players/' + props.player.riotId}>{props.player.summonerName}</Link>
    </div>
    );
  }
  else 
  {
    const takedowns = props.player.assists + props.player.kills;

    const red = '#E76161'
    const yellow = '#FF9130'
    const green = '#9CA777'

    const kda = props.player.deaths === 0 ? (Math.round((props.player.kills + props.player.assists) * 100) / 100).toFixed(1) : (Math.round(((props.player.kills + props.player.assists) / props.player.deaths) * 100) / 100).toFixed(1);
    const kp = props.teamKills === 0 ? 0 : Math.round(takedowns / props.teamKills * 100)
    const cspermin = (Math.round((props.player.cs / (props.duration / 60)) * 100) / 100).toFixed(1);
    const goldpermin = Math.round(props.player.gold / (props.duration / 60));
    const dmgpermin = Math.round((props.player.damageDealt / (props.duration / 60)));
    const goldshare = ((props.player.gold / props.teamGold) * 100).toFixed(2);
    const dmgshare = ((props.player.damageDealt / props.teamDamage) * 100).toFixed(2);

    return (
        <div className='participant-shared participant-detailed'>
          <Link to={'/champions/' +  props.player.champion}>
            <img className="champion-thumbnail" src={images.champions[`${props.player.champion}_0.jpg`]} alt='champion'></img>
          </Link>
          <Link to={'/players/' + props.player.riotId} className='summonerName' style={{ width: '150px' }}>{props.player.summonerName}</Link>
          <div className="stat" style={{ width: '85px' }}>
            <p>{props.player.kills}/{props.player.deaths}/{props.player.assists}</p>
            <p className='stat-small' style={{ color: kda > 5 ? green : kda > 2 ? yellow : red}}>{kda}</p>
            <p className='stat-small' style={{ color: kp > 70 ? green : kp > 40 ? yellow : red }}>{kp}%</p>
          </div>
          <div className="stat" style={{ width: '85px' }}>
            <p>{props.player.cs}</p>
            <p className='stat-small' style={{ color: cspermin > 8.5 ? green : cspermin > 5.5 ? yellow : red}}>{cspermin}/min</p>
          </div>
          <div className="stat" style={{ width: '85px' }}>
            <p>{props.player.gold}</p>
            <p className='stat-small' style={{ color: goldpermin > 400 ? green : goldpermin > 300 ? yellow : red}}>{goldpermin}/min</p>
            <p className='stat-small' style={{ color: goldshare > 25 ? green : goldshare > 15 ? yellow : red}}>{goldshare}%</p>
          </div>
          <div className="stat" style={{ width: '85px' }}>
            <p>{props.player.damageDealt}</p>
            <p className='stat-small' style={{ color: dmgpermin > 850 ? green : dmgpermin > 600 ? yellow : red}}>{dmgpermin}/min</p>
            <p className='stat-small' style={{ color: dmgshare > 25 ? green : dmgshare > 15 ? yellow : red}}>{dmgshare}%</p>
          </div>
          <p className='stat' style={{ width: '85px' }}>{props.player.damageTaken}</p>
          <p className='stat' style={{ width: '35px' }}>{props.player.visionScore}</p>
      </div>
    );
  }

};

export default Participant;