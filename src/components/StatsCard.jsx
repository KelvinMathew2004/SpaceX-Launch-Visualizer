 const StatsCard = ({ title, value, subValue }) => (
    <div className="stat-card">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-sub-value">{subValue}</p>
    </div>
);

export default StatsCard;