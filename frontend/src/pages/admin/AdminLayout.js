import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import './AdminLayout.css';

const SvgWrapper = ({ children, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        {children}
    </svg>
);

const IconDashboard = ({ size }) => <SvgWrapper size={size}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></SvgWrapper>;
const IconPackage = ({ size }) => <SvgWrapper size={size}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></SvgWrapper>;
const IconCar = ({ size }) => <SvgWrapper size={size}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM5 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></SvgWrapper>;
const IconUsers = ({ size }) => <SvgWrapper size={size}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></SvgWrapper>;
const IconCalendar = ({ size }) => <SvgWrapper size={size}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></SvgWrapper>;
const IconStar = ({ size }) => <SvgWrapper size={size}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></SvgWrapper>;
const IconMail = ({ size }) => <SvgWrapper size={size}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></SvgWrapper>;
const IconNews = ({ size }) => <SvgWrapper size={size}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></SvgWrapper>;
const IconChevronLeft = ({ size }) => <SvgWrapper size={size}><polyline points="15 18 9 12 15 6"></polyline></SvgWrapper>;
const IconChevronRight = ({ size }) => <SvgWrapper size={size}><polyline points="9 18 15 12 9 6"></polyline></SvgWrapper>;
const IconUser = ({ size }) => <SvgWrapper size={size}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></SvgWrapper>;
const IconHome = ({ size }) => <SvgWrapper size={size}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></SvgWrapper>;
const IconLogOut = ({ size }) => <SvgWrapper size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></SvgWrapper>;

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const menuItems = [
        { path: '/admin', icon: <IconDashboard />, label: 'Dashboard' },
        { path: '/admin/orders', icon: <IconPackage />, label: 'Quản lý đơn hàng' },
        { path: '/admin/cars', icon: <IconCar />, label: 'Quản lý xe' },
        { path: '/admin/users', icon: <IconUsers />, label: 'Quản lý người dùng' },
        { path: '/admin/testdrives', icon: <IconCalendar />, label: 'Lịch lái thử' },
        { path: '/admin/reviews', icon: <IconStar />, label: 'Đánh giá' },
        { path: '/admin/contacts', icon: <IconMail />, label: 'Liên hệ' },
        { path: '/admin/news', icon: <IconNews />, label: 'Tin tức' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>{sidebarOpen ? 'AutoVip Admin' : 'AV'}</h2>
                    <button onClick={toggleSidebar} className="toggle-sidebar">
                        {sidebarOpen ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
                    </button>
                </div>
                
                {sidebarOpen && (
                    <div className="admin-info">
                        <div className="admin-avatar">
                            <IconUser size={28} />
                        </div>
                        <div className="admin-details">
                            <p>Xin chào,</p>
                            <strong>{user?.fullname}</strong>
                            <span className="admin-badge">Admin</span>
                        </div>
                    </div>
                )}
                
                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <Link key={index} to={item.path} className="nav-item">
                            <span className="nav-icon">{item.icon}</span>
                            {sidebarOpen && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
                
                <div className="sidebar-footer">
                    <Link to="/" className="nav-item">
                        <span className="nav-icon"><IconHome /></span>
                        {sidebarOpen && <span className="nav-label">Về trang chủ</span>}
                    </Link>
                    <button onClick={handleLogout} className="nav-item logout-btn">
                        <span className="nav-icon"><IconLogOut /></span>
                        {sidebarOpen && <span className="nav-label">Đăng xuất</span>}
                    </button>
                </div>
            </div>
            
            {/* Main Content */}
            <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;