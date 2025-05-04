import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  activateAccount,
  changePassword,
  changeRole,
  createAccount,
  deactivateAccount,
  deleteAccount,
  fetchAllAccounts,
  fetchAllRoles,
} from "../../services/apiService";
import TaiKhoanTable from "./TaiKhoanTable";
import TaiKhoanAddModal from "./TaiKhoanAddModal";
import TaiKhoanChangePwModal from "./TaiKhoanChangePwModal";
import TaiKhoanChangeRoleModal from "./TaiKhoanChangeRoleModal";

const TaiKhoanList = () => {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangePwModal, setShowChangePwModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    userName: "",
    passWord: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    fullname: "",
    roleName: "",
  });

  const [changePwData, setChangePwData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [changeRoleData, setChangeRoleData] = useState({
    roleName: "",
  });

  const token = localStorage.getItem("token");

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.userName.trim()) {
      errors.userName = "Tên đăng nhập là bắt buộc";
    }
    if (!formData.passWord.trim()) {
      errors.passWord = "Mật khẩu là bắt buộc";
    } else if (formData.passWord.length < 6) {
      errors.passWord = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.passWord !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }
    if (!formData.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!formData.fullname.trim()) {
      errors.fullname = "Họ và tên là bắt buộc";
    }
    if (!formData.roleName) {
      errors.roleName = "Vai trò là bắt buộc";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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

  // Fetch accounts
  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await fetchAllAccounts(token);
      if (data.resultCode === 0) {
        setAccounts(Array.isArray(data.data) ? data.data : []);
        setError(null);
        setCurrentPage(1);
      } else {
        throw new Error(data.message || "Không thể tải danh sách tài khoản");
      }
    } catch (err) {
      setError("Không thể tải danh sách tài khoản");
      console.error("Error loading accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const loadRoles = async () => {
    try {
      const data = await fetchAllRoles(token);
      if (data.resultCode === 0) {
        setRoles(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Không thể tải danh sách vai trò");
      }
    } catch (err) {
      console.error("Error loading roles:", err);
      Swal.fire("Lỗi!", "Không thể tải danh sách vai trò", "error");
    }
  };

  // Activate account
  const handleActivate = async (username) => {
    const result = await Swal.fire({
      title: "Xác nhận kích hoạt?",
      text: "Bạn có chắc chắn muốn kích hoạt tài khoản này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Kích hoạt",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const data = await activateAccount(token, username);
        if (data.resultCode === 0) {
          setAccounts(
            accounts.map((item) =>
              item.username === username ? data.data : item
            )
          );
          Swal.fire("Thành công!", "Kích hoạt tài khoản thành công", "success");
        } else {
          throw new Error(data.message || "Kích hoạt tài khoản thất bại");
        }
      } catch (err) {
        Swal.fire("Lỗi!", "Kích hoạt tài khoản thất bại", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Deactivate account
  const handleDeactivate = async (username) => {
    const result = await Swal.fire({
      title: "Xác nhận vô hiệu hóa?",
      text: "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vô hiệu hóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const data = await deactivateAccount(token, username);
        if (data.resultCode === 0) {
          setAccounts(
            accounts.map((item) =>
              item.username === username ? data.data : item
            )
          );
          Swal.fire(
            "Thành công!",
            "Vô hiệu hóa tài khoản thành công",
            "success"
          );
        } else {
          throw new Error(data.message || "Vô hiệu hóa tài khoản thất bại");
        }
      } catch (err) {
        Swal.fire("Lỗi!", "Vô hiệu hóa tài khoản thất bại", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Add account
  const handleAddAccount = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await createAccount(token, formData);
      if (data.resultCode === 0) {
        setAccounts([...accounts, data.data]);
        setShowAddModal(false);
        setValidationErrors({});
        Swal.fire("Thành công!", "Thêm tài khoản thành công", "success");
      } else {
        throw new Error(data.message || "Thêm tài khoản thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Thêm tài khoản thất bại", "error");
      console.error("Error adding account:", err);
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!validateChangePassword()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin mật khẩu", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await changePassword(
        token,
        selectedAccount.username,
        changePwData
      );
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

  // Change role
  const handleChangeRole = async () => {
    if (!changeRoleData.roleName) {
      Swal.fire("Lỗi!", "Vui lòng chọn vai trò", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await changeRole(
        token,
        selectedAccount.username,
        changeRoleData.roleName
      );
      if (data.resultCode === 0) {
        setAccounts(
          accounts.map((item) =>
            item.username === selectedAccount.username
              ? { ...item, roleName: changeRoleData.roleName }
              : item
          )
        );
        await loadAccounts();
        setShowChangeRoleModal(false);
        Swal.fire("Thành công!", "Thay đổi vai trò thành công", "success");
      } else {
        throw new Error(data.message || "Thay đổi vai trò thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Thay đổi vai trò thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (username) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc chắn muốn xóa tài khoản ${username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const data = await deleteAccount(token, username);
        if (data.resultCode === 0) {
          setAccounts(accounts.filter((item) => item.username !== username));
          Swal.fire("Thành công!", "Xóa tài khoản thành công", "success");
        } else {
          throw new Error(data.message || "Xóa tài khoản thất bại");
        }
      } catch (err) {
        Swal.fire("Lỗi!", "Xóa tài khoản thất bại", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAccounts();
    loadRoles();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "passWord" || name === "confirmPassword") {
      setValidationErrors((prev) => ({
        ...prev,
        passWord: "",
        confirmPassword: "",
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      userName: "",
      passWord: "",
      confirmPassword: "",
      email: "",
      phoneNumber: "",
      fullname: "",
      roleName: "",
    });
    setValidationErrors({});
    setShowAddModal(true);
  };

  // Open change password modal
  const openChangePwModal = (account) => {
    setSelectedAccount(account);
    setChangePwData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setValidationErrors({});
    setShowChangePwModal(true);
  };

  // Open change role modal
  const openChangeRoleModal = (account) => {
    setSelectedAccount(account);
    setChangeRoleData({ roleName: account.roleName || "" });
    setShowChangeRoleModal(true);
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <TaiKhoanTable
        accounts={accounts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleActivate={handleActivate}
        handleDeactivate={handleDeactivate}
        openChangePwModal={openChangePwModal}
        openChangeRoleModal={openChangeRoleModal}
        handleDeleteAccount={handleDeleteAccount}
        loading={loading}
        error={error}
        openAddModal={openAddModal}
      />
      <TaiKhoanAddModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        validationErrors={validationErrors}
        roles={roles}
        handleAddAccount={handleAddAccount}
        loading={loading}
      />
      <TaiKhoanChangePwModal
        show={showChangePwModal}
        onHide={() => setShowChangePwModal(false)}
        changePwData={changePwData}
        setChangePwData={setChangePwData}
        validationErrors={validationErrors}
        handleChangePassword={handleChangePassword}
        loading={loading}
      />
      <TaiKhoanChangeRoleModal
        show={showChangeRoleModal}
        onHide={() => setShowChangeRoleModal(false)}
        selectedAccount={selectedAccount}
        changeRoleData={changeRoleData}
        setChangeRoleData={setChangeRoleData}
        roles={roles}
        handleChangeRole={handleChangeRole}
        loading={loading}
      />
    </div>
  );
};

export default TaiKhoanList;
