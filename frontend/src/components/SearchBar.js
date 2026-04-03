import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        fuelType: ''
    });

    const brands = ['Ferrari', 'Lamborghini', 'Porsche', 'BMW', 'Mercedes', 'Audi', 'Tesla'];
    const fuelTypes = ['Xăng', 'Dầu', 'Hybrid', 'Điện'];

    const handleChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    const handleReset = () => {
        const resetParams = {
            keyword: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            fuelType: ''
        };
        setSearchParams(resetParams);
        onSearch(resetParams);
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-row">
                    <input
                        type="text"
                        name="keyword"
                        value={searchParams.keyword}
                        onChange={handleChange}
                        placeholder="Tìm kiếm xe..."
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        <span>🔍</span> Tìm kiếm
                    </button>
                    <button type="button" onClick={handleReset} className="reset-btn">
                        ↻ Làm mới
                    </button>
                </div>

                <div className="filter-row">
                    <select name="brand" value={searchParams.brand} onChange={handleChange} className="filter-select">
                        <option value="">Tất cả hãng</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>

                    <select name="fuelType" value={searchParams.fuelType} onChange={handleChange} className="filter-select">
                        <option value="">Tất cả nhiên liệu</option>
                        {fuelTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="minPrice"
                        value={searchParams.minPrice}
                        onChange={handleChange}
                        placeholder="Giá từ (VNĐ)"
                        className="filter-input"
                    />

                    <input
                        type="number"
                        name="maxPrice"
                        value={searchParams.maxPrice}
                        onChange={handleChange}
                        placeholder="Giá đến (VNĐ)"
                        className="filter-input"
                    />
                </div>
            </form>
        </div>
    );
};

export default SearchBar;
