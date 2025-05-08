import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchTinTuc, deleteTinTuc } from '../services/apiService';
import NewsSearch from './NewsSearch';
import NewsPagination from './NewsPagination';

const DanhSachTinTuc = () => {
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await fetchTinTuc(token);
      if (data.resultCode === 0) {
        const normalizedData = Array.isArray(data.data)
          ? data.data.map(item => ({
              ...item,
              noidung: item.noidungtin || '',
            }))
          : [];
        setNewsList(normalizedData);
        setError(null);
      } else {
        throw new Error(data.message || 'Không thể tải danh sách tin tức');
      }
    } catch (err) {
      setError('Không thể tải danh sách tin tức');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (newsId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa tin tức này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const data = await deleteTinTuc(token, newsId);
        if (data.resultCode === 0) {
          setNewsList(newsList.filter(item => item.tintucId !== newsId));
          Swal.fire('Thành công!', 'Xóa tin tức thành công', 'success');
        } else {
          throw new Error(data.message || 'Xóa tin tức thất bại');
        }
      } catch (err) {
        Swal.fire('Lỗi!', 'Xóa tin tức thất bại', 'error');
        console.error('Error deleting news:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const filteredNews = newsList.filter(item => {
    const matchesSearch = 
      item.tieude?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item.noidung?.toLowerCase()?.includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'approved' && item.isApproved) || 
      (filterStatus === 'pending' && !item.isApproved);
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentItems = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Danh sách tin tức</h1>
        <Link to="/news-management/add" className="btn btn-success">
          <i className="fas fa-plus me-2"></i>Thêm mới
        </Link>
      </div>

      <NewsSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {currentItems.length === 0 ? (
        <div className="text-center py-4">
          Không tìm thấy tin tức nào phù hợp!
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.tintucId}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.tieude}</td>
                    <td>
                      <span className={`badge ${item.isApproved ? 'bg-success' : 'bg-warning'}`}>
                        {item.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link 
                          to={`/news-management/edit/${item.tintucId}`} 
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteNews(item.tintucId)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <NewsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default DanhSachTinTuc;