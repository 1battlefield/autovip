import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import CartModal from './CartModal';
import API from '../config/api';
import './Header.css';

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lấy số lượng giỏ hàng khi user đăng nhập
    useEffect(() => {
        if (user) {
            fetchCartCount();
        } else {
            setCartCount(0);
        }
    }, [user]);

    // Lắng nghe sự kiện cập nhật giỏ hàng
    useEffect(() => {
        const handleCartUpdate = () => {
            if (user) {
                fetchCartCount();
            }
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [user]);

    const fetchCartCount = async () => {
        try {
            const res = await API.get('/api/cart');
            setCartCount(res.data.count || 0);
        } catch (error) {
            console.error('Lỗi lấy số lượng giỏ hàng:', error);
        }
    };

    const handleCartUpdate = (count) => {
        setCartCount(count);
    };

    // Hàm xử lý click để cuộn đến section
    const handleNavClick = (e, targetId) => {
        if (window.location.pathname !== '/') {
            window.location.href = `/#${targetId}`;
            return;
        }
        const element = document.getElementById(targetId);
        if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-container">
                    <div className="header-left">
                        <a href="/" className="logo">
                            <div className="logo-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <div className="logo-text">
                                Auto<span>Vip</span>
                            </div>
                        </a>
                    </div>

                    <nav className="header-nav">
                        <a href="/" className="nav-link">Trang chủ</a>
                        <a 
                            href="/#cars" 
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, 'cars')}
                        >
                            Xe
                        </a>
                        <a 
                            href="/#brands" 
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, 'brands')}
                        >
                            Thương hiệu
                        </a>
                        {user && user.role === 'admin' && (
                            <a href="/admin" className="nav-link admin-link">Quản lý</a>
                        )}
                    </nav>

                    <div className="header-right">
                        {user && (
                            <button onClick={() => setShowCart(true)} className="cart-btn">
                                <svg className="cart-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {cartCount > 0 && (
                                    <span className="cart-count">{cartCount}</span>
                                )}
                            </button>
                        )}
                        
                        {user ? (
                            <div className="user-menu">
                                <a href="/profile" className="profile-btn">
                                    <div className="profile-avatar">
                                        {user.fullname?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="profile-name">{user.fullname?.split(' ').pop()}</span>
                                </a>
                                <button onClick={logout} className="logout-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <button onClick={() => setShowLogin(true)} className="btn-login">
                                    Đăng nhập
                                </button>
                                <button onClick={() => setShowRegister(true)} className="btn-register">
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <LoginModal 
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
            />

            <RegisterModal 
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />

            <CartModal 
                isOpen={showCart}
                onClose={() => setShowCart(false)}
                onCartUpdate={handleCartUpdate}
            />
        </>
    );
};

export default Header;