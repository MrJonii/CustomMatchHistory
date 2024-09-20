import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import './Sidebar.css'

const Sidebar = ({ setSeason }) => {

  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const response = await fetch(`/api/matches`);
      const json = await response.json();

      if(!response.ok)
      {
        return;
      }

      let tempPlayers = [];

      for(let m in json)
      {
        const match = json[m];

        for(let t in match.teams)
        {
            const team = match.teams[t];

            for(let p in team.players)
            {
              const participant = team.players[p];
              
              let player = tempPlayers.find(x => x.id === participant.riotId);

              if(!player)
              {
                player = {};
                
                player.id = participant.riotId;
                player.name = participant.summonerName;

                tempPlayers.push(player);
              }
            }
        }
      }

      setPlayers(tempPlayers);
      setUser(Cookies.get('user'));
    }

    fetchMatches();
}, []);

  const handleSeasonChange = (event) => {
    setSeason(event.target.value);
  }

  const handleUserChange = (event) => {
    Cookies.set('user', event.target.value, { expires: 365 })
    setUser(event.target.value);
  }

  return (
      <nav className='sidebar'>
        <ul className='sidebar-items'>
        <li className='sidebar-item'>
            <Link to='/'>
              <span>Home</span>
            </Link>
          </li>
          <li className='sidebar-item'>
            <Link to='/match-history'>
              <span>Match History</span>
            </Link>
          </li>
          <li className='sidebar-item'>
            <Link to='/players'>
              <span>Players</span>
            </Link>
          </li>
          <li className='sidebar-item'>
            <Link to='/champions'>
              <span>Champions</span>
            </Link>
          </li>
          <li className='sidebar-item'>
            <Link to='/leaderboards'>
              <span>Leaderboards</span>
            </Link>
          </li>
          <li className='sidebar-item'>
            <Link to='/records'>
              <span>Records</span>
            </Link>
          </li>
          <li className='sidebar-item'>
            <Link to='/lobby'>
              <span>Lobby</span>
            </Link>
          </li>
          <li>
            <div style={{ margin: '16px 0px', display: 'flex', justifyContent: 'center'}}>
              <select className='dropdown season-dropdown' onChange={handleSeasonChange}>
                <option value='2'>Season 2</option>
                <option value='3'>Season 3</option>
                <option value='4' selected={true}>Season 4</option>
              </select>
            </div>
          </li>
          <li>
            <div style={{ margin: '16px 0px', display: 'flex', justifyContent: 'center'}}>
              <select className='dropdown season-dropdown' onChange={handleUserChange} value={user}>
                <option value=''>SELECT</option>
                { players && players.map(player => {
                  return (
                    <option value={player.id}>{player.name}</option>
                  )
                }) }
              </select>
            </div>
          </li>
        </ul>
      </nav>
  );
}

export default Sidebar