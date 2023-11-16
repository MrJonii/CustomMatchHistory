import { useState, useEffect } from 'react'

import Match from '../components/Match'

import './MatchHistory.css'

const MatchHistory = () => 
{
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const response = await fetch('/api/matches');
      const json = await response.json();

      if(response.ok)
      {
        setMatches(json)
      }
    }

    fetchMatches();
  }, []);

  return (
    <div className="matchHistory">
      {matches && matches.map((match) => {
        return (
          <Match match={match}></Match>
        );
      })}
    </div>
  )
};

export default MatchHistory