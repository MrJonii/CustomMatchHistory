import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import MatchHistory from './pages/MatchHistory'
import Players from './pages/Players'
import Player from './pages/Player'
import Champions from './pages/Champions'
import Champion from './pages/Champion'
import Leaderboards from './pages/Leaderboards'
import Records from './pages/Records'

import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar></Sidebar>
        <div className="pages">
          <Routes>
            <Route path="/" element={<MatchHistory/>}/>
            <Route path="/match-history" element={<MatchHistory/>}/>
            <Route path="/match-history/:id" element={<MatchHistory/>}/>
            <Route path="/players" element={<Players/>}/>
            <Route path="/players/:id" element={<Player/>}/>
            <Route path="/champions" element={<Champions/>}/>
            <Route path="/champions/:id" element={<Champion/>}/>
            <Route path="/leaderboards" element={<Leaderboards/>}/>
            <Route path="/records" element={<Records/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
