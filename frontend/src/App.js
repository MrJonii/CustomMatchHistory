import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Home from './pages/Home'
import MatchHistory from './pages/MatchHistory'
import Players from './pages/Players'
import Player from './pages/Player'
import Champions from './pages/Champions'
import Champion from './pages/Champion'
import Leaderboards from './pages/Leaderboards'
import Records from './pages/Records'
import Lobby from './pages/Lobby'

import Sidebar from './components/Sidebar'

function App() {
  const [season, setSeason] = useState(3);

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar setSeason={setSeason}></Sidebar>
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home season={season}/>}/>
            <Route path="/match-history" element={<MatchHistory season={season}/>}/>
            <Route path="/match-history/:id" element={<MatchHistory season={season}/>}/>
            <Route path="/players" element={<Players season={season}/>}/>
            <Route path="/players/:id" element={<Player season={season}/>}/>
            <Route path="/champions" element={<Champions season={season}/>}/>
            <Route path="/champions/:id" element={<Champion season={season}/>}/>
            <Route path="/leaderboards" element={<Leaderboards season={season}/>}/>
            <Route path="/records" element={<Records season={season}/>}/>
            <Route path="/lobby" element={<Lobby/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
