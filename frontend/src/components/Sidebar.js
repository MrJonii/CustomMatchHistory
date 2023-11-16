import { Link } from 'react-router-dom'

import './Sidebar.css'

const Sidebar = () => {
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
      </ul>
    </nav>
  );
}

export default Sidebar