import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- 1. ĐỊNH NGHĨA CÁC ICON SVG TÙY CHỈNH ---
const SvgWrapper = ({ children, size = 18, color = "currentColor" }) => (
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
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {children}
  </svg>
);

const IconUsers = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </SvgWrapper>
);

const IconShield = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </SvgWrapper>
);

const IconMail = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </SvgWrapper>
);

const IconPhone = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.19-1.29a2 2 0 0 1 2.11-.45 12.81 12.81 0 0 0 2.81.62A2 2 0 0 1 22 16.92z"></path>
  </SvgWrapper>
);

const IconTrash = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </SvgWrapper>
);

const IconStats = ({ size, color }) => (
  <SvgWrapper size={size} color={color}>
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </SvgWrapper>
);

// --- 2. COMPONENT CHÍNH ---
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải users:', error);
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Xác nhận đổi quyền thành ${newRole.toUpperCase()}?`)) {
      try {
        await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { role: newRole });
        alert('Cập nhật thành công!');
        fetchUsers();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Thất bại'));
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
        alert('Đã xóa thành công!');
        fetchUsers();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Xóa thất bại'));
      }
    }
  };

  if (loading) return (
    <div style={{ padding: '50px', textAlign: 'center', fontSize: '18px', color: '#666' }}>
      🔄 Đang tải dữ liệu người dùng...
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconUsers size={32} color="#333" /> Quản lý người dùng
      </h1>
      
      {/* Thống kê nhanh */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <div style={{ padding: '10px', backgroundColor: '#e0e7ff', borderRadius: '8px' }}>
            <IconStats size={24} color="#4338ca" />
          </div>
          <div>
            <div style={{ color: '#666', fontSize: '14px' }}>Tổng số User</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>{users.length}</div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
            <IconShield size={24} color="#b45309" />
          </div>
          <div>
            <div style={{ color: '#666', fontSize: '14px' }}>Quản trị viên</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>
              {users.filter(u => u.role === 'admin').length}
            </div>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '12px', backgroundColor: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Họ tên</th>
              <th style={thStyle}>Liên lạc</th>
              <th style={thStyle}>Vai trò</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row">
                <td style={tdStyle}><span style={{ color: '#64748b' }}>#{user.id}</span></td>
                <td style={tdStyle}><strong>{user.fullname}</strong></td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <IconMail size={14} color="#64748b" /> {user.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                    <IconPhone size={14} color="#64748b" /> {user.phone || 'Chưa cập nhật'}
                  </div>
                </td>
                <td style={tdStyle}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: user.role === 'admin' ? '#fef3c7' : '#dcfce7',
                      color: user.role === 'admin' ? '#92400e' : '#166534',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị</option>
                  </select>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'transparent',
                      border: '1px solid #fca5a5',
                      color: '#ef4444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      margin: '0 auto',
                      fontSize: '13px',
                      transition: '0.2s',
                      opacity: (user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) ? 0.3 : 1
                    }}
                  >
                    <IconTrash size={14} color="currentColor" /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CSS nội bộ cải tiến
const cardStyle = {
  flex: 1,
  padding: '20px',
  background: '#fff',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
};

const thStyle = { 
  padding: '16px', 
  textAlign: 'left', 
  fontSize: '14px', 
  color: '#475569', 
  fontWeight: '600' 
};

const tdStyle = { 
  padding: '16px', 
  fontSize: '14px', 
  color: '#1e293b',
  verticalAlign: 'middle'
};

export default UserManagement;