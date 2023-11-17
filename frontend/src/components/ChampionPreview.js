import { Link } from 'react-router-dom'

import images from '../resources'

import './ChampionPreview.css'

const red = '#E76161'
const yellow = '#FF9130'
const green = '#9CA777'

const ChampionPreview = ( {champion} ) => {
    return <div className="championPreview">
           <img className="champion-thumbnail-small" src={images.champions[`${champion.name}_0.jpg`]} alt={champion.name} style={{margin: '5px'}}></img>
           <p className='name'>{champion.name}</p>
           <p className='stat'>{champion.presence}%</p>
           <p className='stat'>{champion.pickRate}%</p>
           <p className='stat'>{isNaN(champion.banRate) ? '' : champion.banRate + '%'}</p>
           <p className='stat'>{isNaN(champion.winRate) ? '' : champion.winRate + '%'}</p>
           <p className='stat' style={{color: green}}>{champion.games}</p>
           <p className='stat' style={{color: red}}>{champion.bans}</p>
           <p className='stat' style={{color: green}}>{champion.wins}</p>
           <p className='stat' style={{color: red}}>{champion.games - champion.wins}</p>
        </div>
};

export default ChampionPreview;