import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/news');
      setNews(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải tin tức:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await axios.put(`http://localhost:5000/api/admin/news/${editingNews.id}`, formData);
        alert('Cập nhật tin tức thành công!');
      } else {
        await axios.post('http://localhost:5000/api/admin/news', formData);
        alert('Thêm tin tức thành công!');
      }
      setShowForm(false);
      setEditingNews(null);
      setFormData({ title: '', content: '', image_url: '', status: 'draft' });
      fetchNews();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại'));
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tin tức này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/news/${id}`);
        alert('Xóa tin tức thành công!');
        fetchNews();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Xóa thất bại'));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Quản lý tin tức</h1>
        <button 
          onClick={() => {
            setEditingNews(null);
            setFormData({ title: '', content: '', image_url: '', status: 'draft' });
            setShowForm(true);
          }}
          className="btn-edit"
          style={{ padding: '10px 20px' }}
        >
          + Thêm tin mới
        </button>
      </div>

      {/* Modal thêm/sửa tin tức */}
      {showForm && (
        <div className="modal" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <span className="close" onClick={() => setShowForm(false)}>&times;</span>
            <h2>{editingNews ? 'Sửa tin tức' : 'Thêm tin tức mới'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>URL hình ảnh</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">📝 Bản nháp</option>
                  <option value="published">🚀 Đã xuất bản</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="10"
                  required
                />
              </div>
              
              <button type="submit" className="auth-btn">
                {editingNews ? 'Cập nhật' : 'Đăng tin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bảng tin tức */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Lượt xem</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {news.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                ) : (
                  <span style={{ color: '#999' }}>No image</span>
                )}
              </td>
              <td style={{ maxWidth: '200px' }}>
                <strong>{item.title}</strong>
              </td>
              <td style={{ maxWidth: '300px' }}>
                <p style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.content}
                </p>
              </td>
              <td>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '3px',
                  background: item.status === 'published' ? '#d4edda' : '#fff3cd',
                  color: item.status === 'published' ? '#155724' : '#856404'
                }}>
                  {item.status === 'published' ? '🚀 Đã xuất bản' : '📝 Bản nháp'}
                </span>
              </td>
              <td>{item.views || 0}</td>
              <td>{formatDate(item.created_at)}</td>
              <td>
                <button 
                  onClick={() => handleEdit(item)}
                  className="btn-edit"
                  style={{ marginRight: '5px' }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="btn-delete"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsManagement;