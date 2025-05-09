import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import TaiKhoanChangePwModal from "../TaiKhoanComponent/TaiKhoanChangePwModal";
import { changePassword } from "../../services/apiService";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("");
  const [activePath, setActivePath] = useState("");
  const [showChangePwModal, setShowChangePwModal] = useState(false);
  const [changePwData, setChangePwData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleShowChangePwModal = async () => {
    const result = await Swal.fire({
      title: "Xác nhận đổi mật khẩu",
      text: "Bạn có chắc chắn muốn đổi mật khẩu?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đổi mật khẩu",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      setShowChangePwModal(true);
      // Reset form khi mở modal
      setChangePwData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationErrors({});
    }
  };

  // Validate change password form
  const validateChangePassword = () => {
    const errors = {};

    if (!changePwData.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (!changePwData.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (changePwData.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!changePwData.confirmNewPassword) {
      errors.confirmNewPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (changePwData.newPassword !== changePwData.confirmNewPassword) {
      errors.confirmNewPassword = "Mật khẩu không khớp";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Change password
  const handleChangePassword = async () => {
    if (!validateChangePassword()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin mật khẩu", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await changePassword(token, username, changePwData);
      if (data.resultCode === 0) {
        setShowChangePwModal(false);
        Swal.fire("Thành công!", "Đổi mật khẩu thành công", "success");
      } else {
        throw new Error(data.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Đổi mật khẩu thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cập nhật active path khi location thay đổi
    setActivePath(location.pathname);

    // Kiểm tra token, nếu không có thì chuyển hướng về trang login
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/dang-nhap");
    } else {
      // Lấy fullname và role từ localStorage
      setFullname(localStorage.getItem("fullname") || "Người dùng");
      setRole(localStorage.getItem("role") || "Chưa xác định");
    }
  }, [navigate, location]);

  const handleLogout = () => {
    Swal.fire({
      title: "Xác nhận đăng xuất",
      text: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // Xóa tất cả dữ liệu trong localStorage
        localStorage.clear();
        // Hiển thị thông báo đăng xuất thành công
        Swal.fire({
          title: "Đã đăng xuất",
          text: "Bạn đã đăng xuất thành công",
          icon: "success",
          timer: 1500, // Tự động đóng sau 1.5 giây
          showConfirmButton: false,
        }).then(() => {
          // Chuyển hướng về trang đăng nhập sau khi hiển thị thông báo
          navigate("/");
        });
      }
    });
  };

  // Hàm kiểm tra active menu
  const isActive = (path) => {
    return activePath === path ? "active" : "";
  };

  return (
    <nav id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar p-2">
        <a
          className="sidebar-brand d-block text-center"
          onClick={() => navigate("/")}
        >
          <img
            className="logo-sidebar"
            src="/assets/images/logo/logo.png"
            alt="Logo"
          />
        </a>

        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a className="sidebar-link sidebar-link-static">
              <i className="fa-solid fa-user"></i>
              <span className="align-middle read-only-text">{fullname}</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link sidebar-link-static">
              <i className="fa-solid fa-user-gear"></i>
              <span className="align-middle read-only-text">{role}</span>
            </a>
          </li>

          <hr />
          <li className={`sidebar-item ${isActive("/trang-chu")}`}>
            <a className="sidebar-link" onClick={() => navigate("/trang-chu")}>
              <i className="fa-solid fa-home"></i>
              <span className="align-middle">Trang chủ</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-dang-vien")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-dang-vien")}
            >
              <i className="fa-solid fa-user-tie"></i>
              <span className="align-middle">Quản lý Đảng viên</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-ho-so")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-ho-so")}
            >
              <i className="fa-solid fa-folder-open"></i>
              <span className="align-middle">Quản lý hồ sơ Đảng</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-dang-phi")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-dang-phi")}
            >
              <i className="fa-solid fa-money-bill"></i>
              <span className="align-middle">Quản lý Đảng phí</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-ky-dang-phi")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-ky-dang-phi")}
            >
              <i className="fa-solid fa-calendar-alt"></i>
              <span className="align-middle">Quản lý kỳ Đảng phí</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-chi-bo")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-chi-bo")}
            >
              <i className="fa-solid fa-users"></i>
              <span className="align-middle">Quản lý chi bộ</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-tin-tuc")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-tin-tuc")}
            >
              <i className="fa-regular fa-newspaper"></i>
              <span className="align-middle">Quản lý tin tức</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-phe-duyet")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-phe-duyet")}
            >
              <i className="fa-solid fa-check-circle"></i>
              <span className="align-middle">Quản lý phê duyệt</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-tai-khoan")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/quan-ly-tai-khoan")}
            >
              <i className="fa-solid fa-user"></i>
              <span className="align-middle">Quản lý tài khoản</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/bao-cao-thong-ke")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/bao-cao-thong-ke")}
            >
              <i className="fa-solid fa-chart-bar"></i>
              <span className="align-middle">Báo cáo, thống kê</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/sao-luu-khoi-phuc")}`}>
            <a
              className="sidebar-link"
              onClick={() => navigate("/sao-luu-khoi-phuc")}
            >
              <i className="fa-solid fa-database"></i>
              <span className="align-middle">Sao lưu, khôi phục</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link" onClick={handleShowChangePwModal}>
              <i className="fa-solid fa-key"></i>
              <span className="align-middle">Đổi mật khẩu</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span className="align-middle">Đăng xuất</span>
            </a>
          </li>
        </ul>
      </div>
      <TaiKhoanChangePwModal
        show={showChangePwModal}
        onHide={() => setShowChangePwModal(false)}
        changePwData={changePwData}
        setChangePwData={setChangePwData}
        validationErrors={validationErrors}
        handleChangePassword={handleChangePassword}
        loading={loading}
      />
    </nav>
  );
};

export default Sidebar;
