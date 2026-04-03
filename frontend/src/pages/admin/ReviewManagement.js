import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        setLoading(true);
        setError('');
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Kiểm tra token có lấy được không
            
            if (!token) {
                setError('Chưa đăng nhập. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            let url = 'http://localhost:5000/api/admin/reviews';
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }
            
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('API trả về:', res.data);
            
            // Lấy mảng reviews từ response
            let reviewsArray = [];
            if (res.data && res.data.reviews && Array.isArray(res.data.reviews)) {
                reviewsArray = res.data.reviews;
            } else if (res.data && Array.isArray(res.data)) {
                reviewsArray = res.data;
            } else {
                reviewsArray = [];
            }
            
            setReviews(reviewsArray);
        } catch (error) {
            console.error('Lỗi chi tiết:', error);
            if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            } else if (error.response?.status === 403) {
                setError('Bạn không có quyền truy cập trang này.');
            } else {
                setError(error.response?.data?.message || 'Có lỗi xảy ra');
            }
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm('Duyệt đánh giá này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/admin/reviews/${id}`, 
                    { status: 'approved' },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                alert('Đã duyệt đánh giá!');
                fetchReviews();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại'));
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Từ chối đánh giá này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/admin/reviews/${id}`, 
                    { status: 'rejected' },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                alert('Đã từ chối đánh giá!');
                fetchReviews();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại'));
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa có';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p style={{ color: 'red', fontSize: '18px' }}>⚠️ {error}</p>
                <button 
                    onClick={() => window.location.href = '/login'}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Đăng nhập lại
                </button>
            </div>
        );
    }

    // Lọc theo filter
    let filteredReviews = reviews;
    if (filter !== 'all') {
        filteredReviews = reviews.filter(r => r.status === filter);
    }

    if (filteredReviews.length === 0) {
        return (
            <div>
                <h1>⭐ Quản lý đánh giá</h1>
                <div style={{ marginBottom: '20px' }}>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="pending">⏳ Chờ duyệt</option>
                        <option value="approved">✅ Đã duyệt</option>
                        <option value="rejected">❌ Từ chối</option>
                        <option value="all">📋 Tất cả</option>
                    </select>
                </div>
                <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px' }}>
                    <p>Không có đánh giá nào</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>⭐ Quản lý đánh giá</h1>

            <div style={{ marginBottom: '20px' }}>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="pending">⏳ Chờ duyệt</option>
                    <option value="approved">✅ Đã duyệt</option>
                    <option value="rejected">❌ Từ chối</option>
                    <option value="all">📋 Tất cả</option>
                </select>
            </div>

            <table style={{
                width: '100%',
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                borderCollapse: 'collapse',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <thead>
                    <tr style={{ background: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Người đánh giá</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Xe</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Đánh giá</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Nội dung</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Ngày</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Trạng thái</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReviews.map((review) => (
                        <tr key={review.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                            <td style={{ padding: '12px' }}>{review.id}</td>
                            <td style={{ padding: '12px' }}>
                                <strong>{review.fullname}</strong><br />
                                <small style={{ color: '#666' }}>{review.email}</small>
                            </td>
                            <td style={{ padding: '12px' }}>{review.car_name}</td>
                            <td style={{ padding: '12px', color: '#f39c12' }}>
                                {'⭐'.repeat(review.rating)} ({review.rating}/5)
                            </td>
                            <td style={{ padding: '12px', maxWidth: '250px' }}>
                                {review.comment}
                            </td>
                            <td style={{ padding: '12px' }}>{formatDate(review.created_at)}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '3px 8px',
                                    borderRadius: '3px',
                                    background: review.status === 'approved' ? '#d4edda' :
                                               review.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                                    color: review.status === 'approved' ? '#155724' :
                                           review.status === 'rejected' ? '#721c24' : '#856404'
                                }}>
                                    {review.status === 'approved' ? '✅ Đã duyệt' :
                                     review.status === 'rejected' ? '❌ Từ chối' : '⏳ Chờ duyệt'}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                {review.status === 'pending' && (
                                    <div>
                                        <button 
                                            onClick={() => handleApprove(review.id)}
                                            style={{
                                                padding: '5px 10px',
                                                background: '#27ae60',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                marginRight: '5px'
                                            }}
                                        >
                                            ✅ Duyệt
                                        </button>
                                        <button 
                                            onClick={() => handleReject(review.id)}
                                            style={{
                                                padding: '5px 10px',
                                                background: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ❌ Từ chối
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewManagement;