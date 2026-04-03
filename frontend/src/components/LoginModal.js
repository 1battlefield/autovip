import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './AuthModal.css';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            if (res.data.success) {
                login(res.data.token, res.data.user);
                onClose();
                // Reset form
                setFormData({ email: '', password: '' });
            } else {
                setError(res.data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                
                <h2>Đăng Nhập</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
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
                        <label>Mật Khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="auth-btn">
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>
                
                <p className="switch-auth">
                    Chưa có tài khoản?{' '}
                    <button onClick={onSwitchToRegister} className="switch-btn">
                        Đăng Ký
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;