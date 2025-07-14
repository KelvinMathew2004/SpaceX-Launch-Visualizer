import './Launches.css';

const SearchBar = ({ onSearchChange, onFilterChange, activeFilter }) => {
    return (
        <div className="search-controls">
            <input
                type="text"
                className="search-input"
                placeholder="Search missions..."
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="filter-buttons">
                <button 
                    className={`filter-btn ${activeFilter === '' ? 'active' : ''}`} 
                    onClick={() => onFilterChange('')}>
                    All
                </button>
                <button 
                    className={`filter-btn ${activeFilter === 'success' ? 'active' : ''}`} 
                    onClick={() => onFilterChange('success')}>
                    Success
                </button>
                <button 
                    className={`filter-btn ${activeFilter === 'failure' ? 'active' : ''}`} 
                    onClick={() => onFilterChange('failure')}>
                    Failure
                </button>
            </div>
        </div>
    );
};

export default SearchBar;