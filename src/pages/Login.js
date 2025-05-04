import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { login } from "../services/apiService";

const Login = ({ setUserRole }) => {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [loginInputError, setLoginInputError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let isValid = true;
    if (!loginInput.trim()) {
      setLoginInputError("Tên đăng nhập là bắt buộc!");
      isValid = false;
    } else {
      setLoginInputError(""); // Xóa lỗi nếu đã nhập
    }

    if (!password.trim()) {
      setPasswordError("Mật khẩu là bắt buộc!");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;
    // toast.success("Đăng nhập thành công!");

    try {
      const data = await login(loginInput, password);
      // console.log(data);
      // console.log(data.data.fullname);
      // console.log(data.data.token);
      // console.log(data.data.role);
      if(data.resultCode === -1){
        Swal.fire({
          title: "Lỗi!",
          text: 'Tên đăng nhập hoặc mật khẩu không đúng!',
          icon: "error",
          confirmButtonText: "OK",
        });
      }else{
        Swal.fire({
          title: "Thành công!",
          text: "Đăng nhập thành công!",
          icon: "success",
          confirmButtonText: "OK",
        });
        // Lưu token vào localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("fullname", data.data.fullname);
        localStorage.setItem("role", data.data.role);

        setUserRole(data.data.role); // Cập nhật role trong state
        
        // Chuyển hướng dựa trên role
        // if (data.data.role === 'ROLE_USER') {
        //   navigate("/"); // Chuyển về trang chủ nếu là USER
        // } else {
        //   navigate("/quan-ly-dang-vien"); // Chuyển đến trang quản lý nếu là ADMIN hoặc STAFF
        // }

        if (data.data.role === 'ROLE_ADMIN') {
          navigate("/quan-ly-dang-vien");
        } else if (data.data.role === 'ROLE_STAFF') {
          navigate("/quan-ly-dang-vien");
        } else {
          // ROLE_USER sẽ bị chuyển hướng lại trang login
          navigate("/dang-nhap");
        }



        navigate("/"); // Chuyển hướng về trang chủ
      }
    } catch (err) {
        Swal.fire({
          title: "Lỗi!",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        console.log(err.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="d-flex w-100 page-login flex-grow-1">
        <div className="container d-flex flex-column justify-content-center">
          <div className="row">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="card">
                  <div className="card-body">
                    <div className="m-sm-4">
                      <div className="text-center">
                        <img
                          src="/assets/images/logo/logo.png"
                          alt="Logo"
                          className="img-fluid rounded-circle"
                          width="132"
                          height="132"
                        />
                        <p className="login-title">QUẢN LÝ HỒ SƠ ĐẢNG VIÊN</p>
                        <p className="login-subtitle">
                          TRƯỜNG ĐẠI HỌC KỸ THUẬT - HẬU CẦN CAND
                        </p>
                      </div>
                      <form onSubmit={handleLogin}>
                        <div className="mb-3">
                          <label className="form-label">Tên đăng nhập</label>
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="username"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            placeholder="Tên đăng nhập"
                          />
                          {loginInputError && (
                          <div className="text-danger mt-1">{loginInputError}</div>
                        )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Mật khẩu</label>
                          <input
                            className="form-control form-control-lg"
                            type="password"
                            name="password"
                            value={password}
                          onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                          />
                          {passwordError && (
                          <div className="text-danger mt-1">{passwordError}</div>
                        )}
                        </div>

                        <div className="text-center mt-3">
                          <button
                            type="submit"
                            className="btn btn-lg btn-outline-primary"
                          >
                            Đăng nhập
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer viết trực tiếp */}
      <footer className="footer mt-auto py-3">
        <div className="container-fluid">
          <div className="row text-muted small">
            <div className="col-4 text-start">
              <i className="fa-solid fa-location-dot me-1"></i> Địa chỉ: Phường Hồ, Thị xã Thuận Thành, tỉnh Bắc Ninh
            </div>
            <div className="col-4 text-center">
              <i className="fa-solid fa-phone me-1"></i> Hotline: 0987654321
            </div>
            <div className="col-4 text-end">
              <i className="fa-solid fa-envelope me-1"></i> Email: admin@dhkthc.edu.vn
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
