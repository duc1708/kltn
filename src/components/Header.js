    import React, { useEffect, useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { IoLocationOutline } from "react-icons/io5";
    import { SlCallIn } from "react-icons/sl";
    import { CiShop, CiUser, CiSearch, CiHeart, CiShoppingCart } from "react-icons/ci";
    import { FaUser } from "react-icons/fa";
    import { IoIosSwap } from "react-icons/io";
    import Button from 'react-bootstrap/Button';
    import Form from 'react-bootstrap/Form';
    import Modal from 'react-bootstrap/Modal';
    import Row from 'react-bootstrap/Row';
    import Col from 'react-bootstrap/Col';
    import axios from 'axios';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import Alert from '@mui/material/Alert';
    import AlertTitle from '@mui/material/AlertTitle';
    import ProgressBar from 'react-bootstrap/ProgressBar';
    import '../assets/styles/header.css';

    function Header() {
        const [isFixed, setIsFixed] = useState(false);
        const [show, setShow] = useState(false);
        const [showResearch, setShowResearch] = useState(false);
        const [showCartShop, setShowCartShop] = useState(false);
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [showAlertSuccess, setShowAlertSuccess] = useState(false); 
        const [showAlertWarning,setShowAlertWarning] = useState(false);
        const [searchQuery,setSearchQuery] = useState('');
        const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
        const [filteredProducts, setFilteredProducts] = useState([]); 
        const navigate = useNavigate();
        const [cartItems, setCartItems] = useState([]);
        const maKh = localStorage.getItem('maKh'); // Assuming `maKh` is stored as a string

        // Fetch data from API
        axios.get(`http://localhost:4000/api/products/cart-shop/${maKh}`)
            .then(response => {
                setCartItems(response.data); // Cập nhật giỏ hàng từ API
            })
            .catch(error => {
                console.error('Error fetching cart data:', error);
        });
    
        // Gọi lại API mỗi khi component render hoặc khi giỏ hàng thay đổi
       
        // Filter cart items by maKh (nếu cần thiết)
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const handleShowCartShop = () => setShowCartShop(true);
        const handleCloseCartShop = () =>setShowCartShop(false);
        const handleCloseResearch = () => setShowResearch(false);
        const handleShowResearch = () => setShowResearch(true);

        const handleNavigate = () => {
            navigate('/forgot-password');
            handleClose();
        };
        
        const handleNavigateAuthPage = () => {
            navigate('/auth-page');
            handleClose();
        };

        
        const handleProductClick = (id) => {
            navigate(`/product/${id}`);
            setShowResearch(false);
        };
        useEffect(() => {
            const handleScroll = () => {
                const headerTopHeight = document.querySelector('.header-top').offsetHeight;
                setIsFixed(window.scrollY > headerTopHeight);
            };

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }, []);

        useEffect(() => {
            const tenKh = localStorage.getItem('tenKh');
            const avt = localStorage.getItem('avt');
            const gmail = localStorage.getItem('gmail');
            const diaChi = localStorage.getItem('diaChi');
        
            if (tenKh && avt && gmail && diaChi) {
                // Nếu có đủ thông tin trong localStorage, coi như đã đăng nhập
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        }, []);

        const handleLogin = async (e) => {
            e.preventDefault();
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}accounts`);
                const accounts = response.data;

                const account = accounts.find(
                    (acc) => acc.tenTk === username && acc.matKhau === password
                );
                if (account) {
                    localStorage.setItem('maKh', account.id);
                    localStorage.setItem('diaChi', account.diaChi);
                    localStorage.setItem('avt', account.avt);
                    localStorage.setItem('tenKh', account.tenKh);
                    localStorage.setItem('avt', account.avt);
                    localStorage.setItem('gmail', account.gmail);
                    localStorage.setItem('diaChi', account.diaChi)
                    localStorage.setItem('sdt', account.sdt);
                    setIsLoggedIn(true);
                    setShowAlertSuccess(true); // Show alert on successful login
                    setTimeout(() => setShowAlertSuccess(false), 2000); // Hide alert after 2 seconds
                    handleClose();
                    navigate('/');
                } else {
                    setShowAlertWarning(true);
                    setTimeout(() => setShowAlertWarning(false), 2000);
                    // handleClose();
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        const handleLogout = () => {
            localStorage.removeItem('tenKh');
            localStorage.removeItem('avt');
            localStorage.removeItem('gmail');
            localStorage.removeItem('diaChi');
            localStorage.removeItem('maKh');
            setIsLoggedIn(false); 
            navigate('/auth-page'); 
        };
        
        const handleDashboard = () => {
            navigate('/dashboard');
            handleClose();
        };

        const handleCartshop = ()=>{
            navigate('/cart-shop');
            handleClose();
            handleCloseCartShop();
        }

        const handleAddWishList = ()=>{
            navigate('/wish-list');
            handleClose();
        }

        useEffect(() => {
            axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}products`)
                .then(response => {
                    setProducts(response.data); // Lưu sản phẩm vào state
                    setFilteredProducts([]); // Ban đầu hiển thị tất cả sản phẩm
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        }, []);

        const handleSearchChange = (e) => {
                const query = e.target.value.trim().toLowerCase(); // Chuẩn hóa từ khóa tìm kiếm
                setSearchQuery(query);

                if (query === '') {
                    setFilteredProducts([]); // Hiển thị tất cả sản phẩm nếu không nhập từ khóa
                } else {
                const filtered = products.filter(product => {
                    // Kiểm tra nếu tên hoặc mô tả là chuỗi trước khi gọi toLowerCase
                    const nameMatch = product.tenSp && product.tenSp.toLowerCase().includes(query.toLowerCase());
                    return nameMatch;
                });
                setFilteredProducts(filtered); // Cập nhật sản phẩm đã lọc
            }
        };
        
    
        return (
            <div className='header'>
                <div className='wrapper'>
                    <div className='header-top'>
                        <Row>
                            <Col sm>
                                <div className='header-adress inline-flex'>
                                    <IoLocationOutline />
                                    <div className='header-text-adress'>
                                        <p>HN: 11 Đường Ven Sông Lừ, Kim Liên, Đống Đa, HN<br />
                                        HCM: 62 Hoa Cau, Phường 7, Phú Nhuận, TP.HCM</p>
                                    </div>
                                </div>
                            </Col>
                            <Col sm>
                                <div className='header-icon'>
                                    <img src={require('../assets/images/logo.jpg')} alt='err' />
                                </div>
                            </Col>
                            <Col sm>
                                <div className='header-phone inline-flex'>
                                    <SlCallIn />
                                    <p>0928.759.555<br />
                                        0394.678.121</p>
                                </div>
                                {showAlertSuccess && (
                                    <Alert severity="success">
                                    <AlertTitle>Success</AlertTitle>
                                        You have logged in successfully.
                                    </Alert>
                                )}
                                {showAlertWarning &&(
                                    <Alert severity="warning">
                                    <AlertTitle>Warning</AlertTitle>
                                        You entered incorrect login information
                                    </Alert>
                                )}
                                
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className={`header-bottom ${isFixed ? 'fixed' : ''}`}>
                    <div className='wrapper'>
                        <div className='navbar inline-flex'>
                            <div className='navbar-left'>
                                <ul className='nav-menu inline-flex'>
                                    <li>
                                        <Link to="/"><CiShop /></Link>
                                    </li>
                                    <li>
                                        <Link to="/speakers-marshall">LOA MARSHALL</Link>
                                    </li>
                                    <li>
                                        <Link to="/accessory-marshall">PHỤ KIỆN MARSHALL</Link>
                                    </li>
                                    <li>
                                        <Link to="/earsphone-marshall">TAI NGHE MARSHALL</Link>
                                    </li>
                                    <li>
                                        <Link to="/blog">BLOG</Link>
                                    </li>
                                    <li>
                                        <Link to="/contact">LIÊN HỆ</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className='navbar-right'>
                                <ul className='nav-icon inline-flex'>
                                    <li >
                                        <CiSearch onClick={handleShowResearch} />
                                        <div>
                                            <Modal className='result-research' show={showResearch} onHide={handleCloseResearch} animation={false} dialogClassName="slide-in-right">
                                                    <Modal.Header closeButton>
                                                        <input
                                                            id='search-products'
                                                            placeholder='Search for products'
                                                            value={searchQuery}
                                                            onChange={handleSearchChange}  // Handle input change
                                                        />
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="scrollable-list">
                                                        {filteredProducts.length > 0 ? (
                                                            <Row style={{padding:'20px 50px 0px 50px'}}>
                                                                {filteredProducts.map(product => (
                                                                    <Col sm={2}>
                                                                        <img id="product-search" onClick={()=> handleProductClick(product.maSP)} style={{width:'100%'}} src={product.anhDD} alt='err'/>
                                                                        <p style={{color:'#fff'}}>{product.tenSp}</p>
                                                                    </Col>
                                                                ))}
                                                            </Row>
                                                            
                                                        ) : (
                                                            <p>No products found.</p> 
                                                        )}
                                                        </div>
                                                    </Modal.Body>

                                                    <Modal.Footer>
                                                        <Button style={{ marginRight: '115px' }} variant="dark" onClick={handleCloseResearch}>
                                                            Close
                                                        </Button>
                                                    </Modal.Footer>
                                            </Modal>
                                        </div>
                                    </li>
                                    <div className='icon inline-flex '>
                                        <li>
                                            <CiUser onClick={handleShow} />
                                            <div className='accounts'>
                                            <Modal show={show} onHide={handleClose} animation={false} dialogClassName="slide-in-right">
                                                <Modal.Header closeButton>
                                                    <h6>{isLoggedIn ? 'Account Options' : 'Sign in'}</h6>
                                                </Modal.Header>
                                                <Modal.Body>
                                                        {isLoggedIn ? (
                                                            <div className='account-options'>
                                                                <ul>
                                                                    <li style={{ cursor: 'pointer' }} onClick={handleDashboard}>Trang tài khoản</li>
                                                                    <li style={{ cursor: 'pointer' }} onClick={handleAddWishList}>Đơn hàng yêu thích</li>
                                                                    <li style={{ cursor: 'pointer' }} onClick={handleCartshop}>Giỏ hàng của bạn</li>
                                                                    <li style={{ cursor: 'pointer' }} >Đơn hàng đã đặt</li>
                                                                    <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</li>
                                                                </ul>
                                                                <FaUser style={{ fontSize: '70px', marginLeft: '120px' }} />
                                                                <p style={{ fontSize: '12px', textAlign: 'center' }}>Not account yet?</p>
                                                                <p onClick={handleNavigateAuthPage} style={{ fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}>Create an Account</p>
                                                            </div>
                                                        ) : (
                                                        <Form onSubmit={handleLogin}>
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                <Form.Label>Tên tài khoản hoặc địa chỉ email</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Tên tài khoản"
                                                                    autoFocus
                                                                    value={username}
                                                                    onChange={(e) => setUsername(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                                                <Form.Label>Password</Form.Label>
                                                                <Form.Control
                                                                    type="password"
                                                                    value={password}
                                                                    onChange={(e) => setPassword(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                            <button id='login' type="submit">Log In</button>
                                                            <input type='checkbox' />
                                                            <span style={{ marginLeft: '20px', fontSize: '13px' }}>Remember me</span>
                                                            <p onClick={handleNavigate} style={{ fontSize: '13px', cursor: 'pointer' }}>Quên mật khẩu?</p>
                                                            <FaUser style={{ fontSize: '70px', marginLeft: '120px' }} />
                                                            <p style={{ fontSize: '12px', textAlign: 'center' }}>Not account yet?</p>
                                                            <p onClick={handleNavigateAuthPage} style={{ fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}>Create an Account</p>
                                                        </Form>
                                                    )}
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button style={{ marginRight: '115px' }} variant="dark" onClick={handleClose}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                            </div>
                                        </li>
                                        <li><IoIosSwap /></li>
                                        <li><CiHeart onClick={handleAddWishList} /></li>
                                    </div>
                                    <li>
                                        <CiShoppingCart onClick={handleShowCartShop} />
                                        <div>
                                            <Modal show={showCartShop} onHide={handleClose} animation={false} dialogClassName="slide-in-right">
                                                    <Modal.Header>
                                                        <h6>Shopping cart</h6>
                                                        <Button style={{ marginLeft: '150px' }} variant="dark" onClick={handleCloseCartShop}>
                                                            X
                                                        </Button>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                    <div  className="order" style={{ maxHeight: '300px', overflowY: 'auto' }} >
                                                            {cartItems.length === 0 ? (
                                                            <p>No items in the cart.</p>
                                                        ) : (
                                                            
                                                                <div>
                                                                    {cartItems.map((item, index) => (
                                                                        <div key={index} className='inline-flex'>
                                                                            <img
                                                                                    src={item.anhDD || 'placeholder-image-url.jpg'}
                                                                                    alt={item.tenSp || 'No Name'}
                                                                            />
                                                                            <div>
                                                                            <p style={{fontSize:'14px', fontWeight:'600'}}>{item.tenSp}</p>
                                                                            <p style={{fontSize:'13px'}}>{(item.giaTien * item.soLuong)?.toLocaleString() || '0'} Vn₫</p>
                                                                            <p style={{fontSize:'13px'}}>Số lượng: {item.soLuong || 0}</p>

                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                        )}
                                                    </div>
                                                    <h6>Subtotal:
                                                        <span style={{fontSize:'12px', }}> {cartItems.reduce((total, item) => total + (item.giaTien * item.soLuong), 0).toLocaleString()} Vn₫</span>   
                                                    </h6>
                                                    <br/>
                                                        <span style={{fontSize:'12px', }}>Miễn phí vận chuyển khi mua 2 sản phẩm!<br/>
                                                        (không áp dụng cho phụ kiện)</span>
                                                    <ProgressBar style={{height:'10px',marginTop:'20px'}} striped variant="dark" now={100} />
                                                    </Modal.Body>
                                                    <Modal.Footer style={{borderTop:'none'}}>
                                                        <Button style={{ marginRight: '115px' }} variant="dark" onClick={handleCartshop}>
                                                            View Cart
                                                        </Button>
                                                        <Button style={{ marginRight: '115px' }} variant="dark" onClick={handleCloseCartShop}>
                                                            Checkout
                                                        </Button>
                                                    </Modal.Footer>
                                            </Modal>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    export default Header;
