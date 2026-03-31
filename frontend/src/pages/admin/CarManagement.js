import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// --- 1. ĐỊNH NGHĨA CÁC ICON SVG TÙY CHỈNH (ĐÃ TINH CHỈNH ĐẸP HƠN) ---
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

const IconPlus = ({ size, color }) => (
    <SvgWrapper size={size} color={color}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </SvgWrapper>
);

const IconEdit = ({ size, color }) => (
    <SvgWrapper size={size} color={color}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </SvgWrapper>
);

const IconTrash = ({ size, color }) => (
    <SvgWrapper size={size} color={color}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </SvgWrapper>
);

const IconCar = ({ size, color }) => (
    <SvgWrapper size={size} color={color}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
        <circle cx="7" cy="17" r="2"></circle>
        <circle cx="17" cy="17" r="2"></circle>
    </SvgWrapper>
);

const IconInfo = ({ size, color }) => (
    <SvgWrapper size={size} color={color}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </SvgWrapper>
);

// --- 2. COMPONENT CHÍNH ---
const CarManagement = () => {
    const [cars, setCars] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({
        name: '', brand: '', price: '', year: '',
        fuel_type: '', speed: '', image_url: '', description: ''
    });

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCars();
    }, []);

    useEffect(() => {
        if (location.state && location.state.editCarId && cars.length > 0) {
            const carToEdit = cars.find(c => c.id === location.state.editCarId);
            if (carToEdit) {
                handleEdit(carToEdit);
                navigate('/admin/cars', { replace: true, state: {} });
            }
        }
    }, [location.state, cars, navigate]);

    const fetchCars = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/cars');
            setCars(res.data.data || res.data);
        } catch (error) {
            console.error('Lỗi tải xe:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCar) {
                await axios.put(`http://localhost:5000/api/admin/cars/${editingCar.id}`, formData);
                alert('Cập nhật xe thành công!');
            } else {
                await axios.post('http://localhost:5000/api/admin/cars', formData);
                alert('Thêm xe thành công!');
            }
            setShowForm(false);
            setEditingCar(null);
            fetchCars();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại'));
        }
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        setFormData(car);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa xe này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/cars/${id}`);
                alert('Xóa xe thành công!');
                fetchCars();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.message || 'Xóa thất bại'));
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: 0, color: '#1e293b' }}>
                    <IconCar size={36} color="#2563eb" /> Quản lý kho xe
                </h1>
                <button 
                    onClick={() => {
                        setEditingCar(null);
                        setFormData({
                            name: '', brand: '', price: '', year: '',
                            fuel_type: '', speed: '', image_url: '', description: ''
                        });
                        setShowForm(true);
                    }}
                    style={{ 
                        padding: '12px 24px', 
                        backgroundColor: '#2563eb', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '10px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                        transition: '0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                    <IconPlus size={20} color="white" /> Thêm xe mới
                </button>
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content" style={{ maxWidth: '650px', borderRadius: '15px', padding: '30px' }}>
                        <span className="close" onClick={() => setShowForm(false)}>&times;</span>
                        <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {editingCar ? <IconEdit size={24} color="#2563eb" /> : <IconPlus size={24} color="#2563eb" />}
                            {editingCar ? 'Cập nhật thông tin xe' : 'Đăng ký xe mới'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Tên dòng xe</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} placeholder="Ví dụ: Mercedes-Benz S450" />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Hãng sản xuất</label>
                                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Giá niêm yết (VNĐ)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Năm đời</label>
                                <input type="number" name="year" value={formData.year} onChange={handleInputChange} required style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Động cơ/Nhiên liệu</label>
                                <select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} required style={inputStyle}>
                                    <option value="">Chọn loại</option>
                                    <option value="Xăng">Xăng</option>
                                    <option value="Dầu">Dầu</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Điện">Điện</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Đường dẫn ảnh (URL)</label>
                                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} required style={inputStyle} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Mô tả chi tiết</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required style={{ ...inputStyle, height: 'auto' }} />
                            </div>
                            <button type="submit" className="auth-btn" style={{ gridColumn: 'span 2', padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                                {editingCar ? 'Lưu thay đổi' : 'Xác nhận thêm xe'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead style={{ backgroundColor: '#f6f9fc' }}>
                        <tr>
                            <th style={thStyle}>Hình ảnh</th>
                            <th style={thStyle}>Sản phẩm</th>
                            <th style={thStyle}>Giá niêm yết</th>
                            <th style={thStyle}>Đặc tính</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map(car => (
                            <tr key={car.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={tdStyle}>
                                    <img 
                                        src={car.image_url} 
                                        alt={car.name}
                                        style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>{car.name}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <IconInfo size={12} color="#64748b" /> {car.brand}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '15px' }}>
                                        {car.price?.toLocaleString('vi-VN')} ₫
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontSize: '13px', fontWeight: '500' }}>📅 Đời {car.year}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>⛽ {car.fuel_type}</div>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                        <button onClick={() => handleEdit(car)} title="Chỉnh sửa" style={actionBtnStyle}>
                                            <IconEdit size={18} color="#2563eb" />
                                        </button>
                                        <button onClick={() => handleDelete(car.id)} title="Xóa bỏ" style={{ ...actionBtnStyle, borderColor: '#fecaca' }}>
                                            <IconTrash size={18} color="#ef4444" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- STYLES TỔNG HỢP ---
const thStyle = { padding: '18px 15px', textAlign: 'left', color: '#f6f9fd', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '18px 15px', verticalAlign: 'middle' };
const actionBtnStyle = { 
    background: '#fff', 
    border: '1px solid #e2e8f0', 
    padding: '8px', 
    borderRadius: '8px', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
};

export default CarManagement;