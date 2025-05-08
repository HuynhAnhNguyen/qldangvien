// // // NewsDetail.js
// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { Container, Spinner, Alert, Button } from 'react-bootstrap';
// // import { fetchTinTucById, getImageLink } from '../services/apiService';

// // const ChiTietTinTuc = () => {
// //   const { tintucId } = useParams();
// //   const [news, setNews] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchNewsDetail = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await fetchTinTucById(tintucId);
// //         setNews(response.data);
// //       } catch (err) {
// //         setError(err.response?.data?.message || 'Lỗi khi tải chi tiết tin tức');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchNewsDetail();
// //   }, [tintucId]);

// //   if (loading) {
// //     return (
// //       <Container className="text-center py-5">
// //         <Spinner animation="border" />
// //       </Container>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Container className="py-5">
// //         <Alert variant="danger">{error}</Alert>
// //       </Container>
// //     );
// //   }

// //   if (!news) {
// //     return (
// //       <Container className="py-5">
// //         <Alert variant="warning">Không tìm thấy tin tức</Alert>
// //       </Container>
// //     );
// //   }

// //   return (
// //     <Container className="py-4">
// //       <Button variant="outline-secondary" onClick={() => window.history.back()} className="mb-3">
// //         Quay lại
// //       </Button>

// //       <h1 className="mb-4">{news.tieude}</h1>

// //       {/* {news.url  && (
// //         <div className="text-center mb-4">
// //           <img
// //             src={getImageLink(news.url) }
// //             alt={news.tieude}
// //             className="img-fluid rounded"
// //             style={{ maxHeight: '400px' }}
// //           />
// //         </div>
// //       )} */}

// //       <div
// //         className="news-content"
// //         dangerouslySetInnerHTML={{ __html: news.noidungtin }}
// //       />

// //       <div className="mt-4 text-muted">
// //         <small>
// //           Ngày đăng: {new Date(news.thoigiantao).toLocaleDateString()} |
// //           Người đăng: {news.nguoitao || 'Không xác định'} |
// //           Trạng thái: {news.trangthai === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
// //         </small>
// //       </div>
// //     </Container>
// //   );
// // };

// // export default ChiTietTinTuc;

// // ChiTietTinTuc.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Spinner, Alert, Button } from 'react-bootstrap';
// import { fetchTinTucById } from '../services/apiService';

// const ChiTietTinTuc = () => {
//   const { tintucId } = useParams();
//   const [news, setNews] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNewsDetail = async () => {
//       try {
//         setLoading(true);
//         const response = await fetchTinTucById(tintucId);
//         setNews(response.data);
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
//       <main className="content">
//         <div className="container-fluid p-4 text-center">
//           <Spinner animation="border" />
//         </div>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="content">
//         <div className="container-fluid p-4">
//           <Alert variant="danger">{error}</Alert>
//         </div>
//       </main>
//     );
//   }

//   if (!news) {
//     return (
//         <div className="container-fluid p-4">
//           <Alert variant="warning">Không tìm thấy tin tức</Alert>
//         </div>
//     );
//   }

//   return (
//       <div className="container-fluid p-4">
//         <div className="mb-3">
//           <Button variant="secondary" onClick={() => window.history.back()}>
//             &larr; Quay lại
//           </Button>
//         </div>

//         <h1 className="mb-4">{news.tieude}</h1>

//         <div
//           className="news-content mb-5"
//           dangerouslySetInnerHTML={{ __html: news.noidungtin }}
//         />

//         <div className="d-flex justify-content-end text-muted mt-4">
//           <small>
//             Ngày đăng: {new Date(news.thoigiantao).toLocaleDateString('vi-VN')} |{' '}
//             Người đăng: {news.nguoitao || 'Không xác định'} |{' '}
//             Trạng thái: {news.trangthai === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
//           </small>
//         </div>
//       </div>
//   );
// };

// export default ChiTietTinTuc;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTinTucById } from "../services/apiService";

const ChiTietTinTuc = () => {
  const { tintucId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchTinTucById(tintucId);
        setNews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải chi tiết tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [tintucId]);

  if (loading) {
    return (
      <main className="content">
        <div className="container-fluid p-0">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="content">
        <div className="container-fluid p-0">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!news) {
    return (
      <>
        <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
          <div className="p-4 flex-grow-1">
            <div className="container-fluid p-0">
              <div className="mb-3">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-secondary"
                >
                  Quay lại
                </button>
              </div>

              <div className="row">
                <div className="col-md-12 col-xl-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="news-content text-danger text-center">Không tìm thấy tin tức</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
        <div className="p-4 flex-grow-1">
          <div className="container-fluid p-0">
            <div className="mb-3">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-secondary"
              >
                Quay lại
              </button>
            </div>

            <div className="row">
              <div className="col-md-12 col-xl-12">
                <div className="card">
                  <div className="card-header">
                    <h1 className="h3 d-inline align-middle">{news.tieude}</h1>
                  </div>

                  <div className="card-body">
                    <div
                      className="news-content"
                      dangerouslySetInnerHTML={{ __html: news.noidungtin }}
                    />

                    <div className="mt-4 text-end text-muted">
                      <small>
                        Ngày đăng:{" "}
                        {news.thoigiantao
                          ? new Date(news.thoigiantao).toLocaleString()
                          : "Chưa xác nhận"}{" "}
                        |
                        Người đăng: {news.nguoitao || "Không xác định"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChiTietTinTuc;
