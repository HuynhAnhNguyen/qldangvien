// NewsManagement.js
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const token = localStorage.getItem('token');

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      if (!file) {
        throw new Error('Không có tệp để tải lên');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'http://3.104.77.30:8080/api/v1/project/file/uploadImage',
        formData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const filename = response.data?.data;
      if (!filename) {
        throw new Error('Tải lên hình ảnh thất bại');
      }

      return {
        default: `http://3.104.77.30:8080/api/v1/project/file/getImage/${filename}`
      };
    } catch (error) {
      console.error('Lỗi tải lên:', error);
      throw error;
    }
  }

  abort() {
    console.log('Đã hủy tải lên');
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const QuanLyTinTuc = () => {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    tieude: '',
    noidung: '',
    imageUrl: ''
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://3.104.77.30:8080/api/v1/project/tintuc/findAll', {
        headers: { Authorization: `${token}`, }
      });
      setNewsList(response.data.data);
      setFilteredNews(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách tin tức');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://3.104.77.30:8080/api/v1/project/tintuc/findAllApproved', {
        headers: { Authorization: `${token}`, }
      });
      setNewsList(response.data.data);
      setFilteredNews(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải tin tức đã duyệt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let result = newsList;
    
    if (searchTerm) {
      result = result.filter(news => 
        news.tieude.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(news => news.trangthai === statusFilter);
    }
    
    setFilteredNews(result);
  }, [searchTerm, statusFilter, newsList]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({ ...formData, noidung: data });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'http://3.104.77.30:8080/api/v1/project/file/uploadImage',
        formData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFormData({ ...formData, imageUrl: response.data.data });
    } catch (err) {
      setError('Lỗi khi tải lên hình ảnh');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (currentNews) {
        // Update existing news
        await axios.put(
          `http://3.104.77.30:8080/api/v1/project/tintuc/update/${currentNews.id}`,
          formData,
          { headers: { Authorization: `${token}`, } }
        );
      } else {
        // Create new news
        await axios.post(
          'http://3.104.77.30:8080/api/v1/project/tintuc/create',
          formData,
          { headers: { Authorization: `${token}`, } }
        );
      }
      
      setShowModal(false);
      fetchNews();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu tin tức');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://3.104.77.30:8080/api/v1/project/tintuc/delete/${newsToDelete.id}`,
        { headers: { Authorization: `${token}`, } }
      );
      setShowDeleteModal(false);
      fetchNews();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi xóa tin tức');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (news) => {
    setCurrentNews(news);
    setFormData({
      tieude: news.tieude,
      noidung: news.noidung,
      imageUrl: news.imageUrl
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setCurrentNews(null);
    setFormData({
      tieude: '',
      noidung: '',
      imageUrl: ''
    });
    setShowModal(true);
  };

  const openDeleteModal = (news) => {
    setNewsToDelete(news);
    setShowDeleteModal(true);
  };

  const viewNewsDetail = (id) => {
    navigate(`/tintuc/${id}`);
  };

  const approveNews = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `http://3.104.77.30:8080/api/v1/project/tintuc/approve/${id}`,
        {},
        { headers: { Authorization: `${token}`,} }
      );
      fetchNews();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi duyệt tin tức');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Quản lý Tin tức</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </Form.Select>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i>Thêm tin mới
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tiêu đề</th>
              <th>Hình ảnh</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((news, index) => (
              <tr key={news.id}>
                <td>{index + 1}</td>
                <td>{news.tieude}</td>
                <td>
                  {news.imageUrl && (
                    <img 
                      src={news.imageUrl} 
                      alt={news.tieude} 
                      style={{ width: '100px', height: 'auto' }} 
                    />
                  )}
                </td>
                <td>
                  <Badge 
                    bg={
                      news.trangthai === 'approved' ? 'success' : 
                      news.trangthai === 'rejected' ? 'danger' : 'warning'
                    }
                  >
                    {news.trangthai === 'approved' ? 'Đã duyệt' : 
                     news.trangthai === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                  </Badge>
                </td>
                <td>{new Date(news.thoigiantao).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="info" 
                      size="sm" 
                      onClick={() => viewNewsDetail(news.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => openEditModal(news)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => openDeleteModal(news)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                    {news.trangthai === 'pending' && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => approveNews(news.id)}
                      >
                        <i className="fas fa-check"></i>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentNews ? 'Chỉnh sửa Tin tức' : 'Thêm Tin tức mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="tieude"
                value={formData.tieude}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh đại diện</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.imageUrl && (
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="mt-2" 
                  style={{ maxWidth: '200px', maxHeight: '200px' }} 
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.noidung}
                onChange={handleEditorChange}
                config={{
                  extraPlugins: [MyCustomUploadAdapterPlugin],
                  toolbar: [
                    'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 
                    'numberedList', '|', 'imageUpload', 'blockQuote', 
                    'insertTable', 'mediaEmbed', '|', 'undo', 'redo'
                  ]
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa tin tức "{newsToDelete?.tieude}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuanLyTinTuc;