import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import MatchHistory from './pages/MatchHistory'
import Champions from './pages/Champions'
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
            <Route path="/" element={<Home/>}/>
            <Route path="/match-history" element={<MatchHistory/>}/>
            <Route path="/champions" element={<Champions/>}/>
            <Route path="/leaderboards" element={<Leaderboards/>}/>
            <Route path="/records" element={<Records/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
