import { Link } from 'react-router-dom'

import images from '../resources'

import './PlayerPreview.css'

const red = '#E76161'
const yellow = '#FF9130'
const green = '#9CA777'

const PlayerPreview = ( {player} ) => {

    const winRateColor = player.winRate > 55 ? green : player.winRate > 45 ? yellow : red;

    return <div className="playerPreview">
                <p className='name'>{player.summonerName}</p>
                <p className='stat'>{player.games}</p>
                <p className='stat' style={{color: green}}>{player.wins}</p>
                <p className='stat' style={{color: red}}>{player.games - player.wins}</p>
                <p className='stat' style={{color: winRateColor, width: '75px'}}>{player.winRate}%</p>
                <div className="container">
                    {player.roles && player.roles.map(role => {
                        return (
                            <img className="role-thumbnail-small" src={images.roles[`${role.name}.png`]} alt={role.name}></img>
                        )
                    })}
                </div>
                <div className="container">
                    {player.champions && player.champions.map(champion => {
                        return (
                            <Link to='#'>
                                <img className="champion-thumbnail-small" src={images.champions[`${champion.name}_0.jpg`]} alt={champion.name}></img>
                            </Link>
                        )
                    })}
                </div>
        </div>
};

export default PlayerPreview;