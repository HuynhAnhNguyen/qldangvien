import axios from "axios";
import * as XLSX from "xlsx";

// Định nghĩa URL API (có thể thay đổi dễ dàng)
const REACT_APP_API_URL =
  process.env.REACT_APP_API_URL || "http://3.25.84.77:8080/api/v1/project";

// Cập nhật hàm login cho phù hợp với API yêu cầu
export const login = async (userName, passWord) => {
  try {
    const response = await axios.post(`${REACT_APP_API_URL}/auth/signin`, {
      userName,
      passWord,
    });
    // console.log(response);
    return response.data; // trả về dữ liệu từ API
  } catch (err) {
    throw new Error(err.response?.data?.message || "Đăng nhập thất bại!");
  }
};

// Hàm gọi API ChatBot
export const sendChatMessage = async (message) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/auth/chat/gemini`,
    { message },
  );
  // console.log("token: "+ token);
  // console.log(response.data);
  return response.data;
};

// Lấy danh sách tin tức
export const fetchDanhSachTinTuc = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/tintuc/findAll`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Lấy danh sách tin tức
export const fetchTinTuc = async (token, searchType) => {
  let url = `${REACT_APP_API_URL}/tintuc/findAll`;
  if (searchType === "approved") {
    url = `${REACT_APP_API_URL}/auth/tintuc/findApproved`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });

  return await response;
};

// Thêm tin tức mới
export const createTinTuc = async (token, newsData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/tintuc/create`,
    newsData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Cập nhật tin tức
export const updateTinTuc = async (token, newsId, newsData) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/tintuc/update?tintucId=${newsId}`,
    newsData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Xóa tin tức
export const deleteTinTuc = async (token, newsId) => {
  const response = await axios.delete(`${REACT_APP_API_URL}/tintuc/delete?tintucId=${newsId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Upload hình ảnh
export const uploadImage = async (token, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${REACT_APP_API_URL}/file/uploadImage`,
    formData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
  return response.data;
};

// Lấy danh sách chi bộ
export const fetchChiBo = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/chibo/findAll`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Thêm chi bộ mới
export const createChiBo = async (token, formData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/chibo/create`,
    formData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Cập nhật chi bộ
export const updateChiBo = async (token, chiboId, formData) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/chibo/update?chiboId=${chiboId}`,
    {
      ...formData,
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Fetch XepLoai by ChiBoId
export const fetchXepLoaiByChiBoId = async (token, chiboId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/xeploai/findByChiBoId`,
    {
      params: { chiboId },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.data;
};

// Create new XepLoai
export const createXepLoai = async (token, chiboId, nam, xeploai) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/xeploai/create?chiboId=${chiboId}&nam=${nam}&xeploai=${xeploai}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Update XepLoai
export const updateXepLoai = async (token, xeploaiId, xeploai) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/xeploai/update?xeploaiId=${xeploaiId}&xeploai=${xeploai}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Lấy danh sách chi bộ đang hoạt động
export const fetchChiBoDangHoatDong = async (token) => {
  const response = await fetch(`${REACT_APP_API_URL}/chibo/chiBoDangHoatDong`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return await response;
};

// Lấy danh sách Đảng viên
// export const fetchDangVien = async (token, searchType, selectedChiBoId) => {
//   let url = `${REACT_APP_API_URL}/dangvien/findAll`;
//   if (searchType === "approved") {
//     url = `${REACT_APP_API_URL}/dangvien/findApproved`;
//   } else if (searchType === "chibo" && selectedChiBoId) {
//     url = `${REACT_APP_API_URL}/dangvien/findByChiBoId?chiboId=${selectedChiBoId}`;
//   }

//   const response = await fetch(url, { headers: {
//     Authorization: `${token}`,
//     'Content-Type': 'application/json'
//   } });

//   return await response;
// };
export const fetchDangVien = async (token, searchType, selectedChiBoId) => {
  let url = `${REACT_APP_API_URL}/dangvien/findAll`;
  if (searchType === "approved") {
    url = `${REACT_APP_API_URL}/dangvien/findApproved`;
  } else if (searchType === "chibo" && selectedChiBoId) {
    url = `${REACT_APP_API_URL}/dangvien/findByChiBoId?chiboId=${selectedChiBoId}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    // Nếu lỗi 401 (Unauthorized) thì xóa token và chuyển hướng
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/dang-nhap";
    }

    throw new Error(errorData.message || "Lỗi khi tải danh sách Đảng viên");
  }

  return await response;
};

// Thêm Đảng viên mới
export const createDangVien = async (token, chiboId, formData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/dangvien/create?chiboId=${chiboId}`,
    {
      ...formData,
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.data;
};

// Cập nhật Đảng viên
export const updateDangVien = async (token, dangvienId, formData) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/dangvien/update?dangvienId=${dangvienId}`,
    {
      ...formData,
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.data;
};

// New functions for TheDang
export const createTheDang = async (token, dangvienId, theDangData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/thedang/create?dangvienId=${dangvienId}`,
    theDangData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.data;
};

export const updateTheDang = async (token, thedangId, theDangData) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/thedang/update?thedangId=${thedangId}`,
    {
      mathe: theDangData.mathe,
      ngaycap: theDangData.ngaycap,
      noicapthe: theDangData.noicapthe,
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.data;
};

export const deleteTheDang = async (token, thedangId) => {
  const response = await axios.delete(
    `${REACT_APP_API_URL}/thedang/delete?thedangId=${thedangId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.data;
};

export const fetchTheDang = async (token, dangvienId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/thedang/findDetailByDangvienId?dangvienId=${dangvienId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log(response.data);
  return await response.data;
};

export const fetchQuyetDinhByDangVien = async (token, dangvienId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/quyetdinh/findByDangvienId?dangvienId=${dangvienId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log(response.data);
  return await response.data;
};

export const createQuyetDinh = async (token, dangvienId, quyetDinhData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/quyetdinh/create?dangvienId=${dangvienId}`,
    quyetDinhData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log(response.data);
  return await response.data;
};

export const updateQuyetDinh = async (token, quyetDinhId, quyetDinhData) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/quyetdinh/update?quyedinhId=${quyetDinhId}`,
    quyetDinhData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log(response.data);
  return await response.data;
};

export const deleteQuyetDinh = async (token, quyetDinhId) => {
  const response = await axios.delete(
    `${REACT_APP_API_URL}/quyetdinh/delete?quyetdinhId=${quyetDinhId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log(response.data);
  return await response.data;
};

export const uploadFile = async (token, file) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/file/uploadFile`,
      file,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return await response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const downloadFile = async (token, filename) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/file/getFile/${filename}`,
      {
        headers: {
          Authorization: `${token}`,
        },
        responseType: "blob", // This is crucial for file downloads
      }
    );
    return response;
  } catch (error) {
    console.error("API Error downloading file:", error);
    throw error;
  }
};

export const exportDangVienToExcel = (dangVienData, theDangData) => {
  // Tạo workbook mới
  const workbook = XLSX.utils.book_new();

  // Chuẩn bị dữ liệu
  const excelData = [
    ["Họ và tên", dangVienData.hoten || "Không có"],
    ["Ngày sinh", dangVienData.ngaysinh || "Không có"],
    ["Giới tính", dangVienData.gioitinh === "nu" ? "Nữ" : "Nam"],
    ["Quê quán", dangVienData.quequan || "Không có"],
    ["Dân tộc", dangVienData.dantoc || "Không có"],
    ["Trình độ văn hóa", dangVienData.trinhdovanhoa || "Không có"],
    ["Nơi ở hiện nay", dangVienData.noihiennay || "Không có"],
    ["Chuyên môn", dangVienData.chuyennmon || "Không có"],
    ["Trình độ ngoại ngữ", dangVienData.trinhdongoaingu || "Không có"],
    ["Trình độ chính trị", dangVienData.trinhdochinhtri || "Không có"],
    ["Chi bộ", dangVienData.chibo?.tenchibo || "Không xác định"],
    ["Ngày vào Đảng", dangVienData.ngayvaodang || "Không có"],
    ["Ngày chính thức", dangVienData.ngaychinhthuc || "Không có"],
    ["Người giới thiệu 1", dangVienData.nguoigioithieu1 || "Không có"],
    ["Người giới thiệu 2", dangVienData.nguoigioithieu2 || "Không có"],
    ["Nơi sinh hoạt Đảng", dangVienData.noisinhhoatdang || "Không có"],
    [
      "Trạng thái",
      dangVienData.trangthaidangvien === "chinhthuc"
        ? "Chính thức"
        : dangVienData.trangthaidangvien === "dubi"
        ? "Dự bị"
        : dangVienData.trangthaidangvien === "khaitru"
        ? "Khai trừ"
        : "Khác",
    ],
    ["Chức vụ chính quyền", dangVienData.chucvuchinhquyen || "Không có"],
    ["Chức vụ chi bộ", dangVienData.chucvuchibo || "Không có"],
    ["Chức vụ Đảng ủy", dangVienData.chucvudanguy || "Không có"],
    ["Chức vụ đoàn thể", dangVienData.chucvudoanthe || "Không có"],
    ["Chức danh", dangVienData.chucdanh || "Không có"],
    ["Số thẻ Đảng", theDangData.mathe || "Không có"],
    ["Ngày cấp thẻ", theDangData.ngaycap || "Không có"],
    ["Nơi cấp thẻ", theDangData.noicapthe || "Không có"],
  ];

  // Tạo worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Điều chỉnh độ rộng cột
  worksheet["!cols"] = [
    { width: 25 }, // Cột tiêu đề
    { width: 40 }, // Cột giá trị
  ];

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Thông tin Đảng viên");

  // Xuất file
  const fileName = `DangVien_${dangVienData.hoten.replace(/\s+/g, "_")}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Fetch hồ sơ theo Đảng viên ID
export const fetchHoSoByDangVienId = async (token, dangvienId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/hoso/findByDangvienId?dangvienId=${dangvienId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Fetch hồ sơ đã duyệt theo Đảng viên ID
export const fetchHoSoApprovedByDangVienId = async (token, dangvienId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/hoso/findApprovedByDangvienId?dangvienId=${dangvienId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Tạo hồ sơ mới
export const createHoSo = async (token, dangvienId, hoSoData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/hoso/create?dangvienId=${dangvienId}`,
    hoSoData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Cập nhật hồ sơ
export const updateHoSo = async (token, hoSoId, hoSoData) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/hoso/update?hosoId=${hoSoId}`,
    hoSoData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Xóa hồ sơ
export const deleteHoSo = async (token, hoSoId) => {
  const response = await axios.delete(
    `${REACT_APP_API_URL}/hoso/delete?hosoid=${hoSoId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Fetch kỳ đảng phí
export const fetchKyDangPhi = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/kydangphi/findAll`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Tạo kỳ đảng phí mới
export const createKyDangPhi = async (token, ten, sotien) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/kydangphi/create`,
    {},
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      params: {
        sotien,
        tenKydangphi: ten,
      },
    }
  );
  return response.data;
};

// Cập nhật Kỳ Đảng Phí
export const updateKyDangPhi = async (token, id, ten, sotien) => {
  const response = await axios.put(
    `${REACT_APP_API_URL}/kydangphi/update`,
    {},
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      params: {
        kydangphiId: id,
        tenKydangphi: ten,
        sotien,
      },
    }
  );
  return response.data;
};

// Lấy danh sách phê duyệt theo username
export const fetchPheDuyetByUsername = async (token, username) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/pheduyet/findByUsername`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      params: {
        username,
      },
    }
  );
  return response.data;
};

// Gửi yêu cầu phê duyệt
export const createPheDuyet = async (token, pheDuyetData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/pheduyet/create`,
    pheDuyetData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Phê duyệt yêu cầu
export const approvePheDuyet = async (token, pheduyetId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/pheduyet/approval?pheduyetId=${pheduyetId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Từ chối yêu cầu
export const rejectPheDuyet = async (token, pheduyetId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/pheduyet/reject?pheduyetId=${pheduyetId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Lấy trạng thái Đảng phí theo kỳ
export const fetchTrangThaiDangPhiByKy = async (token, kydangphiId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/trangthaidangphi/findByKydangphiId`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      params: {
        kydangphiId,
      },
    }
  );
  return response.data;
};

// Lấy trạng thái Đảng phí theo Đảng viên
export const fetchTrangThaiDangPhiByDangVien = async (token, dangvienId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/trangthaidangphi/findByDangvienId`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      params: {
        dangvienId,
      },
    }
  );
  return response.data;
};

// Xác nhận đóng Đảng phí
export const confirmDangPhi = async (token, kydangphiId, dangvienId) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/trangthaidangphi/confirm`,
    {},
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      params: {
        kydangphiId,
        dangvienId,
      },
    }
  );
  return response.data;
};

// Fetch all accounts
export const fetchAllAccounts = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/account/findAll`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Fetch all roles
export const fetchAllRoles = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/account/findAllRole`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Activate account
export const activateAccount = async (token, username) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/account/activeAccount?username=${username}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Deactivate account
export const deactivateAccount = async (token, username) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/account/deactiveAccount?username=${username}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Create new account
export const createAccount = async (token, formData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/account/create?roleName=${formData.roleName}`,
    {
      userName: formData.userName,
      passWord: formData.passWord,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      fullname: formData.fullname,
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Change password
export const changePassword = async (token, username, passwordData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/account/changePw`,
    {
      username: username,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Change role
export const changeRole = async (token, username, roleName) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/account/changeRole?username=${username}&role=${roleName}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Delete account
export const deleteAccount = async (token, username) => {
  const response = await axios.delete(
    `${REACT_APP_API_URL}/account/delete?username=${username}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const backupDatabase = async (token) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/database/backup`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
      responseType: "blob",
    }
  );
  return response;
};

export const restoreDatabase = async (token, file) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/database/restore`,
    file,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  // console.log(response);
  return response.data;
};

export const searchFilteredDangVien = async (token, searchTerm) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/dangvien/findByKeyword?keyword=${encodeURIComponent(
      searchTerm
    )}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  // console.log(response);
  return response.data;
};

// Change role
export const getPheDuyetDetail = async (token, pheduyetId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/pheduyet/getDataByPheduyetId?pheduyetId=${pheduyetId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Fetch Hồ sơ đảng theo hosoId
export const fetchHoSoById = async (token, hosoId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/hoso/findByListHosodangId?listId=${hosoId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Fetch Tin tức theo id
export const fetchTinTucById = async (tintucId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/auth/tintuc/findById?tintucId=${tintucId}`,
  );
  return response.data;
};

// Fetch Tin tức theo id
export const fetchThongKe = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/thongke`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


// fetchApprovedNews
export const fetchApprovedNews = async () => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/auth/tintuc/findApproved`,
  );
  return response.data;
};

// GetImage
export const getImage = async (filename) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/auth/file/getImage/${filename}`,
    {
      responseType: "blob",
    }
  );
  return URL.createObjectURL(response.data);
};

export const getImageLink = (imageName) =>
  `${REACT_APP_API_URL}/auth/file/getImage/${imageName}`;


// Lấy danh sách Đảng ủy
export const fetchDanguy = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/chibo/findAllDanguy`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Lấy danh sách Đảng bộ
export const fetchDangbo = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/chibo/findAllDangbo`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Lấy danh sách Chi bộ
export const fetchAllChibo = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/chibo/findAllChibo`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// fetchChiBoByDangBoId
export const fetchChiBoByDangBoId = async (token, dangboCaptrenId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/chibo/findChiboByDangboCaptrenId?dangboCaptrenId=${dangboCaptrenId}`,{
      headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    }
  );
  return response.data;
};

// fetchDangBoByDangUyId
export const fetchDangBoByDangUyId = async (token, danguyCaptrenId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/chibo/findDangboByDangUyCaptrenId?danguyCaptrenId=${danguyCaptrenId}`,{
      headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    }
  );
  return response.data;
};

export const fetchDangVienByChiBo = async (token, selectedChiBoId) => {
  const response = await axios.get(`${REACT_APP_API_URL}/dangvien/findByChiBoId?chiboId=${selectedChiBoId}`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });

  return await response.data;
};