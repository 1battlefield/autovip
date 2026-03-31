import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/contacts');
      setContacts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải liên hệ:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/contacts/${id}/read`);
      fetchContacts();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Cập nhật thất bại'));
    }
  };

  const handleSendReply = async (id) => {
    if (!replyMessage.trim()) {
      alert('Vui lòng nhập nội dung phản hồi');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/admin/contacts/${id}/reply`, {
        message: replyMessage
      });
      alert('Đã gửi phản hồi thành công!');
      setSelectedContact(null);
      setReplyMessage('');
      fetchContacts();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Gửi phản hồi thất bại'));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div>
      <h1>Quản lý liên hệ</h1>

      {/* Bảng liên hệ */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người gửi</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id} style={{
              background: contact.status === 'new' ? '#fff3cd' : 'white'
            }}>
              <td>{contact.id}</td>
              <td>
                <strong>{contact.name}</strong>
                <br />
                <small>{contact.email}</small>
                {contact.phone && <><br /><small>{contact.phone}</small></>}
              </td>
              <td>{contact.subject}</td>
              <td style={{ maxWidth: '300px' }}>
                <p style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {contact.message}
                </p>
              </td>
              <td>{formatDate(contact.created_at)}</td>
              <td>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '3px',
                  background: contact.status === 'new' ? '#fff3cd' :
                             contact.status === 'read' ? '#d4edda' : '#cce5ff',
                  color: contact.status === 'new' ? '#856404' :
                         contact.status === 'read' ? '#155724' : '#004085'
                }}>
                  {contact.status === 'new' ? '📧 Mới' :
                   contact.status === 'read' ? '📖 Đã xem' : '✉️ Đã phản hồi'}
                </span>
              </td>
              <td>
                {contact.status === 'new' && (
                  <button 
                    onClick={() => handleMarkAsRead(contact.id)}
                    className="btn-edit"
                    style={{ marginRight: '5px' }}
                  >
                    📖 Đã xem
                  </button>
                )}
                <button 
                  onClick={() => setSelectedContact(contact)}
                  className="btn-view"
                >
                  ✉️ Phản hồi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal phản hồi */}
      {selectedContact && (
        <div className="modal" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <span className="close" onClick={() => setSelectedContact(null)}>&times;</span>
            
            <h2>Phản hồi liên hệ</h2>
            
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
              <p><strong>Người gửi:</strong> {selectedContact.name}</p>
              <p><strong>Email:</strong> {selectedContact.email}</p>
              {selectedContact.phone && <p><strong>SĐT:</strong> {selectedContact.phone}</p>}
              <p><strong>Tiêu đề:</strong> {selectedContact.subject}</p>
              <p><strong>Nội dung:</strong> {selectedContact.message}</p>
            </div>

            <div className="form-group">
              <label>Nội dung phản hồi</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows="6"
                placeholder="Nhập nội dung phản hồi..."
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleSendReply(selectedContact.id)}
                className="auth-btn"
              >
                Gửi phản hồi
              </button>
              <button 
                onClick={() => setSelectedContact(null)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;