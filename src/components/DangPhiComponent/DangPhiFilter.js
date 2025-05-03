import React from "react";
import { Form, Button } from "react-bootstrap";

const DangPhiFilter = ({
  searchType,
  setSearchType,
  selectedKyDangPhi,
  setSelectedKyDangPhi,
  selectedDangVien,
  setSelectedDangVien,
  kyDangPhiList,
  dangVienList,
  searchTerm,
  onSearchChange,
  loading,
}) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
      <h1 className="h3 mb-3 mb-md-0">Quản lý Đảng phí</h1>
      <div className="d-flex gap-2 align-items-center">
        <Form.Select
          value={searchType}
          onChange={setSearchType}
          style={{ width: "200px" }}
        >
          <option value="ky">Theo kỳ Đảng phí</option>
          <option value="dangvien">Theo Đảng viên</option>
        </Form.Select>
        {searchType === "ky" ? (
          <Form.Select
            value={selectedKyDangPhi?.id || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const ky = kyDangPhiList.find((item) => item.id == selectedId);
              setSelectedKyDangPhi(ky || null);
              onSearchChange({ target: { value: "" } });
            }}
            style={{ width: "250px" }}
          >
            <option value="">Chọn kỳ Đảng phí</option>
            {kyDangPhiList.map((ky) => (
              <option key={ky.id} value={ky.id}>
                {ky.ten}
              </option>
            ))}
          </Form.Select>
        ) : (
          <Form.Select
            value={selectedDangVien?.id || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const dv = dangVienList.find((item) => item.id == selectedId);
              setSelectedDangVien(dv || null);
              onSearchChange({ target: { value: "" } });
            }}
            style={{ width: "250px" }}
          >
            <option value="">Chọn Đảng viên</option>
            {dangVienList.map((dangVien) => (
              <option key={dangVien.id} value={dangVien.id}>
                {dangVien.hoten}
              </option>
            ))}
          </Form.Select>
        )}
        <div className="d-flex" style={{ width: "100%", maxWidth: "400px" }}>
          <input
            type="text"
            className="form-control"
            placeholder={
              searchType === "ky"
                ? "Tìm kiếm theo họ tên Đảng viên..."
                : "Tìm kiếm theo kỳ Đảng phí..."
            }
            value={searchTerm}
            onChange={onSearchChange}
            disabled={!(selectedKyDangPhi || selectedDangVien) || loading}
          />
          <button
            className="btn btn-primary"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            disabled={!(selectedKyDangPhi || selectedDangVien) || loading}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangPhiFilter;