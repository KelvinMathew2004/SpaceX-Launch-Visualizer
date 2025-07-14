import { useEffect, useState, useMemo } from "react";
import './Launches.css';
import LiquidEffects from "./LiquidEffects.jsx";
import StatsCard from "./StatsCard.jsx";
import SearchBar from "./SearchBar.jsx";

const Launches = ({activeView}) => {
    const [allLaunches, setAllLaunches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [filter, setFilter] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchAllLaunchesWithDetails = async () => {
            try {
                setIsLoading(true);
                
                const response = await fetch("https://api.spacexdata.com/v5/launches/query", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: {},
                        options: {
                            limit: 1000, 
                            populate: [
                                {
                                    path: "rocket",
                                    select: { "name": 1 }
                                }
                            ]
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error!`);
                }

                const data = await response.json();
                setAllLaunches(data.docs);

            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllLaunchesWithDetails();
    }, []);

    useEffect(() => {
        if (activeView === 'search') {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsAnimating(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
        }
    }, [activeView]);

    const filteredLaunches = useMemo(() => {
        if (!allLaunches.length) return [];
        let launches = [...allLaunches];
        if (searchInput) {
            launches = launches.filter(launch =>
                launch.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                (launch.details && launch.details.toLowerCase().includes(searchInput.toLowerCase()))
            );
        }
        if (filter) {
            launches = launches.filter(launch => {
                if (filter === 'success') return launch.success === true;
                if (filter === 'failure') return launch.success === false;
                return true;
            });
        }
        return launches.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
    }, [allLaunches, searchInput, filter]);

    // useMemo for calculating the summary statistics.
    const summaryStats = useMemo(() => {
        const totalLaunches = allLaunches.length;
        if (totalLaunches === 0) {
            return { totalLaunches: 0, successRate: '0%', boosterLandings: 0 };
        }
        const successfulMissions = allLaunches.filter(l => l.success).length;
        const successRate = ((successfulMissions / totalLaunches) * 100).toFixed(1) + '%';
        const boosterLandings = allLaunches.reduce((acc, l) => acc + (l.cores[0]?.landing_success ? 1 : 0), 0);

        return { totalLaunches, successRate, boosterLandings };
    }, [allLaunches]);


    if (isLoading) {
        return <div style={{color: 'white', fontSize: '1.2rem'}}>Loading missions...</div>;
    }

    return (
        <div className="dashboard-content">
            <LiquidEffects />
            {activeView === 'dashboard' && (
                <div className="stats-container">
                    <div className="stat-wrapper">
                        <div className="liquidGlass-wrapper">
                            <div className="liquidGlass-effect"></div>
                            <div className="liquidGlass-tint"></div>
                            <div className="liquidGlass-shine" id="stat1-shine"></div>
                            <div className="liquidGlass-text stat-card">
                                <StatsCard title="Total Launches" value={summaryStats.totalLaunches} subValue="All missions to date" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-wrapper">
                        <div className="liquidGlass-wrapper">
                            <div className="liquidGlass-effect"></div>
                            <div className="liquidGlass-tint"></div>
                            <div className="liquidGlass-shine" id="stat2-shine"></div>
                            <div className="liquidGlass-text stat-card">
                                <StatsCard title="Success Rate" value={summaryStats.successRate} subValue="Of all primary missions" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-wrapper">
                        <div className="liquidGlass-wrapper">
                            <div className="liquidGlass-effect"></div>
                            <div className="liquidGlass-tint"></div>
                            <div className="liquidGlass-shine" id="stat3-shine"></div>
                            <div className="liquidGlass-text stat-card">
                                <StatsCard title="Boosters Landed" value={summaryStats.boosterLandings} subValue="Successful recoveries" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className={`list-wrapper ${isAnimating ? 'animate-expand' : ''}`}>
                <div className="liquidGlass-wrapper">
                    <div className="liquidGlass-effect"></div>
                    <div className="liquidGlass-tint"></div>
                    <div className="liquidGlass-shine" id="list-shine"></div>
                    <div className="liquidGlass-text list-container">
                        {activeView === 'search' && (
                            <SearchBar 
                                onSearchChange={setSearchInput} 
                                onFilterChange={setFilter}
                                activeFilter={filter}
                            />
                        )}
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patch</th>
                                        <th>Mission</th>
                                        <th>Date</th>
                                        <th>Rocket</th>
                                        <th>Outcome</th>
                                        <th>Booster Landing</th>
                                        <th>Flight No.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLaunches.length > 0 ? (
                                        filteredLaunches.map((launch) => (
                                            <tr key={launch.id}>
                                                <td>
                                                    <img 
                                                        src={launch.links.patch.small || 'https://images2.imgbox.com/a9/9a/NXVkTZCE_o.png'} 
                                                        alt={`${launch.name} patch`} 
                                                        className="mission-patch"
                                                        onError={(e) => { e.currentTarget.src = 'https://images2.imgbox.com/a9/9a/NXVkTZCE_o.png'; }}
                                                    />
                                                </td>
                                                <td>{launch.name}</td>
                                                <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
                                                <td>{launch.rocket?.name || 'N/A'}</td>
                                                <td>
                                                    <span className={launch.success ? 'status-success' : 'status-failure'}>
                                                        {launch.success ? 'Success' : 'Failure'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={launch.cores[0]?.landing_success ? 'status-success' : 'status-failure'}>
                                                        {launch.cores[0]?.landing_attempt ? (launch.cores[0].landing_success ? 'Success' : 'Failure') : 'N/A'}
                                                    </span>
                                                </td>
                                                <td>{launch.flight_number}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">No launches match your criteria.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Launches;