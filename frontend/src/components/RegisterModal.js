import React, { useState } from 'react';
import API from '../config/api';
import { useAuth } from './AuthContext';
import './AuthModal.css';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra mật khẩu khớp
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Kiểm tra độ dài mật khẩu
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const res = await API.post('/api/auth/register', registerData);
            
            if (res.data.success) {
                login(res.data.token, res.data.user);
                onClose();
                // Reset form
                setFormData({
                    fullname: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: ''
                });
            } else {
                setError(res.data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Register error:', error);
            setError(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                
                <h2>Đăng Ký</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và Tên</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Nhập họ tên của bạn"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Số Điện Thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Mật Khẩu (ít nhất 6 ký tự)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Xác Nhận Mật Khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="auth-btn">
                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>
                
                <p className="switch-auth">
                    Đã có tài khoản?{' '}
                    <button onClick={onSwitchToLogin} className="switch-btn">
                        Đăng Nhập
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterModal;