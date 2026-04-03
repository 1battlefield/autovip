import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../config/api';
import { useAuth } from '../components/AuthContext';

const TestDrivePage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    test_date: '',
    test_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchCarDetail();
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullname: user.fullname || '',
        email: user.email || ''
      }));
    }
  }, [carId, user]);

  const fetchCarDetail = async () => {
    try {
      const res = await API.get(`/api/cars/${carId}`);
      setCar(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để đặt lịch lái thử');
      return;
    }

    try {
      await API.post('/api/testdrive', {
        ...formData,
        car_id: carId
      });
      
      alert('🎉 Đặt lịch thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.');
      navigate('/');
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đặt lịch thất bại'));
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
  };

  // Lấy ngày mai làm ngày tối thiểu
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!car) return <div>Không tìm thấy xe</div>;

  return (
    <div className="container" style={{ marginTop: '100px', maxWidth: '800px' }}>
      {/* Header */}
      <button 
        onClick={() => navigate(-1)} 
        style={{
          background: 'none',
          border: 'none',
          color: '#cf0700',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Quay lại
      </button>

      <div style={{ 
        background: 'white', 
        borderRadius: '10px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Thông tin xe */}
        <div style={{ 
          background: 'linear-gradient(135deg, #cf0700 0%, #cf0700 100%)',
          padding: '30px',
          color: 'white'
        }}>
          <h1 style={{ margin: 0 }}>Đặt lịch lái thử</h1>
          <p style={{ marginTop: '10px', opacity: 0.9 }}>{car.name}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0' }}>
            {formatPrice(car.price)}
          </p>
        </div>

        {/* Form đặt lịch */}
        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Họ tên *</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="Nhập họ tên của bạn"
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập email của bạn"
              />
            </div>
            
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại"
              />
            </div>
            
            <div className="form-group">
              <label>Ngày lái thử *</label>
              <input
                type="date"
                name="test_date"
                value={formData.test_date}
                onChange={handleChange}
                min={minDate}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Giờ lái thử *</label>
              <select 
                name="test_time" 
                value={formData.test_time} 
                onChange={handleChange} 
                required
              >
                <option value="">Chọn giờ</option>
                <option value="08:00-09:00">08:00 - 09:00</option>
                <option value="09:00-10:00">09:00 - 10:00</option>
                <option value="10:00-11:00">10:00 - 11:00</option>
                <option value="13:00-14:00">13:00 - 14:00</option>
                <option value="14:00-15:00">14:00 - 15:00</option>
                <option value="15:00-16:00">15:00 - 16:00</option>
                <option value="16:00-17:00">16:00 - 17:00</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Ghi chú thêm</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Bạn có yêu cầu đặc biệt gì không? (Ví dụ: muốn lái thử xe số sàn/tự động,...)"
              />
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
            <button type="submit" className="auth-btn" style={{ flex: 2 }}>
              Xác nhận đặt lịch
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')}
              style={{
                flex: 1,
                padding: '14px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Hủy
            </button>
          </div>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            * Thông tin bắt buộc. Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 24h.
          </p>
        </form>
      </div>
    </div>
  );
};

export default TestDrivePage;