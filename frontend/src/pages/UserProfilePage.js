import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import './UserProfilePage.css';

const SvgWrapper = ({ children, size = 18, color = "currentColor", fill = "none", style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
        {children}
    </svg>
);

const IconUser = ({ size }) => <SvgWrapper size={size}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></SvgWrapper>;
const IconPackage = ({ size }) => <SvgWrapper size={size}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></SvgWrapper>;
const IconCalendar = ({ size }) => <SvgWrapper size={size}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></SvgWrapper>;
const IconStar = ({ size, color, fill, style }) => <SvgWrapper size={size} color={color} fill={fill} style={style}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></SvgWrapper>;
const IconShoppingCart = ({ size }) => <SvgWrapper size={size}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></SvgWrapper>;
const IconClock = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></SvgWrapper>;
const IconCheckCircle = ({ size }) => <SvgWrapper size={size}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></SvgWrapper>;
const IconTruck = ({ size }) => <SvgWrapper size={size}><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></SvgWrapper>;
const IconCheck = ({ size }) => <SvgWrapper size={size}><polyline points="20 6 9 17 4 12"></polyline></SvgWrapper>;
const IconXCircle = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></SvgWrapper>;
const IconDollar = ({ size }) => <SvgWrapper size={size}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></SvgWrapper>;
const IconCreditCard = ({ size }) => <SvgWrapper size={size}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></SvgWrapper>;
const IconMapPin = ({ size }) => <SvgWrapper size={size}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></SvgWrapper>;
const IconCar = ({ size }) => <SvgWrapper size={size}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM5 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"></path></SvgWrapper>;
const IconPhone = ({ size }) => <SvgWrapper size={size}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></SvgWrapper>;
const IconEdit = ({ size }) => <SvgWrapper size={size}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></SvgWrapper>;

const UserProfilePage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [testDrives, setTestDrives] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTestDrive, setSelectedTestDrive] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
            fetchTestDrives();
            fetchReviews();
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTestDrives = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/testdrives');
            setTestDrives(res.data || []);
        } catch (error) {
            console.error('Lỗi tải lịch lái thử:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/reviews');
            setReviews(res.data.reviews || []);
        } catch (error) {
            console.error('Lỗi tải đánh giá:', error);
        }
    };

    const viewOrderDetail = async (orderId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
            setSelectedOrder(res.data.order);
        } catch (error) {
            console.error('Lỗi tải chi tiết:', error);
        }
    };

    const viewTestDriveDetail = (drive) => {
        setSelectedTestDrive(drive);
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0 ₫';
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa có';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'Chưa có';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getOrderStatusText = (status) => {
        const statusMap = {
            pending: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconClock size={14} /> Chờ xác nhận</span>, color: '#f39c12', bg: '#fff3cd' },
            confirmed: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconCheckCircle size={14} /> Đã xác nhận</span>, color: '#3498db', bg: '#cce5ff' },
            shipping: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconTruck size={14} /> Đang giao</span>, color: '#9b59b6', bg: '#e8d4ff' },
            completed: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconCheck size={14} /> Hoàn thành</span>, color: '#27ae60', bg: '#d4edda' },
            cancelled: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconXCircle size={14} /> Đã hủy</span>, color: '#e74c3c', bg: '#f8d7da' }
        };
        return statusMap[status] || { text: status, color: '#666', bg: '#f8f9fa' };
    };

    const getTestDriveStatusText = (status) => {
        const statusMap = {
            pending: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconClock size={14} /> Chờ xác nhận</span>, color: '#f39c12', bg: '#fff3cd' },
            confirmed: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconCheckCircle size={14} /> Đã xác nhận</span>, color: '#3498db', bg: '#cce5ff' },
            completed: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconCheck size={14} /> Đã hoàn thành</span>, color: '#27ae60', bg: '#d4edda' },
            cancelled: { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconXCircle size={14} /> Đã hủy</span>, color: '#e74c3c', bg: '#f8d7da' }
        };
        return statusMap[status] || { text: status, color: '#666', bg: '#f8f9fa' };
    };

    const getReviewStatus = (status) => {
        if (status === 'approved') return { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconCheckCircle size={14} /> Đã duyệt</span>, color: '#27ae60', bg: '#d4edda' };
        if (status === 'pending') return { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconClock size={14} /> Chờ duyệt</span>, color: '#f39c12', bg: '#fff3cd' };
        return { text: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconXCircle size={14} /> Từ chối</span>, color: '#e74c3c', bg: '#f8d7da' };
    };

    if (!user) {
        return (
            <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                <h2>Vui lòng đăng nhập để xem thông tin cá nhân</h2>
                <button onClick={() => window.location.href = '/'} className="btn-detail" style={{ width: '200px', marginTop: '20px' }}>
                    Về trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="container" style={{ marginTop: '100px', padding: '20px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconUser size={32} /> Thông tin cá nhân</h1>
                
                {/* Tabs */}
                <div className="profile-tabs">
                    <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconUser size={18} /> Thông tin tài khoản
                    </button>
                    <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconPackage size={18} /> Lịch sử đơn hàng
                    </button>
                    <button className={`tab-btn ${activeTab === 'testdrives' ? 'active' : ''}`} onClick={() => setActiveTab('testdrives')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconCalendar size={18} /> Lịch lái thử
                    </button>
                    <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconStar size={18} /> Đánh giá của tôi
                    </button>
                </div>

                {/* Tab Profile */}
                {activeTab === 'profile' && (
                    <div className="profile-info">
                        <div className="info-card">
                            <div className="info-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconUser size={40} />
                            </div>
                            <div className="info-details">
                                <h3>{user.fullname}</h3>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Vai trò:</strong> {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                                <button onClick={logout} className="logout-btn-profile">Đăng xuất</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Orders - Lịch sử đơn hàng */}
                {activeTab === 'orders' && (
                    <div className="orders-list">
                        {loading ? (
                            <div className="loading">Đang tải...</div>
                        ) : orders.length === 0 ? (
                            <div className="empty-state">
                                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <IconShoppingCart size={24} /> Bạn chưa có đơn hàng nào
                                </p>
                                <button onClick={() => window.location.href = '/'} className="btn-detail">
                                    Mua sắm ngay
                                </button>
                            </div>
                        ) : (
                            orders.map(order => {
                                const status = getOrderStatusText(order.status);
                                return (
                                    <div key={order.id} className="order-card" onClick={() => viewOrderDetail(order.id)}>
                                        <div className="order-header">
                                            <div>
                                                <strong>Mã đơn: {order.order_code}</strong>
                                                <p className="order-date">{formatDate(order.created_at)}</p>
                                            </div>
                                            <div className="order-status" style={{ color: status.color, background: status.bg, padding: '5px 12px', borderRadius: '20px' }}>
                                                {status.text}
                                            </div>
                                        </div>
                                        <div className="order-info">
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconPackage size={16} /> Số lượng: {order.items_count} sản phẩm</p>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconDollar size={16} /> Tổng tiền: {formatPrice(order.total_amount)}</p>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconCreditCard size={16} /> Thanh toán: {order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}</p>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconMapPin size={16} /> Địa chỉ: {order.shipping_address}</p>
                                        </div>
                                        <div className="order-footer">
                                            <button className="btn-view-order">Xem chi tiết →</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Tab Test Drives - Lịch lái thử */}
                {activeTab === 'testdrives' && (
                    <div className="testdrives-list">
                        {testDrives.length === 0 ? (
                            <div className="empty-state">
                                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <IconCalendar size={24} /> Bạn chưa có lịch lái thử nào
                                </p>
                                <button onClick={() => window.location.href = '/'} className="btn-detail">
                                    Đặt lịch lái thử ngay
                                </button>
                            </div>
                        ) : (
                            testDrives.map(drive => {
                                const status = getTestDriveStatusText(drive.status);
                                return (
                                    <div key={drive.id} className="testdrive-card" onClick={() => viewTestDriveDetail(drive)}>
                                        <div className="testdrive-header">
                                            <div>
                                                <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <IconCar size={18} /> {drive.car_name}
                                                </strong>
                                                <p className="testdrive-date">Ngày đặt: {formatDate(drive.created_at)}</p>
                                            </div>
                                            <div className="testdrive-status" style={{ color: status.color, background: status.bg, padding: '5px 12px', borderRadius: '20px' }}>
                                                {status.text}
                                            </div>
                                        </div>
                                        <div className="testdrive-info">
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconCalendar size={16} /> Ngày lái thử: {formatDateOnly(drive.test_date)} - {drive.test_time}</p>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconUser size={16} /> Họ tên: {drive.fullname}</p>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconPhone size={16} /> SĐT: {drive.phone}</p>
                                            {drive.notes && <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconEdit size={16} /> Ghi chú: {drive.notes}</p>}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Tab Reviews - Đánh giá của tôi */}
                {activeTab === 'reviews' && (
                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <div className="empty-state">
                                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <IconStar size={24} /> Bạn chưa có đánh giá nào
                                </p>
                                <p style={{ fontSize: '14px', color: '#666' }}>
                                    Hãy mua xe và đánh giá để chia sẻ trải nghiệm của bạn!
                                </p>
                            </div>
                        ) : (
                            reviews.map(review => {
                                const status = getReviewStatus(review.status);
                                return (
                                    <div key={review.id} className="review-card">
                                        <div className="review-header">
                                            <img src={review.image_url} alt={review.car_name} />
                                            <div>
                                                <h4>{review.car_name}</h4>
                                                <div className="review-rating" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <IconStar 
                                                            key={i} 
                                                            size={14} 
                                                            color={i < review.rating ? "#f39c12" : "#ccc"} 
                                                            fill={i < review.rating ? "#f39c12" : "none"} 
                                                        />
                                                    ))}
                                                    <span style={{ marginLeft: '6px' }}>({review.rating}/5)</span>
                                                </div>
                                            </div>
                                            <div className="review-status" style={{ color: status.color, background: status.bg, padding: '5px 12px', borderRadius: '20px' }}>
                                                {status.text}
                                            </div>
                                        </div>
                                        <div className="review-content">
                                            <p>{review.comment}</p>
                                        </div>
                                        <div className="review-footer">
                                            <span>{formatDate(review.created_at)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Modal chi tiết đơn hàng */}
                {selectedOrder && (
                    <div className="modal" onClick={() => setSelectedOrder(null)}>
                        <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
                            <span className="close" onClick={() => setSelectedOrder(null)}>&times;</span>
                            
                            <h2>Chi tiết đơn hàng</h2>
                            <p className="order-code">Mã đơn: <strong>{selectedOrder.order_code}</strong></p>
                            
                            <div className="order-detail-info">
                                <div className="info-row">
                                    <label>Trạng thái:</label>
                                    <span style={{ color: getOrderStatusText(selectedOrder.status).color }}>
                                        {getOrderStatusText(selectedOrder.status).text}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <label>Ngày đặt:</label>
                                    <span>{formatDate(selectedOrder.created_at)}</span>
                                </div>
                                <div className="info-row">
                                    <label>Người nhận:</label>
                                    <span>{selectedOrder.shipping_name}</span>
                                </div>
                                <div className="info-row">
                                    <label>SĐT:</label>
                                    <span>{selectedOrder.shipping_phone}</span>
                                </div>
                                <div className="info-row">
                                    <label>Địa chỉ:</label>
                                    <span>{selectedOrder.shipping_address}</span>
                                </div>
                                <div className="info-row">
                                    <label>Phương thức:</label>
                                    <span>{selectedOrder.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</span>
                                </div>
                                {selectedOrder.note && (
                                    <div className="info-row">
                                        <label>Ghi chú:</label>
                                        <span>{selectedOrder.note}</span>
                                    </div>
                                )}
                            </div>

                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconPackage size={20} /> Sản phẩm</h3>
                            <table className="order-items">
                                <thead>
                                    <tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map(item => (
                                        <tr key={item.car_id}>
                                            <td>{item.car_name}</td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr><td colSpan="3" style={{ textAlign: 'right' }}><strong>Tổng cộng:</strong></td><td><strong>{formatPrice(selectedOrder.total_amount)}</strong></td></tr>
                                </tfoot>
                            </table>
                            
                            <div className="modal-actions">
                                <button onClick={() => setSelectedOrder(null)} className="close-btn">Đóng</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal chi tiết lịch lái thử */}
                {selectedTestDrive && (
                    <div className="modal" onClick={() => setSelectedTestDrive(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <span className="close" onClick={() => setSelectedTestDrive(null)}>&times;</span>
                            <h2>Chi tiết lịch lái thử</h2>
                            <div className="info-section">
                                <p><strong>Xe:</strong> {selectedTestDrive.car_name}</p>
                                <p><strong>Họ tên:</strong> {selectedTestDrive.fullname}</p>
                                <p><strong>Email:</strong> {selectedTestDrive.email}</p>
                                <p><strong>SĐT:</strong> {selectedTestDrive.phone}</p>
                                <p><strong>Ngày lái thử:</strong> {formatDateOnly(selectedTestDrive.test_date)}</p>
                                <p><strong>Giờ:</strong> {selectedTestDrive.test_time}</p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><strong>Trạng thái:</strong> {getTestDriveStatusText(selectedTestDrive.status).text}</p>
                                {selectedTestDrive.notes && <p><strong>Ghi chú:</strong> {selectedTestDrive.notes}</p>}
                                <p><strong>Ngày đặt:</strong> {formatDate(selectedTestDrive.created_at)}</p>
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setSelectedTestDrive(null)} className="close-btn">Đóng</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;