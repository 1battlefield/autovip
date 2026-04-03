import React, { useState, useEffect } from 'react';
import API from '../../config/api';

// --- 1. ĐỊNH NGHĨA CÁC ICON SVG TÙY CHỈNH ---
const SvgWrapper = ({ children, size = 18, color = "currentColor", className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {children}
  </svg>
);

const IconClock = ({ size, color, className }) => (
  <SvgWrapper size={size} color={color} className={className}>
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </SvgWrapper>
);

const IconCheckCircle = ({ size, color, className }) => (
  <SvgWrapper size={size} color={color} className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </SvgWrapper>
);

const IconCheckCheck = ({ size, color, className }) => (
  <SvgWrapper size={size} color={color} className={className}>
    <path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path>
  </SvgWrapper>
);

const IconXCircle = ({ size, color, className }) => (
  <SvgWrapper size={size} color={color} className={className}>
    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
  </SvgWrapper>
);

const IconCalendar = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </SvgWrapper>
);

const IconUser = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </SvgWrapper>
);

const IconCar = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
    <circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle>
  </SvgWrapper>
);

const IconTrash = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </SvgWrapper>
);

const IconFilter = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </SvgWrapper>
);

// --- 2. COMPONENT CHÍNH ---
const TestDriveManagement = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTestDrives();
  }, []);

  const fetchTestDrives = async () => {
    try {
      const res = await API.get('/api/admin/testdrives');
      setTestDrives(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải lịch lái thử:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/api/admin/testdrives/${id}/status`, { status: newStatus });
      alert('Cập nhật trạng thái thành công!');
      fetchTestDrives();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Cập nhật thất bại'));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        text: 'Chờ xác nhận', 
        icon: <IconClock size={16} color="#d97706" />, 
        bg: '#fff3cd', 
        color: '#856404' 
      },
      confirmed: { 
        text: 'Đã xác nhận', 
        icon: <IconCheckCircle size={16} color="#059669" />, 
        bg: '#d4edda', 
        color: '#155724' 
      },
      completed: { 
        text: 'Đã hoàn thành', 
        icon: <IconCheckCheck size={16} color="#2563eb" />, 
        bg: '#cce5ff', 
        color: '#004085' 
      },
      cancelled: { 
        text: 'Đã hủy', 
        icon: <IconXCircle size={16} color="#dc2626" />, 
        bg: '#f8d7da', 
        color: '#721c24' 
      }
    };
    return configs[status] || configs.pending;
  };

  const filteredDrives = testDrives.filter(drive => {
    if (filter === 'all') return true;
    return drive.status === filter;
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', height: '100vh' }}>
      <span className="animate-spin">⏳</span> Đang tải dữ liệu...
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <IconCalendar size={32} color="#333" /> Quản lý lịch lái thử
      </h1>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            <IconFilter size={18} color="#666" />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '10px 10px 10px 35px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tất cả lịch hẹn</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        
        <span style={{ fontWeight: '500', color: '#444', backgroundColor: '#f0f0f0', padding: '8px 15px', borderRadius: '20px' }}>
          Tổng: {filteredDrives.length}
        </span>
      </div>

      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}>
          <tr>
            <th style={thStyle}>Khách hàng</th>
            <th style={thStyle}>Xe đăng ký</th>
            <th style={thStyle}>Thời gian hẹn</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrives.map(drive => {
            const config = getStatusConfig(drive.status);
            return (
              <tr key={drive.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ backgroundColor: '#e9ecef', padding: '8px', borderRadius: '50%' }}>
                      <IconUser size={18} color="#555" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{drive.fullname}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>📞 {drive.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IconCar size={16} color="#444" />
                    <span>{drive.car_name || 'N/A'}</span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '500' }}>{drive.test_time}</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>{formatDate(drive.test_date)}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {config.icon}
                    <select
                      value={drive.status}
                      onChange={(e) => handleStatusChange(drive.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        backgroundColor: config.bg,
                        color: config.color,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button 
                    onClick={() => {
                        if(window.confirm('Bạn có chắc muốn hủy lịch này?')) 
                        handleStatusChange(drive.id, 'cancelled')
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: drive.status === 'cancelled' || drive.status === 'completed' ? '#ccc' : '#dc3545',
                      cursor: drive.status === 'cancelled' || drive.status === 'completed' ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      margin: '0 auto'
                    }}
                    disabled={drive.status === 'cancelled' || drive.status === 'completed'}
                  >
                    <IconTrash size={16} color="currentColor" /> Hủy
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: '15px', textAlign: 'left' };
const tdStyle = { padding: '15px' };

export default TestDriveManagement;