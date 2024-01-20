import { useState } from 'react'
import * as CgIcons from 'react-icons/cg'

import Team from './Team'

import './Match.css'

const Match = (props) => 
{
  const [isDetailed, setIsDetailed] = useState(false);

  const handleToggleDetails = () => {
    setIsDetailed(!isDetailed)
  }

  const minutes = Math.floor(props.match.duration / 60);
  const seconds = props.match.duration - minutes * 60;

  return (
    <div className='match'>
      {isDetailed && <p className='duration'>{ minutes }:{ seconds < 10 ? '0' : '' }{ seconds }</p>}
      <div className='match-teamContainer'>
        {props.match.teams && props.match.teams.map((team) => {
          return (
            <Team team={team} win={team.side === props.match.win} duration={props.match.duration} isDetailed={isDetailed}></Team>
          );
        })}
      </div>
      <span className='match-details-toggle' onClick={handleToggleDetails}>
        <p>{isDetailed ? 'Hide Details' : 'Show Details'}</p>
        <CgIcons.CgDetailsMore color='#F0F0F0'></CgIcons.CgDetailsMore>
      </span>
    </div>
  );
};

export default Match;