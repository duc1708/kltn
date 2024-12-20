import React from 'react';
import { Row , Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ products }) => {
    const navigate = useNavigate();

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
        alert('có click')
    };
    return (
        <div>
            {products.length > 0 ? (
                <Row style={{padding:'20px 50px 0px 50px'}}>
                    {products.map(product => (
                        <Col sm={2}>
                            <img onClick={()=> handleProductClick(product.maSP)} style={{width:'100%'}} src={product.anhDD} alt='err'/>
                            <p style={{color:'#fff'}}>{product.tenSp}</p>
                        </Col>
                    ))}
                </Row>
                
            ) : (
                <p>No products found.</p> 
            )}
        </div>
    );
};

export default SearchResults;
