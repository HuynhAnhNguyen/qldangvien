import axios from "axios";

// Định nghĩa URL API (có thể thay đổi dễ dàng)
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://3.104.77.30:8080/api/v1/project";

// Cập nhật hàm login cho phù hợp với API yêu cầu
export const login = async (userName, passWord) => {
  try {
    // console.log(REACT_APP_API_URL);
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





// Lấy danh sách Đảng viên
// export const fetchMembers = async (token) => {
//   const response = await axios.get(`${REACT_APP_API_URL}/dangvien/findAll`, {
//     headers: {
//       Authorization: `${token}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.data;
// };

// // Thêm Đảng viên mới
// export const createMember  = async (token, memData) => {
//   const response = await axios.post(`${REACT_APP_API_URL}/dangvien/create`, memData, {
//     headers: {
//       Authorization: `${token}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.data;
// };

// // Cập nhật Đảng viên
// export const updateMember = async (token, dangvienId, memData) => {
//   const response = await axios.put(`${REACT_APP_API_URL}/dangvien/update`, {
//     ...memData,
//     dangvienId: dangvienId
//   }, {
//     headers: {
//       Authorization: `${token}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.data;
// };
