// import React from "react";
// const Content = () => {
//   return (
//     <div className="container-fluid p-0">
//       <h1 className="h3 mb-3">
//         <strong>Analytics</strong> Dashboard
//       </h1>

//       <div className="row">
//         <div className="col-xl-6 col-xxl-5 d-flex">
//           <div className="w-100">
//             <div className="row">
//               <div className="col-sm-6">
//                 <div className="card">
//                   <div className="card-body">
//                     <div className="row">
//                       <div className="col mt-0">
//                         <h5 className="card-title">Sales</h5>
//                       </div>

//                       <div className="col-auto">
//                         <div className="stat text-primary">
//                           <i className="align-middle" data-feather="truck"></i>
//                         </div>
//                       </div>
//                     </div>
//                     <h1 className="mt-1 mb-3">2.382</h1>
//                     <div className="mb-0">
//                       <span className="text-danger">
//                         {" "}
//                         <i className="mdi mdi-arrow-bottom-right"></i> -3.65%{" "}
//                       </span>
//                       <span className="text-muted">Since last week</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <div className="row">
//                       <div className="col mt-0">
//                         <h5 className="card-title">Visitors</h5>
//                       </div>

//                       <div className="col-auto">
//                         <div className="stat text-primary">
//                           <i className="align-middle" data-feather="users"></i>
//                         </div>
//                       </div>
//                     </div>
//                     <h1 className="mt-1 mb-3">14.212</h1>
//                     <div className="mb-0">
//                       <span className="text-success">
//                         {" "}
//                         <i className="mdi mdi-arrow-bottom-right"></i> 5.25%{" "}
//                       </span>
//                       <span className="text-muted">Since last week</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-sm-6">
//                 <div className="card">
//                   <div className="card-body">
//                     <div className="row">
//                       <div className="col mt-0">
//                         <h5 className="card-title">Earnings</h5>
//                       </div>

//                       <div className="col-auto">
//                         <div className="stat text-primary">
//                           <i
//                             className="align-middle"
//                             data-feather="dollar-sign"
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <h1 className="mt-1 mb-3">$21.300</h1>
//                     <div className="mb-0">
//                       <span className="text-success">
//                         {" "}
//                         <i className="mdi mdi-arrow-bottom-right"></i> 6.65%{" "}
//                       </span>
//                       <span className="text-muted">Since last week</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <div className="row">
//                       <div className="col mt-0">
//                         <h5 className="card-title">Orders</h5>
//                       </div>

//                       <div className="col-auto">
//                         <div className="stat text-primary">
//                           <i
//                             className="align-middle"
//                             data-feather="shopping-cart"
//                           ></i>
//                         </div>
//                       </div>
//                     </div>
//                     <h1 className="mt-1 mb-3">64</h1>
//                     <div className="mb-0">
//                       <span className="text-danger">
//                         {" "}
//                         <i className="mdi mdi-arrow-bottom-right"></i> -2.25%{" "}
//                       </span>
//                       <span className="text-muted">Since last week</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-xl-6 col-xxl-7">
//           <div className="card flex-fill w-100">
//             <div className="card-header">
//               <h5 className="card-title mb-0">Recent Movement</h5>
//             </div>
//             <div className="card-body py-3">
//               <div className="chart chart-sm">
//                 <canvas id="chartjs-dashboard-line"></canvas>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-12 col-md-6 col-xxl-3 d-flex order-2 order-xxl-3">
//           <div className="card flex-fill w-100">
//             <div className="card-header">
//               <h5 className="card-title mb-0">Browser Usage</h5>
//             </div>
//             <div className="card-body d-flex">
//               <div className="align-self-center w-100">
//                 <div className="py-3">
//                   <div className="chart chart-xs">
//                     <canvas id="chartjs-dashboard-pie"></canvas>
//                   </div>
//                 </div>

//                 <table className="table mb-0">
//                   <tbody>
//                     <tr>
//                       <td>Chrome</td>
//                       <td className="text-end">4306</td>
//                     </tr>
//                     <tr>
//                       <td>Firefox</td>
//                       <td className="text-end">3801</td>
//                     </tr>
//                     <tr>
//                       <td>IE</td>
//                       <td className="text-end">1689</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-12 col-md-12 col-xxl-6 d-flex order-3 order-xxl-2">
//           <div className="card flex-fill w-100">
//             <div className="card-header">
//               <h5 className="card-title mb-0">Real-Time</h5>
//             </div>
//             <div className="card-body px-4">
//               {/* <div id="world_map" style="height:350px;"></div> */}
//             </div>
//           </div>
//         </div>
//         <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1">
//           <div className="card flex-fill">
//             <div className="card-header">
//               <h5 className="card-title mb-0">Calendar</h5>
//             </div>
//             <div className="card-body d-flex">
//               <div className="align-self-center w-100">
//                 <div className="chart">
//                   <div id="datetimepicker-dashboard"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-12 col-lg-8 col-xxl-9 d-flex">
//           <div className="card flex-fill">
//             <div className="card-header">
//               <h5 className="card-title mb-0">Latest Projects</h5>
//             </div>
//             <table className="table table-hover my-0">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th className="d-none d-xl-table-cell">Start Date</th>
//                   <th className="d-none d-xl-table-cell">End Date</th>
//                   <th>Status</th>
//                   <th className="d-none d-md-table-cell">Assignee</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>Project Apollo</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-success">Done</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">Vanessa Tucker</td>
//                 </tr>
//                 <tr>
//                   <td>Project Fireball</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-danger">Cancelled</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">William Harris</td>
//                 </tr>
//                 <tr>
//                   <td>Project Hades</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-success">Done</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">Sharon Lessman</td>
//                 </tr>
//                 <tr>
//                   <td>Project Nitro</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-warning">In progress</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">Vanessa Tucker</td>
//                 </tr>
//                 <tr>
//                   <td>Project Phoenix</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-success">Done</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">William Harris</td>
//                 </tr>
//                 <tr>
//                   <td>Project X</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-success">Done</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">Sharon Lessman</td>
//                 </tr>
//                 <tr>
//                   <td>Project Romeo</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-success">Done</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">Christina Mason</td>
//                 </tr>
//                 <tr>
//                   <td>Project Wombat</td>
//                   <td className="d-none d-xl-table-cell">01/01/2021</td>
//                   <td className="d-none d-xl-table-cell">31/06/2021</td>
//                   <td>
//                     <span className="badge bg-warning">In progress</span>
//                   </td>
//                   <td className="d-none d-md-table-cell">William Harris</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="col-12 col-lg-4 col-xxl-3 d-flex">
//           <div className="card flex-fill w-100">
//             <div className="card-header">
//               <h5 className="card-title mb-0">Monthly Sales</h5>
//             </div>
//             <div className="card-body d-flex w-100">
//               <div className="align-self-center chart chart-lg">
//                 <canvas id="chartjs-dashboard-bar"></canvas>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Content;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { getTinTucById } from "../services/apiService";

const ChiTietTinTuc = () => {
  const { id } = useParams();
  const [tinTuc, setTinTuc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadTinTucDetail = async () => {
      try {
        const data = await getTinTucById(token, id);
        if (data.resultCode === 0) {
          setTinTuc(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError("Không thể tải chi tiết tin tức");
        console.error("Error loading tin tuc detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTinTucDetail();
  }, [id, token]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải tin tức...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!tinTuc) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Không tìm thấy tin tức</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title as="h1" className="mb-4">
            {tinTuc.tieude}
          </Card.Title>
          
          {tinTuc.url && (
            <div className="text-center mb-4">
              <img
                src={`http://3.104.77.30:8080/api/v1/project/auth/download?filename=${tinTuc.url}`}
                alt={tinTuc.tieude}
                className="img-fluid rounded"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}
          
          <div
            className="tin-tuc-content"
            dangerouslySetInnerHTML={{ __html: tinTuc.noidungtin }}
          />
          
          <div className="mt-4 text-muted">
            <p>
              <strong>Người tạo:</strong> {tinTuc.nguoitao}
            </p>
            <p>
              <strong>Ngày đăng:</strong>{" "}
              {new Date(tinTuc.thoigiantao).toLocaleString()}
            </p>
            {tinTuc.nguoipheduyet && (
              <p>
                <strong>Người phê duyệt:</strong> {tinTuc.nguoipheduyet}
              </p>
            )}
            {tinTuc.thoigianpheduyet && (
              <p>
                <strong>Thời gian phê duyệt:</strong>{" "}
                {new Date(tinTuc.thoigianpheduyet).toLocaleString()}
              </p>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChiTietTinTuc;