import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowProducts from '../components/ShowProducts';
import '../assets/styles/index.css';
import { CiSquareRemove } from "react-icons/ci";
import { AiTwotoneHeart } from "react-icons/ai";
import { Row, Col } from 'react-bootstrap';

const WishList = () => {
    const maKh = localStorage.getItem('maKh'); 
    const [productsWishList, setProductsWishList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWishList();
    }, []);

    const fetchWishList = () => {
        setIsLoading(true);
        axios
            .get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/wish-list`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                },
            })
            .then(response => {
                setProductsWishList(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching wishlist data:', error);
                setIsLoading(false);
            });
    };

    const handleRemove = (productId) => {
        if (window.confirm("Are you sure you want to remove this product from your wishlist?")) {
            axios
                .delete(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/wish-list/${productId}`)
                .then(() => {
                    setProductsWishList(productsWishList.filter(item => item.id !== productId));
                })
                .catch(error => {
                    console.error('Error removing product:', error);
                });
        }
    };

    const filteredItems = productsWishList.filter(item => item.maKh === parseInt(maKh));

    return (
        <div className='content'>
            <div className='wrapper'>
                <h5 style={{paddingTop:'50px'}}>YOUR PRODUCTS WISHLIST</h5>
                <hr />
                <div className='wrapper'>
                    {isLoading ? (
                        <p>Loading your wishlist...</p>
                    ) : filteredItems.length > 0 ? (
                        <div>
                            <Row>
                                {filteredItems.map(product => (
                                    <Col sm={3}>
                                    <div className="wishlist-item" key={product.id}>
                                        <div className="wishlist-item-remove" onClick={() => handleRemove(product.id)}>
                                            <CiSquareRemove />
                                            <span style={{ marginLeft: '5px' }}>Remove</span>
                                        </div>
                                        <div className="wishlist-item-product">
                                        </div>
                                    </div>
                                </Col>
                            ))} 
                            </Row>
                            <ShowProducts products={filteredItems} />
                        </div>
                    ) : (
                        <div>
                            <AiTwotoneHeart />
                            <h2>This wishlist is empty</h2>
                            <p>
                                You don't have any products in the wishlist yet.<br />
                                You will find a lot of interesting products on our "Shop" page.
                            </p>
                            <button onClick={() => window.location.href = '/shop'}>Return To Shop</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishList;
