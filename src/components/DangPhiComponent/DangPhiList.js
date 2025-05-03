import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { confirmDangPhi, fetchDangVien, fetchKyDangPhi, fetchTrangThaiDangPhiByDangVien, fetchTrangThaiDangPhiByKy } from "../../services/apiService";
import DangPhiFilter from "./DangPhiFilter";
import DangPhiTable from "./DangPhiTable";

const DangPhiList = () => {
  // State management
  const [kyDangPhiList, setKyDangPhiList] = useState([]);
  const [dangVienList, setDangVienList] = useState([]);
  const [trangThaiList, setTrangThaiList] = useState([]);
  const [selectedKyDangPhi, setSelectedKyDangPhi] = useState(null);
  const [selectedDangVien, setSelectedDangVien] = useState(null);
  const [searchType, setSearchType] = useState("ky"); // ky or dangvien
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Load danh sách kỳ Đảng phí
  const loadKyDangPhi = async () => {
    try {
      const data = await fetchKyDangPhi(token);
      if (data.resultCode === 0) {
        setKyDangPhiList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Không thể tải danh sách kỳ Đảng phí");
      }
    } catch (err) {
      setError("Không thể tải danh sách kỳ Đảng phí");
      console.error("Error loading kyDangPhi:", err);
    }
  };

  // Load danh sách Đảng viên
  const loadDangVien = async () => {
    try {
      const response = await fetchDangVien(token);
      const data = await response.json();
      if (data.resultCode === 0) {
        setDangVienList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Không thể tải danh sách Đảng viên");
      }
    } catch (err) {
      setError("Không thể tải danh sách Đảng viên");
      console.error("Error loading dangVien:", err);
    }
  };

  // Load trạng thái Đảng phí
  const loadTrangThaiDangPhi = async () => {
    if (!selectedKyDangPhi && !selectedDangVien) return;

    setLoading(true);
    try {
      let data;
      if (searchType === "ky" && selectedKyDangPhi) {
        data = await fetchTrangThaiDangPhiByKy(token, selectedKyDangPhi.id);
      } else if (searchType === "dangvien" && selectedDangVien) {
        data = await fetchTrangThaiDangPhiByDangVien(token, selectedDangVien.id);
      }
      if (data.resultCode === 0) {
        setTrangThaiList(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        throw new Error(data.message || "Không thể tải trạng thái Đảng phí");
      }
    } catch (err) {
      setError("Không thể tải trạng thái Đảng phí");
      console.error("Error loading trangThaiDangPhi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Confirm Đảng phí payment
  const handleConfirmDangPhi = async (kydangphiId, dangvienId) => {
    const result = await Swal.fire({
      title: "Xác nhận đóng Đảng phí?",
      text: "Bạn có chắc chắn muốn xác nhận Đảng viên đã đóng Đảng phí cho kỳ này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const data = await confirmDangPhi(token, kydangphiId, dangvienId);
        if (data.resultCode === 0) {
          setTrangThaiList(
            trangThaiList.map((item) =>
              item.dangvienId === dangvienId && item.kydangphiId === kydangphiId
                ? {
                    ...item,
                    trangthai: data.data.trangthai,
                    nguoixacnhan: data.data.nguoixacnhan,
                    thoigianxacnhan: data.data.thoigianxacnhan,
                  }
                : item
            )
          );
          Swal.fire("Thành công!", "Xác nhận Đảng phí thành công", "success");
        } else {
          throw new Error(data.message || "Xác nhận Đảng phí thất bại");
        }
      } catch (err) {
        Swal.fire("Lỗi!", "Xác nhận Đảng phí thất bại", "error");
        console.error("Error confirming dangPhi:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle search type change
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSelectedKyDangPhi(null);
    setSelectedDangVien(null);
    setSearchTerm("");
    setCurrentPage(1);
    setTrangThaiList([]);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Load initial data
  useEffect(() => {
    loadKyDangPhi();
    loadDangVien();
  }, []);

  // Load trạng thái when selection changes
  useEffect(() => {
    loadTrangThaiDangPhi();
  }, [selectedKyDangPhi, selectedDangVien, searchType]);

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <DangPhiFilter
          searchType={searchType}
          setSearchType={handleSearchTypeChange}
          selectedKyDangPhi={selectedKyDangPhi}
          setSelectedKyDangPhi={setSelectedKyDangPhi}
          selectedDangVien={selectedDangVien}
          setSelectedDangVien={setSelectedDangVien}
          kyDangPhiList={kyDangPhiList}
          dangVienList={dangVienList}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          loading={loading}
        />

        <DangPhiTable
          trangThaiList={trangThaiList}
          kyDangPhiList={kyDangPhiList}
          searchTerm={searchTerm}
          searchType={searchType}
          selectedKyDangPhi={selectedKyDangPhi}
          selectedDangVien={selectedDangVien}
          loading={loading}
          error={error}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          handleConfirmDangPhi={handleConfirmDangPhi}
        />
      </div>
    </div>
  );
};

export default DangPhiList;