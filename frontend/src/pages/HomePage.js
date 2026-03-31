import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const SvgWrapper = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {children}
  </svg>
);

const IconSearch = ({ size }) => <SvgWrapper size={size}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></SvgWrapper>;
const IconArrowLeft = ({ size }) => <SvgWrapper size={size}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></SvgWrapper>;
const IconFlame = ({ size }) => <SvgWrapper size={size}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></SvgWrapper>;
const IconFrown = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></SvgWrapper>;
const IconCalendar = ({ size }) => <SvgWrapper size={size}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></SvgWrapper>;
const IconFuel = ({ size }) => <SvgWrapper size={size}><line x1="3" y1="22" x2="21" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></SvgWrapper>;
const IconZap = ({ size }) => <SvgWrapper size={size}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></SvgWrapper>;
const IconEye = ({ size }) => <SvgWrapper size={size}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></SvgWrapper>;
const IconCart = ({ size }) => <SvgWrapper size={size}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></SvgWrapper>;
const IconSteeringWheel = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><circle cx="12" cy="12" r="2"/></SvgWrapper>;
const IconCar = ({ size }) => <SvgWrapper size={size}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM5 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></SvgWrapper>;
const IconStar = ({ size }) => <SvgWrapper size={size}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></SvgWrapper>;
const IconSparkles = ({ size }) => <SvgWrapper size={size}><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></SvgWrapper>;
const IconShield = ({ size }) => <SvgWrapper size={size}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></SvgWrapper>;
const IconHexagon = ({ size }) => <SvgWrapper size={size}><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></SvgWrapper>;
const IconTarget = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></SvgWrapper>;
const IconCircleDivide = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></SvgWrapper>;
const IconTriangleStar = ({ size }) => <SvgWrapper size={size}><circle cx="12" cy="12" r="10"/><path d="M12 2v10l8.5 5"/><path d="M12 12l-8.5 5"/></SvgWrapper>;
const IconCircles = ({ size }) => <SvgWrapper size={size}><circle cx="7" cy="12" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="17" cy="12" r="3"/></SvgWrapper>;
const IconEdit = ({ size }) => <SvgWrapper size={size}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></SvgWrapper>;

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  // Lọc xe khi selectedBrand thay đổi
  useEffect(() => {
    if (selectedBrand) {
      const filtered = allCars.filter(car => car.brand === selectedBrand);
      setCars(filtered);
      setSearchResults(null);
    } else {
      setCars(allCars.slice(0, 6));
    }
  }, [selectedBrand, allCars]);

  const fetchData = async () => {
    try {
        // Lấy tất cả xe
        const carsRes = await axios.get('http://localhost:5000/api/cars');
        const allCarsData = carsRes.data.data || carsRes.data;
        console.log('Tất cả xe từ API:', allCarsData.length);
        setAllCars(allCarsData);
        
        // Hiển thị 6 xe nổi bật ban đầu
        setCars(allCarsData.slice(0, 6));
        
        // Lấy danh sách thương hiệu
        const brandsRes = await axios.get('http://localhost:5000/api/brands');
        setBrands(brandsRes.data.data || brandsRes.data);
        
        setLoading(false);
    } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        setLoading(false);
    }
};

  const handleSearch = async (e) => {
    e.preventDefault();
    const keyword = searchKeyword.trim();
    
    if (!keyword) {
        alert('Vui lòng nhập từ khóa tìm kiếm');
        return;
    }

    setIsSearching(true);
    try {
        const res = await axios.get(`http://localhost:5000/api/cars/search?keyword=${keyword}`);
        console.log('API trả về:', res.data);
        
        const results = res.data.data || [];
        
        if (results.length === 0) {
            alert(`Không tìm thấy xe nào với từ khóa "${keyword}"`);
            setSearchResults([]);
        } else {
            setSearchResults(results);
            console.log('Tìm thấy:', results.length, 'xe');
        }
        setSelectedBrand(null);
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi tìm kiếm');
    } finally {
        setIsSearching(false);
    }
};

// Hàm lọc theo thương hiệu
const filterByBrand = (brand) => {
    console.log('Đang lọc theo hãng:', brand);
    setSelectedBrand(brand);
    setSearchKeyword('');
    setSearchResults(null); // Xóa kết quả tìm kiếm khi lọc theo thương hiệu
};

  // Hàm xem tất cả xe
  const showAllCars = () => {
    console.log('showAllCars được gọi');
    console.log('allCars length:', allCars.length);
    console.log('allCars data:', allCars);
    setSelectedBrand(null);
    setSearchResults(null);
    setSearchKeyword('');
    setCars(allCars);
};

 const viewCarDetail = async (id) => {
    console.log('Xem chi tiết xe ID:', id);
    if (!id || isNaN(id)) {
        console.error('ID xe không hợp lệ:', id);
        return;
    }
    try {
        const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
        console.log('Dữ liệu xe:', res.data);
        setSelectedCar(res.data.data || res.data);
    } catch (error) {
        console.error('Lỗi tải chi tiết xe:', error);
        alert('Không thể tải chi tiết xe. Vui lòng thử lại!');
    }
};

  const closeDetail = () => {
    setSelectedCar(null);
  };

  const handleBookTestDrive = (carId) => {
    if (!user) {
      alert('Vui lòng đăng nhập để đặt lịch lái thử');
      return;
    }
    navigate(`/test-drive/${carId}`);
  };

  const addToCart = async (carId) => {
    if (!user) {
      alert('Vui lòng đăng nhập để mua xe');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/cart', { car_id: carId });
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Thêm vào giỏ thất bại'));
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchKeyword('');
    setSelectedBrand(null);
    setCars(allCars.slice(0, 6));
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  const displayCars = searchResults || cars;
  const isFiltering = searchResults !== null || selectedBrand !== null;

  return (
    <>
      {/* Hero Section with Search */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Tìm Kiếm Xe Mơ Ước Của Bạn</h1>
            <p>Hơn 500+ mẫu xe cao cấp từ các thương hiệu hàng đầu</p>
            
            <form onSubmit={handleSearch} style={{ 
              marginTop: '30px',
              display: 'flex',
              maxWidth: '500px',
              margin: '30px auto 0'
            }}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Nhập tên xe hoặc hãng xe (VD: Ferrari, BMW, Tesla...)"
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  border: 'none',
                  borderRadius: '50px 0 0 50px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 50px 50px 0',
                  cursor: isSearching ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: isSearching ? 0.7 : 1,
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <IconSearch size={20} />
                {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </form>

            {isFiltering && (
              <button
                onClick={clearSearch}
                style={{
                  marginTop: '15px',
                  padding: '10px 25px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                <IconArrowLeft size={18} /> Xem tất cả xe
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section id="cars" className="featured-cars">
        <div className="container">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {searchResults 
              ? <><IconSearch size={32} /> Kết quả tìm kiếm "{searchKeyword}"</>
              : selectedBrand 
                ? `${selectedBrand} - ${displayCars.length} mẫu xe`
                : <><IconFlame size={32} /> Xe Nổi Bật</>
            }
          </h2>
          
          {searchResults && searchResults.length > 0 && (
            <div className="search-stats">
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <IconSearch size={18} /> Tìm thấy <strong>{searchResults.length}</strong> kết quả cho từ khóa "<strong>{searchKeyword}</strong>"
              </p>
            </div>
          )}
          
          {displayCars.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <IconFrown size={24} /> Không tìm thấy xe phù hợp
                {searchKeyword && ` với từ khóa "${searchKeyword}"`}
              </p>
              <p style={{ color: '#999', marginBottom: '30px' }}>
                Vui lòng thử lại với từ khóa khác hoặc xem tất cả xe
              </p>
              <button onClick={clearSearch} className="btn-detail" style={{ width: 'auto', padding: '12px 30px', margin: '0 auto' }}>
                <IconArrowLeft size={18} /> Xem tất cả xe
              </button>
            </div>
          ) : (
            <div className="car-grid">
              {displayCars.map(car => (
                <div key={car.id} className="car-card">
                  <div className="car-image">
                    <img 
                      src={car.image_url || '/images/placeholder-car.jpg'} 
                      alt={car.name}
                      onError={(e) => {
                          e.target.src = '/images/placeholder-car.jpg';
                          e.target.onerror = null;
                      }}
                    />
                    
                    {user?.role === 'admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/admin/cars', { state: { editCarId: car.id } });
                        }}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: '#f39c12',
                          color: 'white',
                          border: 'none',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 10,
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title="Chỉnh sửa xe"
                      >
                        <IconEdit size={18} />
                      </button>
                    )}

                    {car.year >= 2023 && (
                      <span className="car-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IconFlame size={14} /> HOT {car.year}
                      </span>
                    )}
                  </div>
                  <div className="car-info">
                    <h3>{car.name}</h3>
                    <span className="car-brand">{car.brand}</span>
                    <p className="price">{formatPrice(car.price)}</p>
                    <div className="specs">
                      <span><IconCalendar size={16} /> {car.year}</span>
                      <span><IconFuel size={16} /> {car.fuel_type}</span>
                      <span><IconZap size={16} /> {car.speed} km/h</span>
                    </div>
                    <div className="car-actions">
                      <div className="car-actions-row">
                        <button onClick={() => viewCarDetail(car.id)} className="btn-detail">
                          <IconEye size={18} /> Xem Chi Tiết
                        </button>
                        <button onClick={() => addToCart(car.id)} className="btn-buy">
                          <IconCart size={18} /> Mua ngay
                        </button>
                      </div>
                      <button onClick={() => handleBookTestDrive(car.id)} className="btn-test-drive">
                        <IconSteeringWheel size={18} /> Đặt lịch lái thử
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brands - Có thể click để lọc (hiển thị cả khi đang tìm kiếm) */}
      <section id="brands" className="brands">
        <div className="container">
          <h2 className="section-title">Thương Hiệu</h2>
          <div className="brand-grid">
            <div 
              className={`brand-item ${!selectedBrand ? 'active' : ''}`}
              onClick={() => {
                console.log('Click Tất cả');
                showAllCars();
              }}
            >
              <div className="brand-icon"><IconCar size={40} /></div>
              <span className="brand-name">Tất cả</span>
              <span className="brand-count">{allCars.length} xe</span>
            </div>
            
            {brands.map((brand, index) => {
              const brandCount = allCars.filter(car => car.brand === brand.brand).length;
              const brandIcons = {
                'Ferrari': <IconShield size={40} />,
                'Lamborghini': <IconHexagon size={40} />,
                'Porsche': <IconTarget size={40} />,
                'BMW': <IconCircleDivide size={40} />,
                'Mercedes': <IconTriangleStar size={40} />,
                'Audi': <IconCircles size={40} />,
                'Tesla': <IconZap size={40} />
              };
              const icon = brandIcons[brand.brand] || <IconCar size={40} />;
              
              return (
                <div 
                  key={index} 
                  className={`brand-item ${selectedBrand === brand.brand ? 'active' : ''}`}
                  onClick={() => {
                    console.log('Click brand:', brand.brand);
                    filterByBrand(brand.brand);
                  }}
                >
                  <div className="brand-icon">{icon}</div>
                  <span className="brand-name">{brand.brand}</span>
                  <span className="brand-count">{brandCount} xe</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Phần đề xuất xe nổi tiếng - chỉ hiện khi không có tìm kiếm và không lọc brand */}
      {!searchResults && !selectedBrand && (
        <section className="featured-cars" style={{ background: '#fff', paddingTop: '0' }}>
          <div className="container">
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <IconSparkles size={32} /> Xe Đề Xuất
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
              Những mẫu xe được yêu thích nhất từ các thương hiệu hàng đầu thế giới
            </p>
            <div className="car-grid">
              {['Ferrari', 'Lamborghini', 'Porsche', 'BMW', 'Mercedes', 'Audi', 'Tesla'].map(brand => {
                const brandCar = allCars.find(car => car.brand === brand);
                if (!brandCar) return null;
                
                return (
                  <div key={brandCar.id} className="car-card">
                    <div className="car-image">
                      <img 
                        src={brandCar.image_url || 'https://via.placeholder.com/300x200'} 
                        alt={brandCar.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200';
                        }}
                      />
                      
                      {user?.role === 'admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/cars', { state: { editCarId: brandCar.id } });
                          }}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: '#f39c12',
                            color: 'white',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          title="Chỉnh sửa xe"
                        >
                          <IconEdit size={18} />
                        </button>
                      )}

                      <span className="car-badge" style={{
                        background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <IconStar size={14} /> Đề xuất
                      </span>
                    </div>
                    <div className="car-info">
                      <h3>{brandCar.name}</h3>
                      <span className="car-brand">{brandCar.brand}</span>
                      <p className="price">{formatPrice(brandCar.price)}</p>
                      <div className="specs">
                        <span><IconCalendar size={16} /> {brandCar.year}</span>
                        <span><IconFuel size={16} /> {brandCar.fuel_type}</span>
                        <span><IconZap size={16} /> {brandCar.speed} km/h</span>
                      </div>
                      <div className="car-actions">
                        <div className="car-actions-row">
                          <button onClick={() => viewCarDetail(brandCar.id)} className="btn-detail">
                            <IconEye size={18} /> Xem Chi Tiết
                          </button>
                          <button onClick={() => addToCart(brandCar.id)} className="btn-buy">
                            <IconCart size={18} /> Mua ngay
                          </button>
                        </div>
                        <button onClick={() => handleBookTestDrive(brandCar.id)} className="btn-test-drive">
                          <IconSteeringWheel size={18} /> Đặt lịch lái thử
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Car Detail Modal */}
      {selectedCar && (
        <div className="modal" onClick={closeDetail}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={closeDetail}>&times;</span>
            
            <h2 style={{ marginBottom: '15px' }}>{selectedCar.name}</h2>
            
            <img 
              src={selectedCar.image_url || 'https://via.placeholder.com/500x300'} 
              alt={selectedCar.name}
              style={{ 
                width: '100%', 
                height: '250px', 
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            />
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Giá</div>
                <div style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                  {formatPrice(selectedCar.price)}
                </div>
              </div>
              <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Hãng</div>
                <div style={{ fontWeight: 'bold' }}>{selectedCar.brand}</div>
              </div>
              <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Năm SX</div>
                <div style={{ fontWeight: 'bold' }}>{selectedCar.year}</div>
              </div>
              <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Nhiên liệu</div>
                <div style={{ fontWeight: 'bold' }}>{selectedCar.fuel_type}</div>
              </div>
              <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Tốc độ</div>
                <div style={{ fontWeight: 'bold' }}>{selectedCar.speed} km/h</div>
              </div>
            </div>
            
            <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
              {selectedCar.description}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => {
                    closeDetail();
                    navigate(`/car/${selectedCar.id}`);
                  }}
                  className="btn-detail"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <IconEye size={18} /> Xem trang chi tiết
                </button>
                <button 
                  onClick={() => {
                    closeDetail();
                    addToCart(selectedCar.id);
                  }}
                  style={{
                    flex: 1,
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '12px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <IconCart size={18} /> Mua ngay
                </button>
              </div>
              <button 
                onClick={() => {
                  closeDetail();
                  handleBookTestDrive(selectedCar.id);
                }}
                style={{
                  width: '100%',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <IconCalendar size={18} /> Đặt lịch lái thử
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;