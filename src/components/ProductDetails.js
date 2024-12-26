import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { FaStar } from "react-icons/fa6";
import { DiGitCompare } from "react-icons/di";
import { CiHeart } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import { FaPinterest } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaTelegram } from "react-icons/fa6";
import '../assets/styles/productDetails.css';
import '../assets/styles/index.css';
import Comment from './Comment';
import ScrollToTop from './ScrollTop';

function ProductDetail({ setCartItems, setProductsWishList }) {
    const [products, setProducts] = useState([]); 
    const [product, setProduct] = useState(null); 
    const { id } = useParams(); 
    const [specifications, setSpecifications] = useState([]);
    const [specification, setSpecification] = useState(null); 
    const [quantity, setQuantity] = useState(1); // Trạng thái lưu trữ số lượng
    const [maKhachHang, setMaKhachHang] = useState('');
    const [tenKh, setTenKh] = useState('');
    const maKh = localStorage.getItem('maKh'); // Assuming `maKh` is stored as a string

    const setFavicon = (faviconPath) => {
        const link = document.querySelector("link[rel~='icon']");
        if (link) {
            link.href = faviconPath;
        }
    };

    useEffect(() => {
        setFavicon('https://res.cloudinary.com/deuqzffc4/image/upload/v1732938449/icon_z064sv.png'); // Đường dẫn favicon
    }, []);
    useEffect(() => {
        // Gọi API để lấy danh sách sản phẩm
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => setProducts(response.data))
            .catch(error => console.error('Có lỗi khi gọi API:', error));
    }, []);

    useEffect(() => {
        // Tìm sản phẩm theo id
        if (products.length > 0) {
            const foundProduct = products.find(p => p.maSP === parseInt(id));
            setProduct(foundProduct); 
        }
    }, [products, id]);

    useEffect(() => {
        // Gọi API để lấy thông số kỹ thuật
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/thong-so-ky-thuat`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => setSpecifications(response.data))
            .catch(error => console.error('Có lỗi khi gọi API:', error));
    }, []);

    useEffect(() => {
        // Tìm thông số kỹ thuật theo id sản phẩm
        if (specifications.length > 0) {
            const foundSpecification = specifications.find(s => s.maSP === parseInt(id));
            setSpecification(foundSpecification); 
        }
    }, [specifications, id]);

    useEffect(()=>{
        setMaKhachHang(localStorage.getItem('maKh' || ''));
        setTenKh(localStorage.getItem('tenKh' || ''))
    },[])

    // Kiểm tra nếu product hoặc specification không tồn tại
    if (!product) {
        return <h2>Sản phẩm không tồn tại</h2>;
    }
    if (!specification) {
        return <h2>Thông số không tồn tại</h2>;
    }

    // Render ra số sao của sản phẩm
    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < product.sao; i++) {
            stars.push(<FaStar key={i} />);
        }
        return stars;
    };

    localStorage.setItem('tenSP', product.tenSp)

    // Tính giá thực dựa trên phần trăm giảm giá
    const discountedPrice = product.giaBan * (1 - (product.phanTram / 100));
    const handleAddToCart = () => {
        const { maSP, tenSp, anhDD} = product;
        const ngayDat = new Date().toISOString(); // Thời gian hiện tại làm ngày đặt
        const orderData = {
            maKh : maKhachHang,
            maSP,
            tenSp,
            anhDD,
            soLuong: quantity,
            giaTien: discountedPrice * quantity, // Tính tổng giá
            ngayDat,
            tenKh: tenKh
        };

        axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/donhang_dadat`, orderData)
            .then(response => {
                console.log('Đã thêm đơn hàng:', response.data);
                alert('Đã thêm sản phẩm vào giỏ hàng');
                axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/cart-shop`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                    },
                })
                    .then(response => {
                        let temp = response.data
                        const filteredItems = temp.filter(item => item.maKh === parseInt(maKh));
                        setCartItems(filteredItems); // Expecting response.data to be an array
                    })
                    .catch(error => {
                        console.error('Error fetching cart data:', error);
                    });
            })
            .catch(error => {
                console.error('Có lỗi khi thêm vào giỏ hàng:', error);
                alert('Có lỗi khi thêm sản phẩm vào giỏ hàng');
        });
    }

    const handleAddWishList = () => {
        const { maSP, tenSp, anhDD, giaBan, trangThai, anhDD1, phanTram, thuongHieu, sao} = product;
        const wishlistData = {
            maKh : maKhachHang,
            maSP,
            tenSp,
            anhDD,
            soLuong: quantity,
            giaBan: giaBan, 
            trangThai,
            phanTram,
            thuongHieu,
            anhDD1,
            sao
        };

        axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/sanpham-yeuthich`, wishlistData)
            .then(response => {
                alert('Đã thêm sản phẩm danh sách yêu thích');
                axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/sanpham-yeuthich`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                    },
                })
                    .then(response => {
                        let temp = response.data
                        const filteredItemsWishList = temp.filter(item => item.maKh === parseInt(maKh));
                        setProductsWishList(filteredItemsWishList); // Expecting response.data to be an array
                    })
                    .catch(error => {
                        console.error('Error fetching cart data:', error);
                    });
            })
            .catch(error => {
                console.error('Có lỗi khi thêm vào giỏ hàng:', error);
                alert('Có lỗi', )
        });
    }
    return (
        <div className='infor-page'>
            <div className='wrapper'>
                <ScrollToTop /> 
                <div className='description'>
                    <Row>
                        <Col sm={6}>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                <Row>
                                    <Col sm={4}>
                                        <Nav variant="" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">
                                                    <img className='anhdd' src={product.anhDD} alt='err'></img>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">
                                                    <img className='anhdd' src={product.anhDD1} alt='err'></img>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="third">
                                                    <img className='anhdd' src={product.anhDD2} alt='err'></img>
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col sm={8}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first"><img className='anhdd' src={product.anhDD} alt='err'></img></Tab.Pane>
                                            <Tab.Pane eventKey="second"><img className='anhdd' src={product.anhDD1} alt='err'></img></Tab.Pane>
                                            <Tab.Pane eventKey="third"><img className='anhdd' src={product.anhDD2} alt='err'></img></Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Col>
                        <Col sm={6}>
                            <h4>{product.tenSp}</h4>
                            <div className='star'>
                                {renderStars()}
                            </div><span>(Đánh giá của khách hàng)</span>
                            <div className='experience'>
                                <img  src='https://res.cloudinary.com/deuqzffc4/image/upload/v1732070965/promotions_pytcwp.svg' alt='err' />
                                <h6>Trải nghiệm sản phẩm tại Store HN & HCM</h6>
                                <p>Hà Nội: 11 Đường Ven Sông Lừ, Kim Liên, Đống Đa, HN<br/>
                                    Hồ Chí Minh: 62 Hoa Cau, Phường 7, Phú Nhuận, TP.HCM<br/>
                                    HN: 0928 759 555 / HCM: 0394 678 121
                                </p>
                                <p>Lưu ý: Đây là Website duy nhất và không có bất kỳ<br/>
                                 "CHƯƠNG TRÌNH" giảm giá 70-75% nào đã & đang được diễn rạ</p>
                            </div>
                            {/* Hiển thị giá gốc bị gạch ngang và giá thực */}
                            <h5 style={{ textDecoration: 'line-through' , opacity:'0.2' }}>
                                {product.giaBan.toLocaleString('vi-VN')}đ
                            </h5>
                            <h5>{discountedPrice.toLocaleString('vi-VN')}đ</h5>
                            
                            <div style={{margin: '0px 0px 20px 0px'}} className='inline-flex'>
                                <span className='f-500'>Màu :</span>
                                <span>{specification.mau}</span>
                            </div><br />
                            
                            <div className='inline-flex'  style={{ alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgb(221 216 216)' , paddingBottom:'20px'}}>
                                <button
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        textAlign: 'center',
                                        lineHeight: '20px',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        marginRight: '5px',
                                        background:'#000'
                                    }}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))} // Không cho số lượng nhỏ hơn 1
                                >
                                    -
                                </button>
                                <input
                                    style={{ width: '60px', textAlign: 'center' }}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Đảm bảo giá trị tối thiểu là 1
                                    min="1"
                                />
                                <button
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        textAlign: 'center',
                                        lineHeight: '8px',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        marginLeft: '5px',
                                        background:'#000'
                                    }}
                                    onClick={() => setQuantity(quantity + 1)} // Tăng số lượng
                                >
                                    +
                                </button>
                                <button className='add-cart' onClick={handleAddToCart}>Add To Cart</button>
                                <button className='buy-now'> Buy Now</button>
                            </div>
                            <div className='inline-flex'>
                                <div className='compare inline-flex' style={{marginRight:'20px', cursor:'pointer'}}>
                                    <DiGitCompare/>
                                    <h6>Compare</h6>
                                </div>
                                <div className='wishlist inline-flex' style={{cursor:'pointer'}} onClick={handleAddWishList}>
                                    <CiHeart/>
                                    <h6>Add to wishlist</h6>
                                </div>
                                <div className='inline-flex' style={{marginLeft:'200px'}}>
                                    <h6>Share:</h6>
                                    <FaFacebook style={{  marginLeft: '10px'}}/>
                                    <FaTwitter style={{  marginLeft: '10px'}}/>
                                    <FaPinterest style={{  marginLeft: '10px'}}/>
                                    <AiFillInstagram style={{  marginLeft: '10px'}}/>
                                    <FaTelegram style={{  marginLeft: '10px'}}/>
                                </div>
                            </div>
                            <div className='delivery'>
                                <div className='delivery-top'>
                                        <div className='inline-flex'>
                                            <img src={'https://res.cloudinary.com/deuqzffc4/image/upload/v1732082938/store_votzyp.svg'} alt=''></img>
                                            <h6>Nhận hàng tại Store</h6>
                                        </div><br/>
                                       <div className='inline-flex'>
                                            <p>Nhận ngay trong ngày</p>
                                            <h6>Miễn phí</h6>
                                       </div><br/>
                                       <div className='inline-flex'>
                                            <img src={'https://res.cloudinary.com/deuqzffc4/image/upload/v1732082938/store_votzyp.svg'} alt=''></img>
                                            <h6>Giao hàng chuyển phát nhanh</h6>
                                        </div>
                                       <div className='inline-flex'>
                                            <p>Chuyển phát nhanh của chúng tôi sẽ giao hàng<br/>
                                             đến địa chỉ của bạn</p>
                                            <p style={{opacity:'0.5'}}>1-3 Days</p>
                                            <h6>Tính phí</h6>
                                       </div> 
                                </div>
                                <div className='delivery-bottom'>
                                        <div className='inline-flex'>
                                            <img src={'https://res.cloudinary.com/deuqzffc4/image/upload/v1732082950/warranty_wgqvzn.svg'} alt=''></img>
                                            <h6>Bảo hành 1 năm</h6>
                                        </div><br/>
                                       <div className='inline-flex'>
                                            <img src={'https://res.cloudinary.com/deuqzffc4/image/upload/v1732082965/return_wykqim.svg'} alt=''></img>
                                            <h6>Đổi trả miễn phí trong 30 ngày</h6>
                                       </div> 
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className='product-detail'>
                <div className='wrapper'>
                    <Row>
                        <Col className='left' sm={7}>
                            <h4>Thông tin sản phẩm</h4>
                            <p>{product.noiDung}</p>
                            <img className='w-100' src={product.anhmota1} alt='err'></img>
                            <Row>
                                <Col sm={6}>
                                    <h4>ÂM THANH CỦA THIẾT BỊ</h4>
                                    <p>{product.amthanh}</p>
                                    <img className='w-100' src={product.anhmota2} alt='err' />
                                </Col>
                                <Col sm={6}>
                                    <h4>THIẾT KẾ ĐỘC ĐÁO</h4>
                                    <p>{product.thietke}</p>
                                    <img className='w-100' src={product.anhmota3} alt='err' />
                                </Col>
                            </Row>
                            <img className='w-100' src={product.anhmota4} alt='err' />
                            <Row>
                                <Col sm={6}>
                                    <h4>THỜI LƯỢNG CỦA THIẾT BỊ</h4>
                                    <img className='w-100' src={product.anhmota5} alt='err' />
                                    <p>{product.thoiLuong}</p>
                                </Col>
                                <Col sm={6}>
                                    <h4>TÙY CHỈNH ÂM THANH CỦA BẠN</h4>
                                    <img className='w-100' src={product.anhmota6} alt='err' />
                                    <p>{product.tuyChinh}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col className='right' sm={5}>
                            <h4>Thông số kỹ thuật</h4>
                            <div className='w-100 inline-flex'>
                                <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1732071006/processor_tkukgd.svg' alt='err' />
                                <h5>Thông số âm thanh</h5>
                            </div>
                            <Row>
                                <Col sm={6}>
                                    <p>Thương hiệu</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.thuongHieu}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <p>Màu</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.mau}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <p>Ứng dụng hỗ trợ</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.ungDung}</p>
                                </Col>
                            </Row>
                            <hr />
                            <div className='w-100 inline-flex'>
                                <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1732071077/display_ln3xfi.svg' alt='err' />
                                <h5>Kiểm soát và kết nối</h5>
                            </div>
                            <Row>
                                <Col sm={6}>
                                    <p>Kết nối không dây</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.loaiKetNoi}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <p>Pin</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.pin}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <p>Thời gian sạc</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.thoiGianSac}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <p>Thời lượng Pin</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.thoiLuongPin}</p>
                                </Col>
                            </Row>
                            <hr />
                            <div className='w-100 inline-flex'>
                                <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1732071083/ram_t8e9er.svg' alt='err' />
                                <h5>Kích thước</h5>
                            </div>
                            <Row>
                                <Col sm={6}>
                                    <p>Trọng lượng</p>
                                </Col>
                                <Col sm={6}>
                                    <p className='f-500'>{specification.kichThuoc}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
            <Comment/>
        </div>
    );
} 

export default ProductDetail;