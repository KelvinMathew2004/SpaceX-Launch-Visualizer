import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import './components/LiquidGlass.css'
import DistortionEffect from './components/DistortionEffect.jsx'
import Launches from './components/Launches.jsx'

function App() {
  const [searchInput, setSearchInput] = useState("")
  const [filter, setFilter] = useState("")

  return (
    <div className='whole-page'>
      <DistortionEffect />
      <div className="wrapper">
        <div className="liquidGlass-wrapper sidenav">
          <div className="liquidGlass-effect"></div>
          <div className="liquidGlass-tint"></div>
          <div className="liquidGlass-shine"></div>
          <div className="liquidGlass-text">
            <div className='logo'>
              <img src={logo} alt='SpaceX Logo' />
            </div>
            <h2><span className="material-symbols-outlined">home</span>&nbsp;&nbsp;Dashboard</h2>
            <h2><span className="material-symbols-outlined">search</span>&nbsp;&nbsp;Search</h2>
            <h2><span className="material-symbols-outlined">info</span>&nbsp;&nbsp;About</h2>
          </div>
        </div>
      </div>

      <Launches />
    </div>
  )
}

export default App
