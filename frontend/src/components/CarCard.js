import React, { useState } from 'react';
import API from '../config/api';
import './CarCard.css';

const CarCard = ({ car, onViewDetail }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // Kiểm tra đăng nhập từ localStorage
    const isLoggedIn = localStorage.getItem('token') !== null;

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
    };

    const toggleFavorite = async (e) => {
        e.stopPropagation();
        
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000);
            return;
        }

        try {
            if (isFavorite) {
                await API.delete(`/api/favorites/${car.id}`);
                setIsFavorite(false);
            } else {
                await API.post(`/api/favorites/${car.id}`, {});
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Lỗi thao tác yêu thích:', error);
        }
    };

    const handleViewDetail = () => {
        onViewDetail(car.id);
    };

    return (
        <div className="car-card">
            <div className="car-image">
                <img 
                    src={car.image_url} 
                    alt={car.name}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                />
                <button 
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            
            <div className="car-info">
                <h3>{car.name}</h3>
                <p className="car-brand">{car.brand}</p>
                <p className="car-price">{formatPrice(car.price)}</p>
                
                <div className="car-specs">
                    <div className="spec-item">
                        <span className="spec-label">📅</span>
                        <span>{car.year}</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">⛽</span>
                        <span>{car.fuel_type}</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">⚡</span>
                        <span>{car.speed} km/h</span>
                    </div>
                </div>

                <button onClick={handleViewDetail} className="btn-view-detail">
                    Xem Chi Tiết
                </button>
            </div>

            {/* Login Prompt */}
            {showLoginPrompt && (
                <div className="login-prompt">
                    <p>Vui lòng <a href="#login">đăng nhập</a> để thêm vào yêu thích</p>
                </div>
            )}
        </div>
    );
};

export default CarCard;