import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import '../assets/styles/auth.css';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const navigate = useNavigate();
    // Send email with OTP
    const handleRegisterClick = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/checkEmail/register`, { email });
            
            if (response.status === 200) {
                // Email is available for registration, send OTP
                const otpResponse = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/sendMail`, { email });
                if (otpResponse.status === 200) {
                    setOtpSent(true);
                    alert('OTP has been sent to your email.');
                    localStorage.setItem('gmail', email);
                } else {
                    alert('Failed to send OTP. Please try again.');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('Tài khoản đã tồn tại . Vui lòng nhập gmail khác để đăng ký.');
            } else {
                alert('Tài khoản gmail của bạn không tồn tại. Vui lòng nhập gmail lại.');
            }
        }
    };
    
    // Verify OTP entered by the user
    const handleOtpVerify = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/verifyOtp`, { email, otp });
            if (response.status === 200) {
                setOtpVerified(true); // OTP verified successfully
                alert('OTP verified successfully! Redirecting to account setup...');
                navigate('/register')
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('An error occurred while verifying OTP.');
        }
    };

    return (
        <div className='auth-page content'>
            <div className='wrapper'>
                <div className='register'>
                    <h3>ĐĂNG KÝ</h3>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Địa chỉ email</Form.Label>
                            <Form.Control
                                style={{ width: '100%' }}
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <p>Thông tin cá nhân của bạn sẽ được sử dụng để tăng cường trải<br />
                            nghiệm sử dụng website, để quản lý truy cập vào tài khoản của<br />
                            bạn, và cho các mục đích cụ thể khác được mô tả trong chính sách<br />
                            riêng tư của chúng tôi.</p>
                        <button
                            type="button"
                            id='register'
                            onClick={handleRegisterClick}
                        >
                            ĐĂNG KÝ
                        </button>

                        {otpSent && (
                            <Form.Group className="mt-3" controlId="otpInput">
                                <Form.Label>Nhập mã OTP</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập mã OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button
                                    type="button"
                                    id='verifyOtp'
                                    onClick={handleOtpVerify}
                                    style={{ marginTop: '10px' }}
                                >
                                    Xác nhận OTP
                                </button>
                            </Form.Group>
                        )}

                        {otpVerified && (
                            <p>OTP verified! You will be redirected to the account setup page.</p>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
