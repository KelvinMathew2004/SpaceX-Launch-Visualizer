import { useState } from 'react';
import './App.css'
import './components/LiquidGlass.css'
import SideNav from './components/SideNav.jsx'
import Launches from './components/Launches.jsx'

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({});
  const [timeRange, setTimeRange] = useState({ min: 2006, max: 2022 });
  const yearBounds = { min: 2006, max: 2022 };

  const handleFilterChange = (filterKey) => {
    if (filterKey === 'all') {
      setFilters({});
      return;
    }
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey]
    }));
  };

  return (
    <div className='whole-page'>
      <SideNav setActiveView={setActiveView} />

      <Launches 
          activeView={activeView}
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          filters={filters}
          onFilterChange={handleFilterChange}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          yearBounds={yearBounds}
      />
    </div>
  )
}

export default App
