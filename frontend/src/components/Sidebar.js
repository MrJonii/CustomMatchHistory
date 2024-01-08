import { Link } from 'react-router-dom'

import './Sidebar.css'

const Sidebar = ({ setSeason }) => {

  const handleSeasonChange = (event) => {
    setSeason(event.target.value);
  }

  return (
      <nav className='sidebar'>
        <ul className='sidebar-items'>
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
          <li>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <select id='season' className='dropdown season-dropdown' style={{marginTop: "550px"}} onChange={handleSeasonChange}>
                <option value='2'>Season 2</option>
                <option value='3' selected={true}>Season 3</option>
              </select>
            </div>
          </li>
        </ul>
      </nav>
  );
}

export default Sidebar