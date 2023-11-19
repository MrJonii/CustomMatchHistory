import { useNavigate } from 'react-router-dom'

import {images, colors} from '../resources'

import './ChampionPreview.css'

const ChampionPreview = ( {champion} ) => {

    const navigate = useNavigate();

    return <div className="championPreview" onClick={ () => navigate('/champions/' + champion.name) }>
           <img className="champion-thumbnail-small" src={images.champions[`${champion.name}_0.jpg`]} alt={champion.name} style={{margin: '5px'}}></img>
           <p className='name'>{champion.name}</p>
           <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Presence</p>
                <p className="stat-value">{champion.presence}%</p>
            </div>
            <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Pick Rate</p>
                <p className="stat-value">{champion.pickRate}%</p>
            </div>
            <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Ban Rate</p>
                <p className="stat-value">{champion.banRate}%</p>
            </div>
            <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Win Rate</p>
                <p className="stat-value">{isNaN(champion.winRate) ? '-' : champion.winRate + '%'}</p>
            </div>
            <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Picked</p>
                <p className="stat-value" style={{color: colors.green}}>{champion.games}</p>
            </div>
            <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Banned</p>
                <p className="stat-value" style={{color: colors.red}}>{champion.bans}</p>
            </div>
            <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Won</p>
                <p className="stat-value" style={{color: colors.green}}>{champion.wins}</p>
            </div>
            <div className="stat" style={{margin: '0 5px'}}>
                <p className="stat-header">Lost</p>
                <p className="stat-value" style={{color: colors.red}}>{champion.games - champion.wins}</p>
            </div>
        </div>
};

export default ChampionPreview;