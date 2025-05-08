import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { uploadImage, updateTinTuc, fetchTinTucById, getImage } from '../services/apiService';

const ChinhSuaTinTuc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    tieude: '',
    noidung: '',
    imageUrl: '',
    imagePreview: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchTinTucById(token, id);
        if (data.resultCode === 0) {
          const imageUrl = await getImage(token, data.data.imageUrl);
          setFormData({
            tieude: data.data.tieude,
            noidung: data.data.noidungtin || data.data.noidung || '',
            imageUrl: data.data.imageUrl,
            imagePreview: imageUrl.data
          });
        } else {
          throw new Error(data.message || 'Không thể tải tin tức');
        }
      } catch (err) {
        setError('Không thể tải tin tức');
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id, token]);

  const validateForm = () => {
    const errors = {};
    if (!formData.tieude.trim()) errors.tieude = 'Tiêu đề là bắt buộc';
    if (!formData.noidung.trim()) errors.noidung = 'Nội dung là bắt buộc';
    if (!formData.imageUrl) errors.imageUrl = 'Ảnh đại diện là bắt buộc';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const filename = await uploadImage(token, file);
      const imageUrl = await getImage(token, filename);
      setFormData(prev => ({
        ...prev,
        imageUrl: filename,
        imagePreview: imageUrl.data
      }));
      setValidationErrors(prev => ({ ...prev, imageUrl: '' }));
    } catch (err) {
      setError('Không thể tải lên ảnh');
      console.error('Error uploading image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire('Lỗi!', 'Vui lòng điền đầy đủ các trường bắt buộc!', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await updateTinTuc(token, id, {
        tieude: formData.tieude,
        noidung: formData.noidung,
        imageUrl: formData.imageUrl
      });
      
      if (data.resultCode === 0) {
        Swal.fire('Thành công!', 'Cập nhật tin tức thành công', 'success')
          .then(() => navigate('/news-management'));
      } else {
        throw new Error(data.message || 'Cập nhật tin tức thất bại');
      }
    } catch (err) {
      setError('Cập nhật tin tức thất bại');
      console.error('Error updating news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, noidung: content }));
    setValidationErrors(prev => ({ ...prev, noidung: '' }));
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Chỉnh sửa tin tức</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/news-management')}
        >
          Quay lại
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Tiêu đề <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="tieude"
                value={formData.tieude}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.tieude}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.tieude}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Ảnh đại diện <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                isInvalid={!!validationErrors.imageUrl}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.imageUrl}
              </Form.Control.Feedback>
              {formData.imagePreview && (
                <div className="mt-2">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Nội dung <span className="text-danger">*</span></Form.Label>
              <Editor
                apiKey="81nqqgdcskujwzivy6b4lbzypp8y7wtxz8vd9njh5hdoevil"
                value={formData.noidung}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
                  toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                }}
              />
              {validationErrors.noidung && (
                <div className="text-danger mt-1">{validationErrors.noidung}</div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/news-management')}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Cập nhật'}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default ChinhSuaTinTuc;