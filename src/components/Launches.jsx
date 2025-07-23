import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import './Launches.css';
import LiquidEffects from "./LiquidEffects.jsx";
import StatsCard from "./StatsCard.jsx";
import SearchBar from "./SearchBar.jsx";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Launches = ({ activeView, searchInput, onSearchChange, filters, onFilterChange, timeRange, onTimeRangeChange, yearBounds }) => {    
    const [allLaunches, setAllLaunches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const fallbackPatches = {
        'Galaxy 33 (15R) & 34 (12R)': 'https://spacexnow.com/patches/spacex/Galaxy_33-34_thumb.png',
        'Hotbird 13F': 'https://spacexnow.com/patches/spacex/Hotbird_13F_thumb.png',
        'Starlink 4-36 (v1.5)': 'https://spacexnow.com/patches/spacex/Starlink-V2-Mini_thumb.png',
        'SES-18 & SES-19': 'https://spacexnow.com/patches/spacex/SES-18-SES-19_thumb.png',
        'Starlink 4-37 (v1.5)': 'https://spacexnow.com/patches/spacex/Starlink-V2-Mini_thumb.png',
        'O3b mPower 1,2': 'https://spacexnow.com/patches/spacex/O3b_mPower_1-2_thumb.png',
        'USSF-44': 'https://spacexnow.com/patches/spacex/USSF-44_thumb.png',
        'Hotbird 13G': 'https://spacexnow.com/patches/spacex/Hotbird_13G_thumb.png',
        'Galaxy 31 (23R) & 32 (17R)': 'https://spacexnow.com/patches/spacex/Intelsat_G-31G-32_thumb.png',
        'Eutelsat 10B': 'https://spacexnow.com/patches/spacex/Eutelsat_10B_thumb.png',
        'CRS-26': 'https://spacexnow.com/patches/spacex/CRS-26_thumb.png',
        'ispace Mission 1 & Rashid': 'https://spacexnow.com/patches/Customer/HAKUTO-R_Mission_1_thumb.png',
        'Transporter-6': 'https://spacexnow.com/patches/spacex/Transporter_6_thumb.png',
        'Viasat-3 & Arcturus': 'https://spacexnow.com/patches/spacex/ViaSat-3_Americas__Aurora_4A_thumb.png',
        'TTL-1': 'https://spacexnow.com/patches/spacex/Starlink-V2-Mini_thumb.png',
        'O3b mPower 3.4': 'https://spacexnow.com/patches/spacex/O3b_mPower_3-4_thumb.png',
        'WorldView Legion 1 & 2': 'https://spacexnow.com/patches/Customer/WorldView_Legion_1-2_thumb.png',
        'SWOT': 'https://spacexnow.com/patches/spacex/SWOT_thumb.png',
    };
    const genericFallbackPatch = 'https://images2.imgbox.com/a9/9a/NXVkTZCE_o.png';

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
            onSearchChange('');
            if (yearBounds && yearBounds.min && yearBounds.max) {
                onTimeRangeChange({ min: yearBounds.min, max: yearBounds.max });
            }
            onFilterChange('all');
        }
    }, [activeView]);

    const filteredLaunches = useMemo(() => {
        if (!allLaunches.length) return [];
        let launches = [...allLaunches];

        // 1. Search filter
        if (searchInput) {
            launches = launches.filter(launch =>
                launch.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                (launch.details && launch.details.toLowerCase().includes(searchInput.toLowerCase()))
            );
        }

        // 2. Categorical filters
        const activeFilterKeys = Object.keys(filters).filter(key => filters[key]);
        if (activeFilterKeys.length > 0) {
            launches = launches.filter(launch => {
                return activeFilterKeys.every(key => {
                    if (key === 'success') return launch.success === true;
                    if (key === 'failure') return launch.success === false;
                    return true;
                });
            });
        }
        
        // 3. Time range filter
        if (timeRange) {
            launches = launches.filter(launch => {
                const year = new Date(launch.date_utc).getFullYear();
                return year >= timeRange.min && year <= timeRange.max;
            });
        }

        return launches.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
    }, [allLaunches, searchInput, filters, timeRange]);

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

    const chartData = useMemo(() => {
        if (!allLaunches.length) return { launchesByYear: [], recoveriesByYear: [] };

        const yearlyData = allLaunches.reduce((acc, launch) => {
            const year = new Date(launch.date_utc).getFullYear();
            if (!acc[year]) {
                acc[year] = { year, launches: 0, recoveries: 0 };
            }
            acc[year].launches++;
            if (launch.cores[0]?.landing_success) {
                acc[year].recoveries++;
            }
            return acc;
        }, {});

        const sortedData = Object.values(yearlyData).sort((a, b) => a.year - b.year);
        return {
            launchesByYear: sortedData.map(d => ({ year: d.year, Launches: d.launches })),
            recoveriesByYear: sortedData.map(d => ({ year: d.year, Recoveries: d.recoveries })),
        };
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
                                onSearchChange={onSearchChange} 
                                onFilterChange={onFilterChange}
                                activeFilters={filters}
                                onTimeRangeChange={onTimeRangeChange}
                                timeRange={timeRange}
                                yearBounds={yearBounds}
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
                                            <tr key={launch.id} onClick={() => navigate(`/launches/${launch.id}`)}>
                                                <td>
                                                    <img 
                                                        src={launch.links.patch.small || fallbackPatches[launch.name] || genericFallbackPatch} 
                                                        alt={`${launch.name} patch`} 
                                                        className="mission-patch" 
                                                        onError={(e) => { e.currentTarget.src = genericFallbackPatch; }} 
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
                        {activeView === 'dashboard' && (
                            <div className="charts-container">
                                <div className="chart-wrapper">
                                    <h4>Launches Per Year</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData.launchesByYear} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                            <XAxis dataKey="year" stroke="#ccc" />
                                            <YAxis stroke="#ccc" />
                                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: "0.5rem", backdropFilter: "blur(10px)" }} />
                                            <Legend />
                                            <Bar dataKey="Launches" fill="#FDFD96" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="chart-wrapper">
                                    <h4>Booster Recovery Trend</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData.recoveriesByYear} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                            <XAxis dataKey="year" stroke="#ccc" />
                                            <YAxis stroke="#ccc" />
                                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: "0.5rem", backdropFilter: "blur(10px)" }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="Recoveries" stroke="#FFA756" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Launches;