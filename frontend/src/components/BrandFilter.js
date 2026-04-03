import React from 'react';
import './BrandFilter.css';

const BrandFilter = ({ brands, selectedBrand, onBrandSelect, carCount }) => {
    const getCarCount = (brand) => {
        if (brand === 'all') return carCount?.total || 0;
        return carCount?.[brand] || 0;
    };

    return (
        <div className="brand-filter">
            <h3>🏷️ Lọc theo hãng xe</h3>
            
            <div className="brand-list">
                <div 
                    className={`brand-item-filter ${selectedBrand === 'all' ? 'active' : ''}`}
                    onClick={() => onBrandSelect('all')}
                >
                    <span className="brand-name">🚗 Tất cả xe</span>
                    <span className="brand-count">{getCarCount('all')}</span>
                </div>
                
                {brands.map(brand => (
                    <div 
                        key={brand.brand}
                        className={`brand-item-filter ${selectedBrand === brand.brand ? 'active' : ''}`}
                        onClick={() => onBrandSelect(brand.brand)}
                    >
                        <span className="brand-name">🚗 {brand.brand}</span>
                        <span className="brand-count">{getCarCount(brand.brand)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandFilter;