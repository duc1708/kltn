import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/cartshop.css';
import { ProgressBar } from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import { VscClose } from "react-icons/vsc";

export default function CartShop() {

    const [cartItems, setCartItems] = useState([]);
    const maKh = localStorage.getItem('maKh');
    const navigate =useNavigate('');
    // Fetch data from API
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}products/cart-shop`)
            .then(response => {
                setCartItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching cart data:', error);
            });
    }, []);

    const filteredItems = cartItems.filter(item => item.maKh === parseInt(maKh));
    const total = filteredItems.reduce((subtotal, item) => subtotal + (item.giaTien * item.soLuong), 0);

    // Handle quantity change
    const handleQuantityChange = async (productId, change) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === productId) {
                const newQuantity = item.soLuong + change;
                return { ...item, soLuong: newQuantity > 0 ? newQuantity : 1 }; // Ensure minimum quantity is 1
            }
            return item;
        });

        setCartItems(updatedItems);

        // Optional: Update the quantity in the backend
        try {
            await axios.put(`${process.env.REACT_APP_API_URL_MARSHALL}products/cart-shop/${productId}`, {
                soLuong: updatedItems.find(item => item.id === productId).soLuong
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleChoosePayment = () => {
        navigate("/payment"); 
    }

    const handleRemoveItem = async (productId) => {
        try {
            // Xóa sản phẩm khỏi backend
            await axios.delete(`${process.env.REACT_APP_API_URL_MARSHALL}/cart-shop/${productId}`);
    
            // Xóa sản phẩm khỏi state
            const updatedItems = cartItems.filter(item => item.id !== productId);
            setCartItems(updatedItems);
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Có lỗi xảy ra khi xóa sản phẩm.');
        }
    };

    
  return (
    <div className='cart content'>
        <div className='wrapper'>
                <div>
                    <Row>
                        <Col sm={8}>
                            {filteredItems.length === 0 ? (
                            <p>No items in the cart.</p>
                            ) : (   
                            <div>
                                <div>
                                    <p>Miễn phí vận chuyển khi mua 2 sản phẩm! (không áp dụng cho phụ kiện)</p>
                                    <ProgressBar style={{height:'7px',marginTop:'20px'}} striped variant="dark" now={100} />
                                </div>
                                <div style={{marginLeft: '114px', marginTop:'20px'}} className='inline-flex'>
                                    <h6 style={{width: '200px'}}>PRODUCT</h6>
                                    <h6 style={{width: '200px'}}>PRICE</h6>
                                    <h6 style={{width: '200px'}}>QUANTITY</h6>
                                    <h6 style={{width: '200px'}}>SUBTOTAL</h6>
                                </div>
                                {filteredItems.map((item, index) => (
                                    <div>
                                        <div class='infor-cart inline-flex'>
                                        <VscClose
                                            style={{ marginTop: '30px', cursor: 'pointer' }}
                                            onClick={() => handleRemoveItem(item.id)}
                                        />
                                            <img
                                                src={item.anhDD || 'placeholder-image-url.jpg'}
                                                alt={item.tenSp || 'No Name'}
                                                style={{ width: '80px', height: 'auto' }}
                                            />
                                            <h6 style={{width: '200px', marginTop: '30px'}}>{item.tenSp}</h6>
                                            <p style={{fontSize:'13px', width: '200px', marginTop: '30px'}}>{item.giaTien?.toLocaleString() || '0'} ₫</p>
                                            <div style={{width: '200px', marginTop: '30px'}} className=' quantity inline-flex' >
                                                <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                                <span>{item.soLuong || 0}</span>
                                                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                            </div>
                                            <p style={{fontSize:'13px',width: '200px', marginTop: '30px'}}>{(item.giaTien * item.soLuong)?.toLocaleString() || '0'} ₫</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )}
                        </Col>
                        <Col sm={4}>
                            <div className='cart-total'>
                                <h3 style={{marginBottom:'50px'}}>Cart Totals</h3>
                                <div className='inline-flex'>
                                    <h6>Subtotal</h6>
                                    <p style={{marginLeft:'200px'}}>{total.toLocaleString()} ₫</p>
                                </div>
                                <hr/>
                                <div  className='inline-flex'>
                                    <h6 style={{position:'relative', top:'10px'}}>Shipping</h6>
                                    <p style={{marginLeft:'70px' }}>Shipping options will be updated<br/> during checkout.</p>
                                </div>
                                <hr/>
                                <div className='inline-flex'>
                                    <h5>Toltal</h5>
                                    <h6 style={{marginLeft:'215px' }}>{total.toLocaleString()} ₫</h6>
                                </div>
                                <button className='checkout' onClick={handleChoosePayment}>Proceed To Checkout</button>
                            </div>
                        </Col>
                    </Row>
                </div>
        </div>
    </div>
  );
}