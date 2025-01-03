const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const crypto = require('crypto');
const axios = require("axios");
app.use(express.urlencoded({ extended: true }));
// const fs = require('fs');
const path = require('path');
app.use(cors());
app.use(express.json());
const otpStorage = {};

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // user của MySQL
    password: '', // mật khẩu của MySQL
    database: 'ecom-marshall' // tên database
});


app.post('/api/sendMail', async (req, res) => {
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

app.post('/api/verifyOtp', (req, res) => {
    const { email, otp } = req.body;

    // Check if the OTP matches for the given email
    if (otpStorage[email] === otp) {
        delete otpStorage[email]; // Remove OTP after successful verification
        res.status(200).send('OTP verified');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

// Lấy tất cả sản phẩm
app.get('/api/products', (req,res)=>{
    const sql = 'SELECT * FROM sanpham';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// API lấy danh sách các loại loa
app.get('/api/products/categorize-speakers', (req,res)=>{
    const sql = 'SELECT * FROM loaisp WHERE maLoai = "1" or maLoai = "2" or maLoai = "3"';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// API lấy danh sách các loại tai nghe
app.get('/api/products/categorize-earsphone', (req,res)=>{
    const sql = 'SELECT * FROM loaisp WHERE maLoai = "4" or maLoai = "5" or maLoai = "6"';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});


// API để lấy sản phẩm có trangThai là 'Hot'
app.get('/api/products/hot', (req, res) => {
    const sql = 'SELECT * FROM sanPham WHERE  trangThai = "Hot"';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// API để lấy các sản phẩm có loại là loa di động và ở trạng thái là new
app.get('/api/products/loa-di-dong/new',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "1" and trangThai ="New"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// Lấy ra các sản phẩm của loại loa
app.get('/api/products/speakers',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "1" or maLoai = "2" or maLoai = "3"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// Lấy ra các sản phẩm của loai loa di dong
app.get('/api/products/loa-di-dong',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "1"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// Lấy ra các sản phẩm của loai loa nghe trong nha
app.get('/api/products/loa-trong-nha',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "2"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// Lấy ra các sản phẩm của loai loa limmited
app.get('/api/products/limited',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "3"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// Lấy ra các sản phẩm của tai nghe
app.get('/api/products/earsphone',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "4" or maLoai = "5" or maLoai = "6"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});



// API lấy các sản phẩm có loại là loa trong nhà với trang thái hot
app.get('/api/products/loa-trong-nha/hot',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "2" and trangThai ="HOT"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// API lấy các sản phẩm của loại phụ kiện
app.get('/api/products/phu-kien',(req,res)=>{
    const sql = 'SELECT * FROM sanpham WHERE maLoai = "7"';
    db.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// API lấy ra các blog

app.get('/api/blogs', (req,res)=>{
    const sql = 'SELECT * FROM baiviet';
    db.query(sql, (err,result)=>{
        if(err){
            return res.status(500).json({error: err});
        }
        res.json(result);
    })
})

// Lấy thông số kỹ thuật cho loại âm thanh
app.get('/api/thong-so-ky-thuat', (req,res)=>{
    const sql = 'SELECT * FROM thongso_kythuat';
    db.query(sql, (err,result)=>{
        if(err){
            return res.status(500).json({error: err});
        }
        res.json(result);
    })
})

// Lấy tài khoản của khách hàng
app.get('/api/accounts',(req,res)=>{
    const sql = 'SELECT * FROM khachhang';
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({error:err});
        }
        res.json(result);
    })
})

// API tạo tài khoản và mật khẩu cho khách hàng
app.post('/api/register', (req, res) => {
    const { tenTk, matKhau, gmail } = req.body;
  
    const sql = 'INSERT INTO khachhang (tenTk, matKhau, gmail) VALUES (?, ?,? )';
    db.query(sql, [tenTk, matKhau, gmail], (err, result) => {
      if (err) {
        res.status(500).send({ message: 'Error inserting data' });
        return;
      }
      res.status(200).send({ message: 'Account created successfully' });
    });
});

// API lấy ra tên người dùng để check khi đăng ký
app.get('/api/check-username', (req, res) => {
    const { tenTk } = req.query;
  
    const sql = 'SELECT * FROM khachhang WHERE tenTk = ?';
    db.query(sql, [tenTk], (err, results) => {
      if (err) {
        console.error('Error checking for duplicate tenTk:', err);
        res.status(500).send({ message: 'Server error' });
        return;
      }
      res.send({ exists: results.length > 0 });
    });
  });


// API kiểm tra mật khẩu cũ
app.post('/api/checkPassword', (req, res) => {
    const { gmail, oldPassword } = req.body;

    if (!gmail || !oldPassword) {
        console.log('Missing fields:', { gmail, oldPassword });
        return res.status(400).send('Email and old password are required');
    }

    const query = 'SELECT matKhau FROM khachhang WHERE gmail = ?';
    db.query(query, [gmail], (err, result) => {
        if (err) {
            console.error('Error checking password:', err);
            return res.status(500).send('Server error');
        }

        if (result.length === 0) {
            console.log('User not found with gmail:', gmail);
            return res.status(404).send('User not found');
        }

        // So sánh mật khẩu cũ với mật khẩu đã lưu trong cơ sở dữ liệu (plaintext)
        if (oldPassword !== result[0].matKhau) {
            console.log('Old password does not match.');
            return res.status(400).send('Mật khẩu cũ không đúng');
        }

        res.status(200).send('Password verified');
    });
});

// API cập nhật thông tin người dùng và mật khẩu mới
app.post('/api/updateProfile', (req, res) => {
    const { tenKh,sdt, avt, gmail, diaChi, matKhau } = req.body;  // Lấy matKhau từ request body
    if (!tenKh || !sdt || !avt || !diaChi || !gmail) {
        return res.status(400).send('All fields are required');
    }

    let query = 'UPDATE khachhang SET tenKh = ?,sdt=?, avt = ?, diaChi = ? WHERE gmail = ?';
    let values = [tenKh,sdt, avt, diaChi, gmail];

    if (matKhau) {
        query = 'UPDATE khachhang SET tenKh = ?, sdt=?, avt = ?, diaChi = ?, matKhau = ? WHERE gmail = ?';
        values = [tenKh,sdt, avt, diaChi, matKhau, gmail];
    }

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).send('Failed to update profile');
        }
        res.status(200).send('Profile updated successfully');
    });
});

// update avt cho user
app.post('/api/updateAvatar', (req, res) => {
    const { gmail } = req.body;
    const avatar = req.files.file;
    
    if (!avatar) {
        return res.status(400).send('No file uploaded');
    }

    // Tạo đường dẫn file
    const filePath = path.join(__dirname, 'public', 'avatars', avatar.name);

    // Lưu ảnh vào thư mục avatars
    avatar.mv(filePath, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Error uploading file');
        }

        // Cập nhật đường dẫn ảnh vào cơ sở dữ liệu
        const avatarUrl = `/avatars/${avatar.name}`;

        const sql = 'UPDATE khachhang SET avt = ? WHERE gmail = ?';
        db.query(sql, [avatarUrl, gmail], (err, result) => {
            if (err) {
                console.error('Error updating avatar:', err);
                return res.status(500).send('Error updating avatar');
            }
            res.status(200).send('Avatar updated successfully');
        });
    });
});

// Check email để đặt lại pass
app.post('/api/checkEmail', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM khachhang WHERE gmail = ?';
    
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Server error');
        }
        
        if (results.length > 0) {
            // Email exists, proceed to send OTP
            return res.status(200).send('Email exists');
        } else {
            // Email does not exist
            return res.status(400).send('Email not found');
        }
    });
});

// Check email để cho đăng ký
app.post('/api/checkEmail/register', (req, res) => {
    const { email } = req.body;
    console.log(email);
    const query = 'SELECT * FROM khachhang WHERE gmail = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            // Email exists, send error response
            return res.status(409).send('Email already exists');
        } else {
            // Email does not exist, allow registration
            return res.status(200).send('Email is available for registration');
        }
    });
});



app.post('/api/resetPassword', (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).send({ message: 'Email and new password are required' });
    }

    // Cập nhật mật khẩu trực tiếp trong cơ sở dữ liệu
    const sql = 'UPDATE khachhang SET matKhau = ? WHERE gmail = ?';
    db.query(sql, [newPassword, email], (err, result) => {
        if (err) {
            console.error('Error updating password:', err);
            return res.status(500).send({ message: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Email not found' });
        }

        res.status(200).send({ message: 'Password updated successfully' });
    });
});

app.get('/api/products/cart-shop',(req,res)=>{
    // API để lấy sản phẩm có trangThai là 'Hot'
    const sql = 'SELECT * FROM donhang_dadat';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
})


app.get('/api/products/orders',(req,res)=>{
    // API để lấy sản phẩm có trangThai là 'Hot'
    const sql = 'SELECT * FROM donhang_damua';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
})

// api để post đơn hàng đã đặt
app.post('/api/donhang_dadat', (req, res) => {
    const { maKh, maSP, tenSp, anhDD, soLuong, giaTien, ngayDat, tenKh } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!maKh || !maSP || !tenSp || !soLuong || !giaTien || !ngayDat || !tenKh) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Câu lệnh SQL
    const sql = `
        INSERT INTO donhang_dadat (maKh, maSP, tenSp, anhDD, soLuong, giaTien, ngayDat, tenKh)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Thực thi query
    db.query(sql, [maKh, maSP, tenSp, anhDD, soLuong, giaTien, ngayDat, tenKh], (err, result) => {
        if (err) {
            console.error('Có lỗi khi thêm đơn hàng:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm đơn hàng' });
        }

        res.status(201).json({ message: 'Thêm đơn hàng thành công', id: result.insertId });
    });
});

app.get('/api/products/cart-shop/:maKh', (req, res) => {
    const maKh = req.params.maKh; // Lấy maKh từ URL

    // Query SQL để lấy giỏ hàng của khách hàng từ bảng giỏ hàng
    const query = `
        SELECT dh.maSP, sp.tenSp, sp.anhDD, dh.soLuong, dh.giaTien
        FROM donhang_dadat dh
        JOIN sanpham sp ON dh.maSP = sp.maSP
        WHERE dh.maKh = ?
    `;
    
    db.query(query, [maKh], (err, results) => {
        if (err) {
            console.error('Error fetching cart data:', err);
            return res.status(500).send('Server error');
        }
        res.json(results); // Trả về dữ liệu giỏ hàng dưới dạng JSON
    });
});

app.post('/api/sanpham-yeuthich', (req, res) => {
    const { maKh, maSP, tenSp, anhDD, soLuong, giaBan, trangThai, phanTram, thuongHieu, anhDD1, sao } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!maKh || !maSP || !tenSp || !soLuong || !giaBan || !trangThai || !phanTram || !thuongHieu || !anhDD1 || !sao)  {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Câu lệnh SQL
    const sql = `
        INSERT INTO sanpham_yeuthich (maKh, maSP, tenSp, anhDD, soLuong, giaBan, trangThai, phanTram, thuongHieu, anhDD1, sao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Thực thi query
    db.query(sql, [maKh, maSP, tenSp, anhDD, soLuong, giaBan, trangThai, phanTram, thuongHieu, anhDD1, sao], (err, result) => {
        if (err) {
            console.error('Có lỗi khi thêm sản phẩm:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sản phẩm' });
        }

        res.status(201).json({ message: 'Thêm sản phẩm thành công', id: result.insertId });
    });
});

app.get('/api/products/wish-list/:maKh', (req, res) => {
    const maKh = req.params.maKh; 

    const query = `
            SELECT * 
            FROM sanpham_yeuthich spyt
            WHERE spyt.maKh = ? ;
    `;
    
    db.query(query, [maKh], (err, results) => {
        if (err) {
            console.error('Error fetching cart data:', err);
            return res.status(500).send('Server error');
        }
        res.json(results); 
    });
});

app.get('/api/products/wish-list',(req,res)=>{
    // API để lấy sản phẩm có trangThai là 'Hot'
    const sql = 'SELECT * FROM sanpham_yeuthich';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
})

app.post('/api/add-comment', (req, res) => {
    const { maKh, tenKh, noiDung, avt, ngayDang, maSP, tenSP } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!maKh || !tenKh || !noiDung || !avt || !ngayDang ||!maSP ||!tenSP)  {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Câu lệnh SQL
    const sql = `
        INSERT INTO binhluan (maKh, tenKh, noiDung, avt, ngayDang, maSP, tenSP)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Thực thi query
    db.query(sql, [maKh, tenKh, noiDung, avt, ngayDang,maSP, tenSP], (err, result) => {
        if (err) {
            console.error('Có lỗi khi thêm bình luận:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm bình luận' });
        }

        res.status(201).json({ message: 'Đăng bình luận thành công'});
    });
});
  
app.get('/api/binhluan',(req,res)=>{
    // API để lấy sản phẩm có trangThai là 'Hot'
    const sql = 'SELECT * FROM binhluan';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
})

app.put('/api/products/cart-shop/:id', async (req, res) => {
    const { id } = req.params;
    const { soLuong } = req.body;

    try {
        await db.query('UPDATE donhang_dadat SET soLuong = ? WHERE id = ?', [soLuong, id]);
        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating quantity', error });
    }
});


app.delete('/api/products/cart-shop/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM donhang_dadat WHERE id = ?', [id]);
        res.status(200).send({ message: 'Item removed successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).send({ message: 'Failed to remove item' });
    }
});

app.post('/api/donhang_damua', async (req, res) => {
    const orders = req.body; // Mảng các đơn hàng

    try {
        for (const order of orders) {
            await db.query('INSERT INTO donhang_damua SET ?', order);
        }
        res.status(201).json({ message: 'Đơn hàng đã được tạo thành công!' });
    } catch (error) {
        console.error('Lỗi khi thêm đơn hàng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
});


app.delete('/api/products/wish-list/:id', (req, res) => {
    const { id } = req.params;
    // Logic xóa sản phẩm từ cơ sở dữ liệu
    db.query('DELETE FROM sanpham_yeuthich WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Error deleting product');
        }
        res.status(200).send('Product removed');
    });
});


// API để xóa đơn hàng đã đặt
app.delete('/api/donhang_dadat/:id', (req, res) => {
    const id = req.params.id; // Lấy ID từ URL (có thể thay bằng trường khác như maSP nếu cần)

    if (!id) {
        return res.status(400).json({ message: 'Vui lòng cung cấp ID của đơn hàng để xóa' });
    }

    // Câu lệnh SQL để xóa đơn hàng
    const sql = 'DELETE FROM donhang_dadat WHERE id = ?'; // Thay 'id' bằng trường bạn dùng làm khóa chính

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Có lỗi khi xóa đơn hàng:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa đơn hàng' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa' });
        }

        res.status(200).json({ message: 'Xóa đơn hàng thành công' });
    });
});


app.post('/api/thongkedoanhthu', async (req, res) => {
    const thongke = req.body; // Mảng các đơn hàng

    try {
        for (const tk of thongke) {
            await db.query('INSERT INTO thongkedoanhthu SET ?', tk);
        }
        res.status(201).json({ message: 'ok' });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
});


app.post("/api/payment", async (req, res) => {
    try {
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        const orderInfo = 'pay with MoMo';
        const partnerCode = 'MOMO';
        const redirectUrl = `${process.env.REACT_APP_API_URL_MARSHALL_WEB}/order`; // Update this to your frontend URL
        const ipnUrl = `${process.env.REACT_APP_API_URL_MARSHALL}api/callback`;
        const requestType = "payWithMethod";
        const amount = req.body.amount;
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = '';
        const orderGroupId = '';
        const autoCapture = true;
        const lang = 'vi';

        if (amount < 1000 || amount > 50000000) {
            return res.status(400).json({
                statusCode: 400,
                message: "Amount must be between 1000 and 500000000 VND",
            });
        }

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        };

        const option = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
            },
            data: requestBody
        };

        const result = await axios(option);
        if (result.data.resultCode !== 0) {
            return res.status(400).json({
                statusCode: 400,
                message: result.data.message,
                data: result.data
            });
        }

        return res.status(200).json({ payUrl: result.data.payUrl });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Server error",
            error: error.response ? error.response.data : error.message
        });
    }
});


app.post("/api/callback", async (req, res) => {
    try {
        console.log("Callback received:", req.body);

        // Kiểm tra trạng thái giao dịch
        const { resultCode, orderId, extraData } = req.body;

        if (resultCode === 0) { // resultCode === 0 nghĩa là giao dịch thành công
            console.log("Payment successful for orderId:", orderId);

            // Parse extraData (nếu extraData chứa thông tin cần thiết)
            const cartItems = JSON.parse(extraData);

            // Chuẩn bị dữ liệu để thêm vào bảng `donhang_damua`
            const donHangDaMua = cartItems.map(item => ({
                maKh: item.maKh,
                maSP: item.maSP,
                tenSp: item.tenSp,
                anhDD: item.anhDD,
                soLuong: item.soLuong,
                giaTien: item.giaTien,
                ngayDat: new Date().toISOString(),
                diaChi: item.diaChi,
                sdt: item.sdt,
            }));

            // Thêm dữ liệu vào `donhang_damua`
            await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}donhang_damua`, donHangDaMua);

            // Xóa dữ liệu khỏi `donhang_dadat` (giả sử orderId liên kết với đơn hàng trong `donhang_dadat`)
            await axios.delete(`${process.env.REACT_APP_API_URL_MARSHALL}donhang_dadat/${orderId}`);

            console.log("Order moved to donhang_damua and removed from donhang_dadat.");
        } else {
            console.error("Payment failed with resultCode:", resultCode);
        }

        // Trả về phản hồi thành công cho MoMo
        res.status(200).send("Callback processed successfully.");
    } catch (error) {
        console.error("Error processing callback:", error);
        res.status(500).send("Internal server error.");
    }
});
app.listen(4000, () => {
    console.log('Server running at port 4000');
});
