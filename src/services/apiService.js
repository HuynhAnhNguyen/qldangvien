import axios from "axios";
import * as XLSX from 'xlsx';

// Định nghĩa URL API (có thể thay đổi dễ dàng)
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://3.104.77.30:8080/api/v1/project";

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
export const sendChatMessage = async (token, message) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/chat/gemini`,
    {message},
    {
      headers: {
        Authorization: `${token}`,  // Thêm 'Bearer' phía trước token
        'Content-Type': 'application/json'
      }
    }
  );
  // console.log("token: "+ token);
  // console.log(response.data);
  return response.data;
};

// Lấy danh sách tin tức
export const fetchNews = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/tintuc/findAll`, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Thêm tin tức mới
export const createNews = async (token, newsData) => {
  const response = await axios.post(`${REACT_APP_API_URL}/tintuc/create`, newsData, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Cập nhật tin tức
export const updateNews = async (token, newsId, newsData) => {
  const response = await axios.put(`${REACT_APP_API_URL}/tintuc/update`, {
    ...newsData,
    tintucId: newsId
  }, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Xóa tin tức
export const deleteNews = async (token, newsId) => {
  const response = await axios.delete(`${REACT_APP_API_URL}/tintuc/delete`, {
    params: { tintucId: newsId },
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Upload hình ảnh
export const uploadImage = async (token, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${REACT_APP_API_URL}/file/uploadImage`, formData, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Lấy danh sách chi bộ
export const fetchChiBo = async (token) => {
  const response = await axios.get(`${REACT_APP_API_URL}/chibo/findAll`, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Thêm chi bộ mới
export const createChiBo = async (token, formData) => {
  const response = await axios.post(`${REACT_APP_API_URL}/chibo/create`, formData, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Cập nhật chi bộ
export const updateChiBo = async (token, chiboId, formData) => {
  const response = await axios.put(`${REACT_APP_API_URL}/chibo/update?chiboId=${chiboId}`, {
    ...formData,
  }, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Fetch XepLoai by ChiBoId
export const fetchXepLoaiByChiBoId = async (token, chiboId) => {
  const response = await axios.get(`${REACT_APP_API_URL}/xeploai/findByChiBoId`, {
    params: { chiboId },
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.data;
};

// Create new XepLoai
export const createXepLoai = async (token, chiboId, nam, xeploai) => {
  const response = await axios.post(`${REACT_APP_API_URL}/xeploai/create?chiboId=${chiboId}&nam=${nam}&xeploai=${xeploai}`, 
    { },
    {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Update XepLoai
export const updateXepLoai = async (token, xeploaiId, xeploai) => {
  const response = await axios.put(`${REACT_APP_API_URL}/xeploai/update?xeploaiId=${xeploaiId}&xeploai=${xeploai}`, 
    {},
    {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Lấy danh sách chi bộ đang hoạt động
export const fetchChiBoDangHoatDong = async (token) => {
  const response = await fetch(`${REACT_APP_API_URL}/chibo/chiBoDangHoatDong`, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response;
};

// Lấy danh sách Đảng viên
export const fetchDangVien = async (token, searchType, selectedChiBoId) => {
  let url = `${REACT_APP_API_URL}/dangvien/findAll`;
  if (searchType === "approved") {
    url = `${REACT_APP_API_URL}/dangvien/findApproved`;
  } else if (searchType === "chibo" && selectedChiBoId) {
    url = `${REACT_APP_API_URL}/dangvien/findByChiBoId?chiboId=${selectedChiBoId}`;
  }

  const response = await fetch(url, { headers: {
    Authorization: `${token}`,
    'Content-Type': 'application/json'
  } });
  
  return await response;
};

// Thêm Đảng viên mới
export const createDangVien  = async (token, chiboId, formData) => {
  const response = await axios.post(`${REACT_APP_API_URL}/dangvien/create?chiboId=${chiboId}`, {
    ...formData
  }, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.data;
};

// Cập nhật Đảng viên
export const updateDangVien = async (token, dangvienId, formData) => {
  const response = await axios.put(`${REACT_APP_API_URL}/dangvien/update?dangvienId=${dangvienId}`, {
    ...formData
  }, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.data;
};

// New functions for TheDang
export const createTheDang = async (token, dangvienId, theDangData) => {
  const response = await axios.post(
    `${REACT_APP_API_URL}/thedang/create?dangvienId=${dangvienId}`,
    theDangData,
    { headers: {
      Authorization: `${token}`,
    'Content-Type': 'application/json'
   } }
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
    { headers: {
      Authorization: `${token}`,
    'Content-Type': 'application/json'
   } }
  );
  return await response.data;
};

export const deleteTheDang = async (token, thedangId) => {
  const response = await axios.delete(
    `${REACT_APP_API_URL}/thedang/delete?thedangId=${thedangId}`,
    { headers: {
      Authorization: `${token}`,
    'Content-Type': 'application/json'
   } }
  );
  return await response.data;
};

export const fetchTheDang = async (token, dangvienId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/thedang/findDetailByDangvienId?dangvienId=${dangvienId}`,
    { headers: {
      Authorization: `${token}`,
    'Content-Type': 'application/json'
   }  }
  );
  console.log(response.data);
  return await response.data;
};


export const fetchQuyetDinhByDangVien = async (token, dangvienId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/quyetdinh/findByDangvienId?dangvienId=${dangvienId}`,
    { 
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      } 
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
        'Content-Type': 'application/json'
      } 
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
        'Content-Type': 'application/json'
      } 
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
        'Content-Type': 'application/json'
      } 
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
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return await response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
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
        responseType: 'blob' // This is crucial for file downloads
      }
    );
    return response;
  } catch (error) {
    console.error('API Error downloading file:', error);
    throw error;
  }
};

export const exportDangVienToExcel = (dangVienData) => {
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
    ["Trạng thái",  dangVienData.trangthaidangvien === "chinhthuc" ? "Chính thức" : dangVienData.trangthaidangvien === "dubi" ? "Dự bị" : 
      dangVienData.trangthaidangvien === "khaitru" ? "Khai trừ" : "Khác"],
    ["Chức vụ chính quyền", dangVienData.chucvuchinhquyen || "Không có"],
    ["Chức vụ chi bộ", dangVienData.chucvuchibo || "Không có"],
    ["Chức vụ Đảng ủy", dangVienData.chucvudanguy || "Không có"],
    ["Chức vụ đoàn thể", dangVienData.chucvudoanthe || "Không có"],
    ["Chức danh", dangVienData.chucdanh || "Không có"]
  ];

  // Tạo worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);
  
  // Điều chỉnh độ rộng cột
  worksheet['!cols'] = [
    { width: 25 }, // Cột tiêu đề
    { width: 40 }  // Cột giá trị
  ];

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Thông tin Đảng viên");

  // Xuất file
  const fileName = `DangVien_${dangVienData.hoten.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};


// Fetch hồ sơ theo Đảng viên ID
export const fetchHoSoByDangVienId = async (token, dangvienId) => {
  return fetch(`http://3.104.77.30:8080/api/v1/project/hoso/findByDangvienId?dangvienId=${dangvienId}`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Fetch hồ sơ đã duyệt theo Đảng viên ID
export const fetchHoSoApprovedByDangVienId = async (token, dangvienId) => {
  return fetch(`http://3.104.77.30:8080/api/v1/project/hoso/findApprovedByDangvienId?dangvienId=${dangvienId}`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Tạo hồ sơ mới
export const createHoSo = async (token, dangvienId, hoSoData) => {
  const response = await fetch(`http://3.104.77.30:8080/api/v1/project/hoso/create?dangvienId=${dangvienId}`, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hoSoData),
  });
  return response.json();
};

// Cập nhật hồ sơ
export const updateHoSo = async (token, hoSoId, hoSoData) => {
  const response = await fetch(`http://3.104.77.30:8080/api/v1/project/hoso/update?hosoId=${hoSoId}`, {
    method: "PUT",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hoSoData),
  });
  return response.json();
};

// Xóa hồ sơ
export const deleteHoSo = async (token, hoSoId) => {
  return fetch(`http://3.104.77.30:8080/api/v1/project/hoso/delete?hosoid=${hoSoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};