import { useState } from 'react';
import './App.css'
import logo from './assets/logo.png'
import './components/LiquidGlass.css'
import LiquidEffects from './components/LiquidEffects.jsx'
import Launches from './components/Launches.jsx'

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className='whole-page'>
      <LiquidEffects />
      <div className="wrapper">
        <div className="liquidGlass-wrapper">
          <div className="liquidGlass-effect"></div>
          <div className="liquidGlass-tint"></div>
          <div className="liquidGlass-shine" id='sidenav-shine'></div>
          <div className="liquidGlass-text sidenav">
            <div className='logo'>
              <img src={logo} alt='SpaceX Logo' />
            </div>
            <h2 onClick={() => setActiveView('dashboard')}><span className="material-symbols-outlined">home</span>&nbsp;&nbsp;Dashboard</h2>
            <h2 onClick={() => setActiveView('search')}><span className="material-symbols-outlined">search</span>&nbsp;&nbsp;Search</h2>
            <h2><span className="material-symbols-outlined">info</span>&nbsp;&nbsp;About</h2>
          </div>
        </div>
      </div>

      <Launches 
          activeView={activeView}
      />
    </div>
  )
}

export default App
