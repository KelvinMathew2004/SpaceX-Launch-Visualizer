import './Launches.css';

const SearchBar = ({ onSearchChange, onFilterChange, activeFilters, onTimeRangeChange, timeRange, yearBounds }) => {
    const handleMinChange = (e) => {
        const newMin = Math.min(e.target.value, timeRange.max - 1);
        onTimeRangeChange({ ...timeRange, min: newMin });
    };

    const handleMaxChange = (e) => {
        const newMax = Math.max(e.target.value, timeRange.min + 1);
        onTimeRangeChange({ ...timeRange, max: newMax });
    };

    const minProgress = ((timeRange.min - yearBounds.min) / (yearBounds.max - yearBounds.min)) * 100;
    const minSliderStyle = {
        background: `linear-gradient(to right, rgb(219, 219, 219) ${minProgress}%, #1158db ${minProgress}%)`,
        borderRadius: '0.5rem',
        height: '0.5rem'
    };

    const maxProgress = ((timeRange.max - yearBounds.min) / (yearBounds.max - yearBounds.min)) * 100;
    const maxSliderStyle = {
        background: `linear-gradient(to right, #1158db ${maxProgress}%, rgb(219, 219, 219) ${maxProgress}%)`,
        borderRadius: '0.5rem',
        height: '0.5rem'
    };
    
    return (
        <div className="search-controls">
            <input
                type="text"
                className="search-input"
                placeholder="Search missions..."
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="filter-buttons">
                <button className={`filter-btn ${activeFilters['success'] ? 'active' : ''}`} onClick={() => onFilterChange('success')} id="success">Success</button>
                <button className={`filter-btn ${activeFilters['failure'] ? 'active' : ''}`} onClick={() => onFilterChange('failure')} id="failure">Failure</button>
            </div>
            <div className="time-range-slider">
                <label>Launch Year: {timeRange.min} - {timeRange.max}</label>
                <div className="slider-inputs">
                    <input type="range" min={yearBounds.min} max={yearBounds.max} value={timeRange.min} onChange={handleMinChange} style={minSliderStyle}/>
                    <input type="range" min={yearBounds.min} max={yearBounds.max} value={timeRange.max} onChange={handleMaxChange} style={maxSliderStyle}/>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;