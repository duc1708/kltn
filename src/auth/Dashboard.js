import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { Alert, AlertTitle } from '@mui/material';
import '../assets/styles/auth.css';

const Dashboard = () => {
    const [tenKh, setTenKh] = useState('');
    const [avt, setAvt] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [gmail, setGmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState(null); // Để lưu trữ file ảnh chọn từ máy tính
    const [showAlertSuccess, setShowAlertSuccess] = useState(false); 
    
    useEffect(() => {
        // Load user data from localStorage
        setTenKh(localStorage.getItem('tenKh') || '');
        setAvt(localStorage.getItem('avt') || '');
        setGmail(localStorage.getItem('gmail') || '');
        setDiaChi(localStorage.getItem('diaChi') ||'')
    }, []);
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0]; // Lấy file đầu tiên được chọn
        if (selectedFile) {
            setAvt(selectedFile.name); // Cập nhật state với tên file (hoặc xử lý khác nếu cần)
            console.log('value',selectedFile.name)
            setFile(selectedFile.name)
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset previous errors

        // Prepare updated data
        const updatedData = {
            tenKh,
            avt,
            gmail,
            diaChi
        };

        // Handle password change logic
        if (oldPassword || newPassword || confirmPassword) {
            // Check if all password fields are provided
            if (!oldPassword || !newPassword || !confirmPassword) {
                setError('Vui lòng nhập đầy đủ các trường mật khẩu');
                return;
            }

            // Check if new password matches the confirmation
            if (newPassword !== confirmPassword) {
                setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return;
            }

            try {
                // Verify old password with backend
                const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}checkPassword`, { gmail, oldPassword });
                console.log('CheckPassword response:', response.data);

                if (response.status === 200) {
                    // Add the new password to the updated data
                    updatedData.matKhau = newPassword;

                    // Proceed with profile update
                    const updateResponse = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}updateProfile`, updatedData);

                    if (updateResponse.status === 200) {
                        // alert('Cập nhật thành công!');
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setError('Mật khẩu cũ không đúng');
                } else {
                    console.error('Error checking old password:', error);
                    setError('Có lỗi xảy ra khi kiểm tra mật khẩu cũ');
                }
            }
        } else {
            // Proceed to update without password change
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}updateProfile`, updatedData);
                if (response.status === 200) {
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                setError('Không thể cập nhật thông tin');
            }
        }

        if (file) {
            // Cập nhật ảnh mới lên server (sử dụng ảnh trong thư mục của ứng dụng)
            const formData = new FormData();
            formData.append('file', file);
            formData.append('gmail', gmail);

            try {
                // Gửi file lên server và cập nhật đường dẫn ảnh trong cơ sở dữ liệu
                const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}updateAvatar`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (response.status === 200) {
                    // Sau khi thành công, bạn có thể cập nhật lại thông tin
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
        }

        // Cập nhật thông tin người dùng không có thay đổi ảnh
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}updateProfile`, updatedData);
            if (response.status === 200) {
                setShowAlertSuccess(true); // Show alert on successful login
                setTimeout(() => setShowAlertSuccess(false), 2000); // Hide alert after 2 seconds
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Không thể cập nhật thông tin');
        }
    };

    return (
        <div className='dashboard content'>
            <div className='wrapper'>
                <div className='profile-user'>
                    {showAlertSuccess && (
                        <Alert severity="success">
                                <AlertTitle>Thành công!</AlertTitle>
                                    Cập nhật thông tin thành công.
                        </Alert>      
                    )}
                    
                    <Row>
                    <Col className='left-profile' sm={3}>
                        <h4 style={{ textAlign: 'center' }}>TÀI KHOẢN</h4><hr />
                        <img src={avt} alt="User Avatar" /><br />
                        <button 
                            type="file" 
                            id="choose-img" 
                            onClick={() => document.getElementById('file-input').click()} 
                            style={{ cursor: 'pointer' }}
                        >
                            Chọn ảnh
                        </button>
                        <input 
                            type="file" 
                            id="file-input" 
                            onChange={handleImageChange} 
                            style={{display:'none'}}
                        />
                        <p style={{ textAlign: 'center', fontWeight: '500' }}>{tenKh}</p>
                    </Col>

                        <Col className='right-profile' sm={9}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={tenKh || ""}
                                        onChange={(e) => setTenKh(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ giao hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={diaChi || ""}
                                        onChange={(e) => setDiaChi(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={gmail }
                                        onChange={(e) => setGmail(e.target.value)}
                                    />
                                </Form.Group>
                                <h4 style={{ textAlign: 'center', margin: '20px 0px' }}>THAY ĐỔI MẬT KHẨU</h4>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <button type="submit" style={{ border: 'none', width: '100px', height: '40px', background: '#000', color: '#fff' }}>Lưu thay đổi</button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
