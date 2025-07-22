import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import '../App.css'

const LaunchDetail = () => {
    const { launchId } = useParams()
    const navigate = useNavigate();
    const [launch, setLaunch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!launchId) return;

        const fetchLaunchDetail = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://api.spacexdata.com/v5/launches/${launchId}`);
                if (!response.ok) {
                    throw new Error('Launch not found');
                }
                const data = await response.json();
                setLaunch(data);
            } catch (error) {
                console.error("Failed to fetch launch details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLaunchDetail();
    }, [launchId]);


    if (isLoading) return <div style={{ color: 'white', fontSize: '1.2rem', padding: '2rem' }}>Loading launch details...</div>;
    if (!launch) return <div>Launch not found.</div>;

    return (
        <div className="detail-view">
             <button onClick={() => navigate('/')} className="back-button">
                &larr; Back to Launches
            </button>
            <div className="detail-header">
                <img src={launch.links.patch.large || 'https://images2.imgbox.com/a9/9a/NXVkTZCE_o.png'} alt={`${launch.name} patch`} className="detail-patch" />
                <div>
                    <h1>{launch.name}</h1>
                    <p>{new Date(launch.date_utc).toLocaleString()}</p>
                </div>
            </div>
            <p className="detail-description">{launch.details || "No details available for this mission."}</p>
            <a href={launch.links.webcast} target="_blank" rel="noopener noreferrer" className="detail-link">
                Watch Webcast
            </a>
        </div>
    );
};

export default LaunchDetail;