import React, { useState, useEffect, useCallback } from 'react';
import API from '../config/api';
import { useAuth } from './AuthContext';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, onCartUpdate }) => {
    const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
    const [loading, setLoading] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderForm, setOrderForm] = useState({
        shipping_name: '',
        shipping_phone: '',
        shipping_address: '',
        note: '',
        payment_method: 'cod'
    });
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        try {
            const res = await API.get('/api/cart');
            setCart(res.data);
            if (onCartUpdate) {
                onCartUpdate(res.data.count || 0);
            }
        } catch (error) {
            console.error('Lỗi tải giỏ hàng:', error);
        }
    }, [onCartUpdate]);

    useEffect(() => {
        if (isOpen && user) {
            fetchCart();
        }
    }, [isOpen, user, fetchCart]);

    const updateQuantity = async (cartId, quantity) => {
        if (quantity < 1) {
            await removeItem(cartId);
            return;
        }
        try {
            await API.put(`/api/cart/${cartId}`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
        }
    };

    const removeItem = async (cartId) => {
        try {
            await API.delete(`/api/cart/${cartId}`);
            await fetchCart();
        } catch (error) {
            console.error('Lỗi xóa:', error);
        }
    };

const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await API.post('/api/orders', orderForm);
        if (res.data.success) {
            alert(`✅ Đặt hàng thành công! Mã đơn: ${res.data.order.order_code}`);
            onClose();
            setShowCheckout(false);
            setCart({ items: [], total: 0, count: 0 });
            if (onCartUpdate) {
                onCartUpdate(0);
            }
            // Phát sự kiện cập nhật giỏ hàng để header cập nhật số lượng
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    } catch (error) {
        alert('❌ Lỗi: ' + (error.response?.data?.message || 'Đặt hàng thất bại'));
    } finally {
        setLoading(false);
    }
};

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0 ₫';
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
    };

    if (!isOpen) return null;

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal-container" onClick={e => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h2>🛒 Giỏ hàng của bạn</h2>
                    <button className="cart-modal-close" onClick={onClose}>&times;</button>
                </div>

                {!showCheckout ? (
                    <>
                        <div className="cart-items">
                            {cart.items?.length === 0 ? (
                                <div className="empty-cart">
                                    <p>🛍️ Giỏ hàng trống</p>
                                    <button onClick={onClose} className="continue-shopping">
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            ) : (
                                cart.items?.map(item => (
                                    <div key={item.cart_id} className="cart-item">
                                        <img 
                                            src={item.image_url || `/images/${item.brand?.toLowerCase()}.jpg`} 
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <p>{item.brand}</p>
                                            <p className="cart-item-price">{formatPrice(item.price)}</p>
                                        </div>
                                        <div className="cart-item-actions">
                                            <button 
                                                onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                                                className="qty-btn"
                                            >-</button>
                                            <span className="qty-number">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                                                className="qty-btn"
                                            >+</button>
                                            <button 
                                                onClick={() => removeItem(item.cart_id)}
                                                className="remove-btn"
                                                title="Xóa"
                                            >🗑️</button>
                                        </div>
                                        <div className="cart-item-total">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.items?.length > 0 && (
                            <div className="cart-summary">
                                <div className="cart-total">
                                    <strong>Tổng cộng:</strong>
                                    <span className="total-price">{formatPrice(cart.total)}</span>
                                </div>
                                <button 
                                    onClick={() => setShowCheckout(true)}
                                    className="checkout-btn"
                                >
                                    📦 Tiến hành đặt hàng
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <form onSubmit={handleOrderSubmit} className="checkout-form">
                        <h3>📋 Thông tin giao hàng</h3>
                        
                        <div className="form-group">
                            <label>Họ tên *</label>
                            <input
                                type="text"
                                value={orderForm.shipping_name}
                                onChange={(e) => setOrderForm({...orderForm, shipping_name: e.target.value})}
                                placeholder={user?.fullname || "Nhập họ tên"}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại *</label>
                            <input
                                type="tel"
                                value={orderForm.shipping_phone}
                                onChange={(e) => setOrderForm({...orderForm, shipping_phone: e.target.value})}
                                placeholder={user?.phone || "Nhập số điện thoại"}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ giao hàng *</label>
                            <textarea
                                value={orderForm.shipping_address}
                                onChange={(e) => setOrderForm({...orderForm, shipping_address: e.target.value})}
                                rows="3"
                                placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường, quận, thành phố)"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phương thức thanh toán</label>
                            <select
                                value={orderForm.payment_method}
                                onChange={(e) => setOrderForm({...orderForm, payment_method: e.target.value})}
                            >
                                <option value="cod">💰 Thanh toán khi nhận hàng (COD)</option>
                                <option value="banking">🏦 Chuyển khoản ngân hàng</option>
                                <option value="momo">📱 Ví Momo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Ghi chú (tùy chọn)</label>
                            <textarea
                                value={orderForm.note}
                                onChange={(e) => setOrderForm({...orderForm, note: e.target.value})}
                                rows="2"
                                placeholder="Ghi chú về đơn hàng, thời gian giao hàng mong muốn..."
                            />
                        </div>

                        <div className="order-summary">
                            <p>📦 Số lượng sản phẩm: <strong>{cart.count}</strong></p>
                            <p>💰 Tổng tiền hàng: <strong>{formatPrice(cart.total)}</strong></p>
                            <p>🚚 Phí vận chuyển: <strong>Miễn phí</strong></p>
                            <div className="order-total">
                                Thành tiền: {formatPrice(cart.total)}
                            </div>
                        </div>

                        <div className="checkout-actions">
                            <button type="button" onClick={() => setShowCheckout(false)} className="back-btn">
                                ← Quay lại giỏ hàng
                            </button>
                            <button type="submit" disabled={loading} className="submit-order-btn">
                                {loading ? 'Đang xử lý...' : '✅ Xác nhận đặt hàng'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CartModal;