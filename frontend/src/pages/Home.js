import './Home.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const compare = (left, right) => {
  if(left.count > right.count) return -1;
  if(left.count < right.count) return 1;

  if(left.name < right.name) return -1;
  return 1;
}

const Home = ({season}) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () =>
    {
      const response = await fetch(`/api/matches?season=${season}`);
      const json = await response.json();

      if(response.ok)
      {
        setMatches(json);
      }
    }
    fetchMatches();
  }, [season]);

  let blueWins = 0;
  let mvps = [];
  let syzyfs = [];

  for(const m in matches){
    const match = matches[m];

    if(match.win === 'Blue'){
      blueWins++;
    }

    for(const t in match.teams){
      const team = match.teams[t];

      for(const p in team.players){
        const player = team.players[p];

        if(player.mvp !== undefined){
          if(team.side === match.win){
            let found = false;

            for(const m in mvps){
              const mvp = mvps[m];

              if(mvp.id === player.riotId){
                mvp.count++;
                found = true;
              }
            }

            if(!found){
              mvps.push({id: player.riotId, name: player.summonerName, count: 1});
            }
          }
          else{
            let found = false;

            for(const s in syzyfs){
              const syzyf = syzyfs[s];

              if(syzyf.id === player.riotId){
                syzyf.count++;
                found = true;
              }
            }

            if(!found){
              syzyfs.push({id: player.riotId, name: player.summonerName, count: 1});
            }
          }
        }
      }
    }
  }

  const blueWinRate = (100 * blueWins / matches.length).toFixed(0);
  const redWinRate = ((matches.length - blueWins) * 100 / matches.length).toFixed(0);

  mvps.sort(compare);
  syzyfs.sort(compare);

  return (
    <div className="home">
      <div className='home-sideWinRate-container'>
        <div className="home-sideWinRate blue">
          <p>BLUE</p>
          <p>{blueWinRate}%</p>
        </div>
        <div className="home-sideWinRate red">
          <p>RED</p>
          <p>{redWinRate}%</p>
        </div>
      </div>

      <p className='home-mvp'>MVP</p>
      <div className="home-mvp-container">
      {mvps && mvps.map(mvp => {
        return (
          <Link to={'/players/' + mvp.id} className="home-player-container">
            <p>{mvp.name}</p>
            <p>{mvp.count}</p>
          </Link>
        )
      })}
      </div>
      <p style={{marginTop: '48px'}} className='home-mvp'>SYZYF</p>
      <div className="home-mvp-container">
      {syzyfs && syzyfs.map(syzyf => {
        return (
          <Link to={'/players/' + syzyf.id} className="home-player-container">
            <p>{syzyf.name}</p>
            <p>{syzyf.count}</p>
          </Link>
        )
      })}
      </div>
    </div>
  )
};

export default Home