import React from 'react';
import './SortFilter.css';

const SortFilter = ({ sortBy, onSortChange }) => {
    const sortOptions = [
        { value: 'newest', label: '🆕 Mới nhất' },
        { value: 'price_asc', label: '💰 Giá tăng dần' },
        { value: 'price_desc', label: '💰 Giá giảm dần' },
        { value: 'year_desc', label: '📅 Năm mới nhất' }
    ];

    return (
        <div className="sort-filter">
            <label>Sắp xếp:</label>
            <select 
                value={sortBy} 
                onChange={(e) => onSortChange(e.target.value)}
                className="sort-select"
            >
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SortFilter;
