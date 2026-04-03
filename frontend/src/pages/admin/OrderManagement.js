import React, { useState, useEffect } from 'react';
import API from '../../config/api';
import './OrderManagement.css';

const SvgWrapper = ({ children, size = 18, color = "currentColor", style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
        {children}
    </svg>
);

const IconPackage = ({ size }) => <SvgWrapper size={size}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></SvgWrapper>;
const IconClock = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></SvgWrapper>;
const IconCheckCircle = ({ size }) => <SvgWrapper size={size}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></SvgWrapper>;
const IconTruck = ({ size }) => <SvgWrapper size={size}><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></SvgWrapper>;
const IconCheck = ({ size }) => <SvgWrapper size={size}><polyline points="20 6 9 17 4 12"></polyline></SvgWrapper>;
const IconXCircle = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></SvgWrapper>;
const IconDollar = ({ size }) => <SvgWrapper size={size}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></SvgWrapper>;
const IconClipboardList = ({ size }) => <SvgWrapper size={size}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="12" y1="11" x2="16" y2="11"></line><line x1="12" y1="16" x2="16" y2="16"></line><line x1="8" y1="11" x2="8.01" y2="11"></line><line x1="8" y1="16" x2="8.01" y2="16"></line></SvgWrapper>;
const IconUser = ({ size }) => <SvgWrapper size={size}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></SvgWrapper>;
const IconCreditCard = ({ size }) => <SvgWrapper size={size}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></SvgWrapper>;

const getTabStyle = (isActive, activeColor = '#1a1a2e') => ({
    padding: '10px 20px',
    borderRadius: '30px',
    border: `1.5px solid ${isActive ? activeColor : '#ddd'}`,
    background: isActive ? activeColor : '#fff',
    color: isActive ? '#fff' : '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
});

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/api/admin/orders?status=${filter}`);
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await API.get('/api/admin/orders/stats/summary');
            setStats(res.data.stats);
        } catch (error) {
            console.error('Lỗi tải thống kê:', error);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        if (window.confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng thành "${status}"?`)) {
            try {
                await API.put(`/api/admin/orders/${orderId}/status`, { status });
                alert('Cập nhật trạng thái thành công!');
                fetchOrders();
                fetchStats();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.message || 'Cập nhật thất bại'));
            }
        }
    };

    const viewOrderDetail = async (orderId) => {
        try {
            const res = await API.get(`/api/admin/orders/${orderId}`);
            setSelectedOrder(res.data.order);
        } catch (error) {
            console.error('Lỗi tải chi tiết:', error);
        }
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0 ₫';
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa có';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const renderStatusIcon = (status) => {
        switch(status) {
            case 'pending': return <IconClock size={14} />;
            case 'confirmed': return <IconCheckCircle size={14} />;
            case 'shipping': return <IconTruck size={14} />;
            case 'completed': return <IconCheck size={14} />;
            case 'cancelled': return <IconXCircle size={14} />;
            default: return null;
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="order-management">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconPackage size={32} /> Quản lý đơn hàng</h1>

            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconClipboardList size={18} /> Tổng đơn hàng</h3>
                        <div className="stat-number">{stats.total_orders || 0}</div>
                    </div>
                    <div className="stat-card pending">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconClock size={18} /> Chờ xác nhận</h3>
                        <div className="stat-number">{stats.pending_orders || 0}</div>
                    </div>
                    <div className="stat-card confirmed">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCheckCircle size={18} /> Đã xác nhận</h3>
                        <div className="stat-number">{stats.confirmed_orders || 0}</div>
                    </div>
                    <div className="stat-card shipping">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconTruck size={18} /> Đang giao</h3>
                        <div className="stat-number">{stats.shipping_orders || 0}</div>
                    </div>
                    <div className="stat-card completed">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCheck size={18} /> Hoàn thành</h3>
                        <div className="stat-number">{stats.completed_orders || 0}</div>
                    </div>
                    <div className="stat-card revenue">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconDollar size={18} /> Doanh thu</h3>
                        <div className="stat-number">{formatPrice(stats.total_revenue)}</div>
                    </div>
                </div>
            )}

            <div className="filter-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '10px' }}>
                <button onClick={() => setFilter('all')} style={getTabStyle(filter === 'all')}>
                    <IconClipboardList size={16} /> Tất cả
                </button>
                <button onClick={() => setFilter('pending')} style={getTabStyle(filter === 'pending', '#f39c12')}>
                    <IconClock size={16} /> Chờ xác nhận
                </button>
                <button onClick={() => setFilter('confirmed')} style={getTabStyle(filter === 'confirmed', '#3498db')}>
                    <IconCheckCircle size={16} /> Đã xác nhận
                </button>
                <button onClick={() => setFilter('shipping')} style={getTabStyle(filter === 'shipping', '#9b59b6')}>
                    <IconTruck size={16} /> Đang giao
                </button>
                <button onClick={() => setFilter('completed')} style={getTabStyle(filter === 'completed', '#27ae60')}>
                    <IconCheck size={16} /> Hoàn thành
                </button>
                <button onClick={() => setFilter('cancelled')} style={getTabStyle(filter === 'cancelled', '#e74c3c')}>
                    <IconXCircle size={16} /> Đã hủy
                </button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>SĐT</th>
                        <th>Tổng tiền</th>
                        <th>Số lượng</th>
                        <th>Trạng thái</th>
                        <th>Ngày đặt</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không có đơn hàng nào</td></tr>
                    ) : (
                        orders.map(order => (
                            <tr key={order.id}>
                                <td><strong>{order.order_code}</strong></td>
                                <td>{order.user_name}<br /><small>{order.user_email}</small></td>
                                <td>{order.shipping_phone || 'Chưa có'}</td>
                                <td className="price">{formatPrice(order.total_amount)}</td>
                                <td>{order.items_count || 0}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {renderStatusIcon(order.status)}
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className={`status-select ${order.status}`}
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                                        >
                                            <option value="pending">Chờ xác nhận</option>
                                            <option value="confirmed">Đã xác nhận</option>
                                            <option value="shipping">Đang giao</option>
                                            <option value="completed">Hoàn thành</option>
                                            <option value="cancelled">Đã hủy</option>
                                        </select>
                                    </div>
                                </td>
                                <td>{formatDate(order.created_at)}</td>
                                <td><button onClick={() => viewOrderDetail(order.id)} className="btn-view">Chi tiết</button></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedOrder && (
                <div className="modal" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content large" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={() => setSelectedOrder(null)}>&times;</span>
                        <h2>Chi tiết đơn hàng</h2>
                        <p className="order-code">Mã đơn: <strong>{selectedOrder.order_code}</strong></p>
                        
                        <div className="info-section">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconUser size={20} /> Thông tin khách hàng</h3>
                            <div className="info-grid">
                                <div><label>Họ tên:</label> {selectedOrder.shipping_name || 'Chưa có'}</div>
                                <div><label>Email:</label> {selectedOrder.user_email || 'Chưa có'}</div>
                                <div><label>SĐT:</label> {selectedOrder.shipping_phone || 'Chưa có'}</div>
                                <div><label>Địa chỉ:</label> {selectedOrder.shipping_address || 'Chưa có'}</div>
                                {selectedOrder.note && <div><label>Ghi chú:</label> {selectedOrder.note}</div>}
                            </div>
                        </div>

                        <div className="info-section">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconPackage size={20} /> Sản phẩm</h3>
                            <table className="order-items-table">
                                <thead>
                                    <tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="product-info">
                                                    {item.image_url && <img src={item.image_url} alt={item.car_name} />}
                                                    <span>{item.car_name}</span>
                                                </div>
                                            </td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr><td colSpan="3" className="text-right"><strong>Tổng cộng:</strong></td><td className="total-price">{formatPrice(selectedOrder.total_amount)}</td></tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="info-section">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCreditCard size={20} /> Thông tin thanh toán</h3>
                            <div className="info-grid">
                                <div><label>Phương thức:</label> 
                                    {selectedOrder.payment_method === 'cod' ? '💰 COD' : 
                                     selectedOrder.payment_method === 'banking' ? '🏦 Chuyển khoản' : '📱 Ví điện tử'}
                                </div>
                                <div><label>Trạng thái thanh toán:</label> 
                                    <span className={selectedOrder.payment_status === 'paid' ? 'paid' : 'unpaid'}>
                                        {selectedOrder.payment_status === 'paid' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <select 
                                value={selectedOrder.status}
                                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                className="status-update"
                            >
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="shipping">Đang giao</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                            <button onClick={() => setSelectedOrder(null)} className="close-btn">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;