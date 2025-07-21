import { useState } from 'react';
import '../App.css'
import logo from '../assets/logo.png'
import './LiquidGlass.css'
import LiquidEffects from './LiquidEffects.jsx'

function SideNav({ setActiveView }) {

  return (
    <div style={{ minHeight: "100%" }}>
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
            <a href="https://github.com/r-spacex/SpaceX-API/blob/master/README.md"><span className="material-symbols-outlined">info</span>&nbsp;&nbsp;About</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideNav