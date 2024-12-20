const express = require('express');
const cors = require('cors'); 
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory storage for OTPs
const otpStorage = {};

app.post('/sendMail', async (req, res) => {
    const { email } = req.body;

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP for this email
    otpStorage[email] = otp;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'duc170803@gmail.com',
            pass: 'szld uxjg haqn fciy' // Use an app-specific password
        },
        secure: true
    });

    const mailOptions = {
        from: 'duc170803@gmail.com',
        to: email,
        subject: 'Mã OTP đăng ký tài khoản website Marshall',
        text: `Mã OTP dùng để đăng ký tài khoản là: ${otp}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("Error sending email:", error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('OTP sent successfully');
        }
    });
});

// Endpoint to verify OTP
app.post('/verifyOtp', (req, res) => {
    const { email, otp } = req.body;

    // Check if the OTP matches for the given email
    if (otpStorage[email] === otp) {
        delete otpStorage[email]; // Remove OTP after successful verification
        res.status(200).send('OTP verified');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
