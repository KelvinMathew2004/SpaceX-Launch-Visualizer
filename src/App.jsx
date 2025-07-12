import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import LiquidGlass from 'liquid-glass-react'

function App() {

  return (
    <div className='whole-page'>
      <LiquidGlass className='sidenav' cornerRadius={10} padding={40}>
        <div className='logo'>
          {/* <h1>📊</h1> */}
          <img src={logo} alt='SpaceX Logo' />
        </div>
        <h2><span className="material-symbols-outlined">home</span>&nbsp;&nbsp;Dashboard</h2>
        <h2><span className="material-symbols-outlined">search</span>&nbsp;&nbsp;Search</h2>
        <h2><span className="material-symbols-outlined">info</span>&nbsp;&nbsp;About</h2>
      </LiquidGlass>
      <div className='content'>
        <div className='stats'>

        </div>
      </div>
    </div>
  )
}

export default App
