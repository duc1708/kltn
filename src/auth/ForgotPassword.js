import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Alert, AlertTitle } from '@mui/material';
import '../assets/styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertErrorPass, setShowAlertErrorPass] = useState(false);
    const [showAlertSuccessPass, setShowAlertSuccessPass] = useState(false);
    const navigate = useNavigate();
    // Send email with OTP
    const handleRegisterClick = async () => {
        try {
            // Check if the email exists in the database
            const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/checkEmail`, { email });
            if (response.status === 200) {
                localStorage.setItem('gmail', email);
                const otpResponse = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/sendMail`, { email });
                if (otpResponse.status === 200) {
                    setOtpSent(true); 
                    setShowAlertSuccess(true);
                    setTimeout(() => setShowAlertSuccess(false), 4000); 
                    localStorage.setItem('gmail', email);
                } else {
                    alert('Failed to send OTP. Please try again.');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(email)
                setShowAlertError(true);
                setTimeout(() => setShowAlertError(false), 4000); 
            } else {
                alert('An error occurred while checking the email.');
            }
        }
    };
    

    // Verify OTP entered by the user
    const handleOtpVerify = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/verifyOtp`, { email, otp });
            if (response.status === 200) {
                setShowAlertSuccessPass(true);
                setTimeout(()=> setShowAlertSuccessPass(false), 4000);
                setTimeout(()=> navigate('/reset-password'), 5000);
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setShowAlertErrorPass(true);
            setTimeout(() => setShowAlertErrorPass(false), 4000); 
        }
    };

    return (
        <div className='auth-page content'>
            <div className='wrapper'>
                <div className='register'>
                        {showAlertSuccess && (
                            <Alert severity="success">
                            <AlertTitle>Success</AlertTitle>
                                Chúng tôi đã gửi mã otp về gmail của bạn, vui lòng nhập mã!
                            </Alert>
                        )}
                        {showAlertError && (
                            <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                                Tài khoản gmail bạn nhập không tồn tại. vui lòng nhập lại !
                            </Alert>
                        )}
                        {showAlertErrorPass && (
                            <Alert id="err-pass" severity="error">
                            <AlertTitle>Error</AlertTitle>
                                Mã xác thực không trùng khớp với mã đã gửi gmail. Vui lòng nhập lại !
                            </Alert>
                        )}

                        {showAlertSuccessPass &&(
                            <Alert id="success-pass" severity="success">
                            <AlertTitle>Success</AlertTitle>
                                Bạn đã nhập mã xác thực thành công !
                            </Alert>
                        )}
                    <h3>NHẬP GMAIL ĐÃ ĐĂNG KÝ</h3>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Địa chỉ Gmail</Form.Label>
                            <Form.Control
                                style={{ width: '100%' }}
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <p>Vui lòng nhập địa chỉ gmail đã đăng ký tài khoản trước đó của bạn để 
                        nhận mã xác thực và tạo lại mật khẩu mới cho tài khoản.</p>
                        <button
                            type="button"
                            id='register'
                            onClick={handleRegisterClick}
                        >
                            Nhận mã OTP
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
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
