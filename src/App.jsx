import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import './components/LiquidGlass.css'
import DistortionEffect from './components/DistortionEffect.jsx'

function App() {

  return (
    <div className='whole-page'>
      <DistortionEffect />
      <div className='sidenav wrapper'>
        <div className="effect"></div>
        <div className="tint"></div>
        <div className="shine"></div>
        <div className="text">
          <div className='logo'>
            <img src={logo} alt='SpaceX Logo' />
          </div>
          <h2><span className="material-symbols-outlined">home</span>&nbsp;&nbsp;Dashboard</h2>
          <h2><span className="material-symbols-outlined">search</span>&nbsp;&nbsp;Search</h2>
          <h2><span className="material-symbols-outlined">info</span>&nbsp;&nbsp;About</h2>
        </div>
      </div>
      <div className='content'>
        <div className='stats'>

        </div>
      </div>
    </div>
  )
}

export default App
