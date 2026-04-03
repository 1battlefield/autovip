import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import TestDrivePage from './pages/TestDrivePage';
import UserProfilePage from './pages/UserProfilePage';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CarManagement from './pages/admin/CarManagement';
import UserManagement from './pages/admin/UserManagement';
import TestDriveManagement from './pages/admin/TestDriveManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import ContactManagement from './pages/admin/ContactManagement';
import NewsManagement from './pages/admin/NewsManagement';
import OrderManagement from './pages/admin/OrderManagement'; 
import './App.css';

// Footer component cho toàn bộ website
const Footer = () => (
  <footer>
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>AutoVip</h3>
          <p>Showroom xe hơi cao cấp hàng đầu Việt Nam</p>
          <p>Chuyên cung cấp các dòng xe sang, siêu xe chính hãng</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Liên Hệ</h4>
          <p><i className="fas fa-map-marker-alt"></i> 123 Nguyễn Văn Linh, Quận 7, TP.HCM</p>
          <p><i className="fas fa-phone"></i> 1900 1234</p>
          <p><i className="fas fa-envelope"></i> info@autovip.com</p>
        </div>
        
        <div className="footer-section">
          <h4>Giờ Làm Việc</h4>
          <p>Thứ 2 - Thứ 7: 8:00 - 20:00</p>
          <p>Chủ Nhật: 9:00 - 17:00</p>
          <p>Phục vụ 24/7 qua hotline</p>
        </div>

        <div className="footer-section">
          <h4>Chính Sách</h4>
          <p><a href="#">Chính sách bảo mật</a></p>
          <p><a href="#">Chính sách đổi trả</a></p>
          <p><a href="#">Chính sách bảo hành</a></p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 AutoVip. All rights reserved. Designed by YourTeam</p>
      </div>
    </div>
  </footer>
);

// Layout chính cho tất cả các trang (trừ admin)
const MainLayout = ({ children }) => (
  <>
    <Header />
    <main style={{ minHeight: 'calc(100vh - 70px - 300px)' }}>
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Trang chủ */}
            <Route path="/" element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            } />
            
            {/* Chi tiết xe */}
            <Route path="/car/:id" element={
              <MainLayout>
                <CarDetailPage />
              </MainLayout>
            } />
            
            {/* Đặt lịch lái thử */}
            <Route path="/test-drive/:carId" element={
              <MainLayout>
                <TestDrivePage />
              </MainLayout>
            } />
            
            {/* Trang cá nhân */}
            <Route path="/profile" element={
              <MainLayout>
                <UserProfilePage />
              </MainLayout>
            } />
            
            {/* Admin - Layout riêng không có header/footer */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="cars" element={<CarManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="testdrives" element={<TestDriveManagement />} />
              <Route path="reviews" element={<ReviewManagement />} />
              <Route path="contacts" element={<ContactManagement />} />
              <Route path="news" element={<NewsManagement />} />
            </Route>

            {/* Trang 404 */}
            <Route path="*" element={
              <MainLayout>
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                  <h1>404</h1>
                  <p>Trang bạn tìm không tồn tại</p>
                  <a href="/" className="btn-detail" style={{ display: 'inline-block', marginTop: '20px' }}>
                    Về trang chủ
                  </a>
                </div>
              </MainLayout>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;