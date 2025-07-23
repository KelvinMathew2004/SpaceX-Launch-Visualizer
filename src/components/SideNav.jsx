import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../App.css'
import logo from '../assets/logo.png'
import './LiquidGlass.css'
import LiquidEffects from './LiquidEffects.jsx'

function SideNav() {

    const [activeView, setActiveView] = useState('dashboard');
    const navigate = useNavigate();

    const handleNav = (view) => {
        setActiveView(view);
        navigate('/');
    };

    return (
        <div className='whole-page' style={{ minHeight: "100%" }}>
            <LiquidEffects />
            <div className="sidenav-wrapper">
                <div className="liquidGlass-wrapper">
                <div className="liquidGlass-effect"></div>
                <div className="liquidGlass-tint"></div>
                <div className="liquidGlass-shine" id='sidenav-shine'></div>
                <div className="liquidGlass-text sidenav">
                    <div className='logo'>
                    <img src={logo} alt='SpaceX Logo' />
                    </div>
                    <h2 onClick={() => handleNav('dashboard')}><span className="material-symbols-outlined">home</span>&nbsp;&nbsp;Dashboard</h2>
                    <h2 onClick={() => handleNav('search')}><span className="material-symbols-outlined">search</span>&nbsp;&nbsp;Search</h2>
                    <a href="https://github.com/r-spacex/SpaceX-API/blob/master/README.md"><span className="material-symbols-outlined">info</span>&nbsp;&nbsp;About</a>
                </div>
                </div>
            </div>
            <main style={{ display: "flex", maxWidth: "calc(100vw - 300px - 6rem)", height: "fit-content", flexGrow: 1, flexShrink: 1, position: "relative", left: "calc(300px + 2rem)" }}>
                <Outlet context={{ activeView }} />
            </main>
        </div>
    )
}

export default SideNav