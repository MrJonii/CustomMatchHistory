import { useState, useEffect } from 'react'

import Match from '../components/Match'

import './MatchHistory.css'

const MatchHistory = ({season}) => 
{
  const [matches, setMatches] = useState([]);
  const [isDetailed, setIsDetailed] = useState('');

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const queryParams = new URLSearchParams(window.location.search);
      setIsDetailed(queryParams.get('id'));

      const response = await fetch(`/api/matches?season=${season}`);
      const json = await response.json();

      if(response.ok)
      {
        setMatches(json);
      }

      setTimeout(() => {
        const target = document.getElementById(queryParams.get('id'));

        if(target)
        {
          console.log('abc');
          target.scrollIntoView({behavior: 'smooth'});
        }
      }, 500)
    }

    fetchMatches();
  }, [season]);

  return (
    <div className="matchHistory">
      {matches && matches.map((match) => {
        return (
          <Match match={match} isDetailed={isDetailed === match.gameId}></Match>
        );
      })}
    </div>
  )
};

export default MatchHistory