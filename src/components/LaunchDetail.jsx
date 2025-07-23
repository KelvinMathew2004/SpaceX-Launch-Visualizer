import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import LiquidEffects from './LiquidEffects';
import '../App.css'

const LaunchDetail = () => {
    const { launchId } = useParams();
    const navigate = useNavigate();
    const [launch, setLaunch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!launchId) return;
        const fetchLaunchDetail = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("https://api.spacexdata.com/v5/launches/query", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: { _id: launchId },
                        options: {
                            populate: [
                                { path: "rocket", select: { name: 1 } },
                                { path: "launchpad", select: { full_name: 1, locality: 1 } }
                            ]
                        }
                    })
                });
                if (!response.ok) throw new Error('Launch not found');
                const data = await response.json();
                setLaunch(data.docs[0]);
            } catch (error) {
                console.error("Failed to fetch launch details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLaunchDetail();
    }, [launchId]);

    if (isLoading) return <div style={{ color: 'white', fontSize: '1.2rem', padding: '2rem' }}>Loading launch details...</div>;
    if (!launch) return <NotFound />;

    const core = launch.cores[0];

    return (
        <div className="detail-view">
            <LiquidEffects />
            <div className="detail-header">
                <img src={launch.links.patch.small || 'https://images2.imgbox.com/a9/9a/NXVkTZCE_o.png'} alt={`${launch.name} patch`} className="detail-patch" />
                <div>
                    <h1>{launch.name}</h1>
                    <p>{new Date(launch.date_utc).toLocaleString()}</p>
                    <div className="detail-tags">
                        <span className={launch.success ? 'status-success' : 'status-failure'}>{launch.success ? 'Successful Mission' : 'Mission Failure'}</span>
                        {core?.reused && <span className="tag-reused">Reused Booster</span>}
                    </div>
                </div>
            </div>
            
            <div className="detail-stats-grid">
                <div className="stat-wrapper">
                    <div className="liquidGlass-wrapper">
                        <div className="liquidGlass-effect"></div>
                        <div className="liquidGlass-tint"></div>
                        <div className="liquidGlass-shine" id="stat1-shine"></div>
                        <div className="liquidGlass-text detail-stat">
                            <span>Rocket</span><span>{launch.rocket?.name || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="stat-wrapper">
                    <div className="liquidGlass-wrapper">
                        <div className="liquidGlass-effect"></div>
                        <div className="liquidGlass-tint"></div>
                        <div className="liquidGlass-shine" id="stat2-shine"></div>
                        <div className="liquidGlass-text detail-stat">
                            <span>Launch Site</span><span>{launch.launchpad?.full_name || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="stat-wrapper">
                    <div className="liquidGlass-wrapper">
                        <div className="liquidGlass-effect"></div>
                        <div className="liquidGlass-tint"></div>
                        <div className="liquidGlass-shine" id="stat2-shine"></div>
                        <div className="liquidGlass-text detail-stat">
                            <span>Booster Landing</span><span className={core?.landing_success ? 'status-success' : 'status-failure'}>{core?.landing_attempt ? (core.landing_success ? 'Success' : 'Failure') : 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="stat-wrapper">
                    <div className="liquidGlass-wrapper">
                        <div className="liquidGlass-effect"></div>
                        <div className="liquidGlass-tint"></div>
                        <div className="liquidGlass-shine" id="stat3-shine"></div>
                        <div className="liquidGlass-text detail-stat">
                            <span>Landing Type</span><span>{core?.landing_type || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {launch.details && (
                <p className="detail-description">
                    {launch.details}
                </p>
            )}

            <div className="detail-links">
                {launch.links.webcast && (
                    <a href={launch.links.webcast} target="_blank" rel="noopener noreferrer" className="detail-link">
                        Watch Webcast
                    </a>
                )}
                {launch.links.article && (
                    <a href={launch.links.article} target="_blank" rel="noopener noreferrer" className="detail-link">
                        Read Article
                    </a>
                )}
                {launch.links.wikipedia && (
                    <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer" className="detail-link">
                        Wikipedia
                    </a>
                )}
            </div>

            {launch.links.flickr.original.length > 0 && (
                <div className="gallery">
                    <h3>Mission Gallery</h3>
                    <div className="gallery-images">
                        {launch.links.flickr.original.map(url =>                            <img key={url} src={url} alt="Launch photo" className='mission-image'/>)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaunchDetail;