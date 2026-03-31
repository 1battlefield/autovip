import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchCarDetail();
    fetchReviews();
  }, [id]);

  const fetchCarDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
      setCar(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cars/${id}/reviews`);
      setReviews(res.data);
    } catch (error) {
      console.error('Lỗi tải đánh giá:', error);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
  };

  const handleBookTestDrive = () => {
    navigate(`/test-drive/${id}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để đánh giá');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        car_id: id,
        rating: userRating,
        comment: userComment
      });
      alert('Đánh giá của bạn đã được gửi và chờ duyệt!');
      setShowReviewForm(false);
      setUserComment('');
      setUserRating(5);
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Gửi đánh giá thất bại'));
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!car) return <div>Không tìm thấy xe</div>;

  return (
    <div className="container" style={{ marginTop: '100px', padding: '20px' }}>
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate(-1)} 
        style={{
          background: 'none',
          border: 'none',
          color: '#e74c3c',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        ← Quay lại
      </button>

      {/* Chi tiết xe */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Cột ảnh */}
        <div>
          <img 
            src={car.image_url} 
            alt={car.name} 
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }} 
          />
        </div>

        {/* Cột thông tin */}
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>{car.name}</h1>
          <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Hãng: {car.brand}</p>
          
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>
              {formatPrice(car.price)}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '15px',
            marginBottom: '30px'
          }}>
            <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>📅</div>
              <div style={{ fontWeight: 'bold' }}>{car.year}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Năm SX</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>⛽</div>
              <div style={{ fontWeight: 'bold' }}>{car.fuel_type}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Nhiên liệu</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>⚡</div>
              <div style={{ fontWeight: 'bold' }}>{car.speed} km/h</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Tốc độ</div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3>Mô tả</h3>
            <p style={{ lineHeight: '1.8', color: '#666' }}>{car.description}</p>
          </div>

          {/* Nút hành động */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={handleBookTestDrive}
              style={{
                flex: 1,
                padding: '15px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📅 Đặt lịch lái thử
            </button>
            <button 
              style={{
                flex: 1,
                padding: '15px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              💬 Tư vấn ngay
            </button>
          </div>
        </div>
      </div>

      {/* Phần đánh giá */}
      <div style={{ marginTop: '60px' }}>
        <h2>Đánh giá từ khách hàng</h2>
        
        {/* Form đánh giá */}
        {user ? (
          <div style={{ marginBottom: '30px' }}>
            {!showReviewForm ? (
              <button 
                onClick={() => setShowReviewForm(true)}
                style={{
                  padding: '10px 20px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ✍️ Viết đánh giá
              </button>
            ) : (
              <form onSubmit={handleSubmitReview} style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '10px',
                marginTop: '20px'
              }}>
                <h3>Viết đánh giá của bạn</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label>Đánh giá (1-5 sao): </label>
                  <select 
                    value={userRating} 
                    onChange={(e) => setUserRating(parseInt(e.target.value))}
                    style={{ marginLeft: '10px', padding: '5px' }}
                  >
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{num} sao</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nhận xét:</label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                    rows="4"
                    placeholder="Chia sẻ trải nghiệm của bạn về xe..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="auth-btn">Gửi đánh giá</button>
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)}
                    style={{
                      padding: '12px 20px',
                      background: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p style={{ color: '#666', marginBottom: '30px' }}>
            👉 <a href="#login" style={{ color: '#e74c3c' }}>Đăng nhập</a> để viết đánh giá
          </p>
        )}

        {/* Danh sách đánh giá */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} style={{ 
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>{review.fullname}</strong>
                  <span style={{ color: '#f39c12' }}>
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p style={{ color: '#666' }}>{review.comment}</p>
                <small style={{ color: '#999' }}>
                  {new Date(review.created_at).toLocaleDateString('vi-VN')}
                </small>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;