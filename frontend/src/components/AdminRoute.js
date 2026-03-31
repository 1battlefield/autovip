import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Đang kiểm tra quyền...</div>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    if (user.role !== 'admin') {
        return (
            <div className="no-permission">
                <h2>🚫 Không có quyền truy cập</h2>
                <p>Bạn không phải là admin. Vui lòng liên hệ quản trị viên.</p>
                <a href="/">Quay về trang chủ</a>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
