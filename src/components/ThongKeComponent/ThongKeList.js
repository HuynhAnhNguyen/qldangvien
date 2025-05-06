import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { fetchThongKe } from "../../services/apiService";
import ThongKeCards from "./ThongKeCards";
import ThongKeCharts from "./ThongKeCharts";

const ThongKeList = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await fetchThongKe(token);
        if (data.resultCode === 0) {
          setStats(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-4 text-muted">Không có dữ liệu</div>;
  }

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Báo cáo thống kê</h1>
        </div>
        <ThongKeCards stats={stats} />
        <ThongKeCharts stats={stats} />
      </div>
    </div>
  );
};

export default ThongKeList;
