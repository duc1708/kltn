import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoCheckmarkOutline } from 'react-icons/io5';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

function ShowProducts({ products }) {
    const navigate = useNavigate();
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleProductClick = (id, tenSP) => {
        navigate(`/product/${id}`);
    };

    const renderStatusButtons = status => {
        const buttons = [];
        if (status.includes('NEW')) {
            buttons.push(<button key="NEW" className='status' style={{ backgroundColor: '#438E44' }}>NEW</button>);
        }
        if (status.includes('HOT')) {
            buttons.push(<button key="HOT" className='status' style={{ backgroundColor: '#E22D2D' }}>HOT</button>);
        }
        return buttons;
    };

    return (
        <div>
            <Row>
                {currentProducts.map((product) => (
                    <Col sm={3} key={product.maSP}>
                        <div className='product'>
                            <div style={{ height: '75px' }}>
                                <button className='promotion'>{product.phanTram}%</button><br />
                                <div className='status-buttons'>
                                    {renderStatusButtons(product.trangThai)}
                                </div>
                            </div>
                            <img
                                src={hoveredProduct === product.maSP ? product.anhDD1 : product.anhDD}
                                alt={product.tenSp}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredProduct(product.maSP)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            />
                            <div className='infor-product'>
                                <p>{product.tenSp}</p>
                                <i>{product.thuongHieu}</i><br />
                                <div className='star'>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <FaStar
                                            key={index}
                                            color={index < product.sao ? '#ffc107' : '#e4e5e9'}
                                        />
                                    ))}
                                </div><br />
                                <IoCheckmarkOutline /><span>In stock</span>
                                <p>{product.giaBan.toLocaleString('vi-VN')} VND</p>
                            </div>
                            <button
                                style={{fontSize:'13px', fontWeight:'5000', padding: '2px 2px 2px 2px'}}
                                className='choose'
                                onClick={() => handleProductClick(product.maSP, product.tenSp)}
                            >
                                Lựa Chọn Các Tùy Chọn
                            </button>
                        </div>
                    </Col>
                ))}
            </Row>
            {products.length > productsPerPage && (
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                        <li key={index}>
                            <button style={{background:'#000',border:'none',color:'#fff',width:'30px',marginRight:'20px'}} onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ShowProducts;