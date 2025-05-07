import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Swal from "sweetalert2";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPage from "./pages/NewPage";
import QuanLyChiBo from "./pages/QuanLyChiBo";
import QuanLyDangVien from "./pages/QuanLyDangVien";
import QuanLyHoSo from "./pages/QuanLyHoSo";
import QuanLyKyDangPhi from "./pages/QuanLyKyDangPhi";
import QuanLyDangPhi from "./pages/QuanLyDangPhi";
import SaoLuuKhoiPhuc from "./pages/SaoLuuKhoiPhuc";
import QuanLyPheDuyet from "./pages/QuanLyPheDuyet";
import QuanLyTaiKhoan from "./pages/QuanLyTaiKhoan";
import BaoCaoThongKe from "./pages/BaoCaoThongKe";
import QuanLyTinTuc from "./components/QuanLyTinTuc";
import ChiTietTinTuc from "./components/ChiTietTinTuc";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dang-nhap" element={<Login />} />
        {/* <Route
          path="/dang-nhap"
          element={<Login setUserRole={setUserRole} />}
        /> */}
        {/* <Route
          path="/"
          element={
            <ProtectedRoute
              role={userRole}
              allowedRoles={["ROLE_ADMIN", "ROLE_STAFF", "ROLE_USER"]}
            >
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quan-ly-dang-vien"
          element={
            <ProtectedRoute
              role={userRole}
              allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <QuanLyDangVien />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/"
          element={
            <ProtectedRoute
              role={userRole}
            >
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quan-ly-dang-vien"
          element={
            <ProtectedRoute
              role={userRole}
            >
              <QuanLyDangVien />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/quan-ly-tin-tuc" element={<QuanLyTinTuc />} />
        <Route path="/quan-ly-dang-vien" element={<QuanLyDangVien />} />
        <Route path="/quan-ly-chi-bo" element={<QuanLyChiBo />} />
        <Route path="/quan-ly-ho-so" element={<QuanLyHoSo />} />
        <Route path="/quan-ly-ky-dang-phi" element={<QuanLyKyDangPhi />} />
        <Route path="/quan-ly-dang-phi" element={<QuanLyDangPhi />} />
        <Route path="/sao-luu-khoi-phuc" element={<SaoLuuKhoiPhuc />} />
        <Route path="/quan-ly-phe-duyet" element={<QuanLyPheDuyet />} />
        <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
        <Route path="/bao-cao-thong-ke" element={<BaoCaoThongKe />} />
        {/* <Route path="/quan-ly-tin-tuc" element={<NewsManagement />} /> */}
        <Route path="/tintuc/:tintucId" element={<ChiTietTinTuc />} />
      </Routes>
    </Router>
  );
};

// Component ProtectedRoute để kiểm soát truy cập
// const ProtectedRoute = ({ children, role, allowedRoles }) => {
//   if (!role) {
//     return <Navigate to="/dang-nhap" replace />;
//   }
  
//   if (!allowedRoles.includes(role)) {
//     if (role === 'ROLE_USER') {
//       Swal.fire({
//         title: "Không có quyền truy cập",
//         text: "Tài khoản của bạn không có quyền truy cập trang này",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//     return <Navigate to="/" replace />;
//   }
  
//   return children;
// };
// const ProtectedRoute = ({ children, role }) => {
//   // Nếu chưa đăng nhập -> về trang đăng nhập
//   if (!role) {
//     return <Navigate to="/dang-nhap" replace />;
//   }
  
//   // Nếu là ROLE_USER -> chặn hoàn toàn, giữ ở trang login
//   if (role === 'ROLE_USER') {
//     Swal.fire({
//       title: "Tài khoản bị hạn chế",
//       text: "Tài khoản của bạn không có quyền truy cập hệ thống",
//       icon: "error",
//       confirmButtonText: "OK",
//     });
//     return <Navigate to="/dang-nhap" replace />;
//   }
  
//   // Các role khác (ADMIN, STAFF) được truy cập
//   return children;
// };

export default App;
