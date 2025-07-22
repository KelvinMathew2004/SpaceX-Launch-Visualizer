import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LaunchDetail from './components/LaunchDetail'
import NotFound from './components/NotFound'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <Routes>
      <Route path="/" >
        <Route index element={<App />} />
        <Route path="launches/:launchId" element={<LaunchDetail />} />
      </Route>
      <Route path="*" element={ <NotFound /> } />
    </Routes>
  </BrowserRouter>
)