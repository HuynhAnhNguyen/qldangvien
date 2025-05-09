import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderHome = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg px-3" style={{ height: "80px" }}>
      {/* Phần bên trái - logo và tiêu đề */}
      <div className="d-flex align-items-center" style={{ gap: "15px" }}>
        {/* Logo */}
        <img
          src="/assets/images/logo/logo.png"
          alt="Logo"
          style={{ 
            height: "80px",
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        />
        
        {/* Tiêu đề */}
        <span className="header-title"  style={{ fontSize: "20px" }}>
          TRƯỜNG ĐẠI HỌC KỸ THUẬT - HẬU CẦN CÔNG AN NHÂN DÂN
        </span>
      </div>

      {/* Phần bên phải - logo cờ đảng */}
      <div className="ms-auto d-flex align-items-center">
        <img
          style={{ height: "50px" }}
          src="/assets/images/logo/codang.webp"
          alt="CoDang"
        />
      </div>
    </nav>
  );
};

export default HeaderHome;