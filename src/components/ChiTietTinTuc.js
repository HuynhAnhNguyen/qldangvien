// // NewsDetail.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Spinner, Alert, Button } from 'react-bootstrap';
// import axios from 'axios';

// const ChiTietTinTuc = () => {
//   const { tintucId } = useParams();
//   const [news, setNews] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNewsDetail = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         const response = await axios.get(
//           `http://3.104.77.30:8080/api/v1/project/tintuc/findById?tintucId=${tintucId}`,
//           { headers: { Authorization: token } }
//         );
//         setNews(response.data.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Lỗi khi tải chi tiết tin tức');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNewsDetail();
//   }, [tintucId]);

//   if (loading) {
//     return (
//       <Container className="text-center py-5">
//         <Spinner animation="border" />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   if (!news) {
//     return (
//       <Container className="py-5">
//         <Alert variant="warning">Không tìm thấy tin tức</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-4">
//       <Button variant="outline-secondary" onClick={() => window.history.back()} className="mb-3">
//         Quay lại
//       </Button>
      
//       <h1 className="mb-4">{news.tieude}</h1>
      
//       {news.imageUrl && (
//         <div className="text-center mb-4">
//           <img 
//             src={news.imageUrl} 
//             alt={news.tieude} 
//             className="img-fluid rounded"
//             style={{ maxHeight: '400px' }}
//           />
//         </div>
//       )}
      
//       <div 
//         className="news-content" 
//         dangerouslySetInnerHTML={{ __html: news.noidung }} 
//       />
      
//       <div className="mt-4 text-muted">
//         <small>
//           Ngày đăng: {new Date(news.thoigiantao).toLocaleDateString()} | 
//           Người đăng: {news.nguoitao || 'Không xác định'} | 
//           Trạng thái: {news.trangthai === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
//         </small>
//       </div>
//     </Container>
//   );
// };

// export default ChiTietTinTuc;