import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useParams,
  useNavigate, 
  useLocation,
} from "react-router-dom";
import Swal from 'sweetalert2';
import { fetchTinTucById } from "./services/apiService";
import Home from "./pages/Home";
import Login from "./pages/Login";
import QuanLyCoSoDang from "./pages/QuanLyCoSoDang";
import QuanLyDangVien from "./pages/QuanLyDangVien";
import QuanLyHoSo from "./pages/QuanLyHoSo";
import QuanLyKyDangPhi from "./pages/QuanLyKyDangPhi";
import QuanLyDangPhi from "./pages/QuanLyDangPhi";
import SaoLuuKhoiPhuc from "./pages/SaoLuuKhoiPhuc";
import QuanLyPheDuyet from "./pages/QuanLyPheDuyet";
import QuanLyTaiKhoan from "./pages/QuanLyTaiKhoan";
import BaoCaoThongKe from "./pages/BaoCaoThongKe";
import QuanLyTinTuc from "./pages/QuanLyTinTuc";
import ChiTietTin from "./pages/ChiTietTin";
import AdminHome from "./pages/AdminHome";
import ChiTietTinHome from "./pages/ChiTietTinHome";
import NotFound from "./pages/NotFound";

// Component kiểm tra đăng nhập và phân quyền
const ProtectedRoute = ({ roles }) => {
  const userRole = localStorage.getItem("role");
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (roles && !roles.includes(userRole)) {
      Swal.fire({
        title: "Thông báo",
        text: "Bạn không có quyền truy cập trang này",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/trang-chu", { replace: true });
      });
    }
  }, [isAuthenticated, userRole, roles, navigate, location]);

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(userRole)) {
    return null; // Trả về null trong lúc chờ chuyển hướng
  }

  return <Outlet />;
};

// Component kiểm tra trạng thái tin tức
const NewsRoute = () => {
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tintucId } = useParams();
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetchTinTucById(tintucId);
        // Kiểm tra nếu response không có data hoặc data không hợp lệ
        if (!response.data || !response.data.id) {
          throw new Error('Tin tức không tồn tại');
        }
        setNewsData(response.data);
      } catch (err) {
        Swal.fire({
          title: "Lỗi",
          text: "Tin tức không tồn tại hoặc đã bị xóa",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(isAuthenticated ? "/quan-ly-tin-tuc" : "/", { replace: true });
        });
        // setError('Không tìm thấy tin tức');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [tintucId, isAuthenticated, navigate]);

  if (loading) {
    return <div className="text-center py-5">Đang tải...</div>;
  }

  // if (error || !newsData) {
  //   return <Navigate to="/not-found" replace />;
  // }
  if (!newsData) {
    return null; // Đã xử lý chuyển hướng trong useEffect
  }

  // Tin đã phê duyệt - hiển thị cho tất cả
  if (newsData.trangthai === 'approved') {
    return isAuthenticated ? <ChiTietTin /> : <ChiTietTinHome />;
  }
  
  // Tin chưa phê duyệt - chỉ hiển thị khi đã đăng nhập
  if (isAuthenticated) {
    return <ChiTietTin />;
  }

  // Chưa đăng nhập và tin chưa phê duyệt - chuyển hướng đăng nhập
  return <Navigate to="/dang-nhap" state={{ from: `/chi-tiet-tin-tuc/${tintucId}` }} />;
};

// Component xử lý các route không tồn tại khi đã đăng nhập
const AuthenticatedNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "Lỗi",
      text: "Trang bạn truy cập không tồn tại",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/trang-chu", { replace: true });
    });
  }, [navigate]);

  return null;
};


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/chi-tiet-tin-tuc/:tintucId" element={<NewsRoute />} />
        <Route path="/not-found" element={<NotFound />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute roles={["ROLE_ADMIN", "ROLE_USER"]} />}>
          <Route path="/trang-chu" element={<AdminHome />} />
          <Route path="/quan-ly-tin-tuc" element={<QuanLyTinTuc />} />
          <Route path="/quan-ly-dang-vien" element={<QuanLyDangVien />} />
          <Route path="/quan-ly-co-so-dang" element={<QuanLyCoSoDang />} />
          <Route path="/quan-ly-ho-so" element={<QuanLyHoSo />} />
          <Route path="/quan-ly-ky-dang-phi" element={<QuanLyKyDangPhi />} />
          <Route path="/quan-ly-dang-phi" element={<QuanLyDangPhi />} />
          <Route path="/quan-ly-phe-duyet" element={<QuanLyPheDuyet />} />
          <Route path="/bao-cao-thong-ke" element={<BaoCaoThongKe />} />
        </Route>

        {/* Admin only routes */}
        <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
          <Route path="/sao-luu-khoi-phuc" element={<SaoLuuKhoiPhuc />} />
          <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
        </Route>

        {/* 404 page */}
        {/* Xử lý route không tồn tại khi đã đăng nhập */}
        <Route 
          path="*" 
          element={
            localStorage.getItem("token") ? <AuthenticatedNotFound /> : <NotFound /> 
          } 
        />
        {/* <Route path="*" element={<NotFound />} /> */}

        {/* <Route path="/" element={<Home />} />
        <Route path="/dang-nhap" element={<Login />} />
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
        <Route path="/chi-tiet-tin-tuc/:tintucId" element={<ChiTietTin />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
