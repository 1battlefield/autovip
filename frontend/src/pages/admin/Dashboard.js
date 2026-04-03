import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SvgWrapper = ({ children, size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        {children}
    </svg>
);

const IconBarChart = ({ size }) => <SvgWrapper size={size}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></SvgWrapper>;
const IconCar = ({ size }) => <SvgWrapper size={size}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM5 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"></path></SvgWrapper>;
const IconUsers = ({ size }) => <SvgWrapper size={size}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></SvgWrapper>;
const IconCalendar = ({ size }) => <SvgWrapper size={size}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></SvgWrapper>;
const IconClock = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></SvgWrapper>;
const IconDollar = ({ size }) => <SvgWrapper size={size}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></SvgWrapper>;
const IconCheckCircle = ({ size }) => <SvgWrapper size={size}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></SvgWrapper>;
const IconCheck = ({ size }) => <SvgWrapper size={size}><polyline points="20 6 9 17 4 12"></polyline></SvgWrapper>;
const IconXCircle = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></SvgWrapper>;

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalCars: 0,
        totalUsers: 0,
        totalTestDrives: 0,
        pendingReviews: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [recentTestDrives, setRecentTestDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Lấy số liệu thống kê
            const [carsRes, usersRes, testDrivesRes, ordersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/cars'),
                axios.get('http://localhost:5000/api/admin/users'),
                axios.get('http://localhost:5000/api/admin/testdrives'),
                axios.get('http://localhost:5000/api/admin/orders/stats/summary')
            ]);

            // Tính số xe
            const carsData = carsRes.data.data || carsRes.data;
            
            setStats({
                totalCars: carsData.length || 0,
                totalUsers: usersRes.data.length || 0,
                totalTestDrives: testDrivesRes.data.length || 0,
                pendingReviews: 0,
                totalRevenue: ordersRes.data.stats?.total_revenue || 0,
                pendingOrders: ordersRes.data.stats?.pending_orders || 0
            });

            // Lấy 5 lịch lái thử gần nhất
            setRecentTestDrives(testDrivesRes.data.slice(0, 5));
            
            setLoading(false);
        } catch (error) {
            console.error('Lỗi tải dashboard:', error);
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫' || '0 ₫';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'pending': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconClock size={14} /> Chờ xác nhận</span>;
            case 'confirmed': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconCheckCircle size={14} /> Đã xác nhận</span>;
            case 'completed': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconCheck size={14} /> Hoàn thành</span>;
            case 'cancelled': return <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconXCircle size={14} /> Đã hủy</span>;
            default: return status;
        }
    };

    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

    return (
        <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconBarChart size={32} /> Dashboard</h1>
            
            {/* Thống kê */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCar size={20} /> Tổng số xe</h3>
                    <div className="stat-number">{stats.totalCars}</div>
                </div>
                
                <div className="stat-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconUsers size={20} /> Người dùng</h3>
                    <div className="stat-number">{stats.totalUsers}</div>
                </div>
                
                <div className="stat-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCalendar size={20} /> Lịch lái thử</h3>
                    <div className="stat-number">{stats.totalTestDrives}</div>
                </div>
                
                <div className="stat-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconClock size={20} /> Đơn hàng chờ</h3>
                    <div className="stat-number">{stats.pendingOrders}</div>
                </div>
                
                <div className="stat-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconDollar size={20} /> Doanh thu</h3>
                    <div className="stat-number">{formatPrice(stats.totalRevenue)}</div>
                </div>
            </div>

            {/* Lịch lái thử gần đây */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCalendar size={28} /> Lịch lái thử gần đây</h2>
                {recentTestDrives.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px' }}>
                        <p>Chưa có lịch lái thử nào</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Người đặt</th>
                                <th>Xe</th>
                                <th>SĐT</th>
                                <th>Ngày</th>
                                <th>Giờ</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTestDrives.map(drive => (
                                <tr key={drive.id}>
                                    <td>
                                        <strong>{drive.fullname}</strong>
                                        <br />
                                        <small style={{ color: '#666' }}>{drive.email}</small>
                                    </td>
                                    <td>{drive.car_name}</td>
                                    <td>{drive.phone}</td>
                                    <td>{formatDate(drive.test_date)}</td>
                                    <td>{drive.test_time}</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-flex',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: drive.status === 'pending' ? '#fff3cd' :
                                                       drive.status === 'confirmed' ? '#d4edda' :
                                                       drive.status === 'completed' ? '#cce5ff' : '#f8d7da',
                                            color: drive.status === 'pending' ? '#856404' :
                                                   drive.status === 'confirmed' ? '#155724' :
                                                   drive.status === 'completed' ? '#004085' : '#721c24'
                                        }}>
                                            {getStatusText(drive.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/admin/testdrives`} className="btn-view">
                                            Xem
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;