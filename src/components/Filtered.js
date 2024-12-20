import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Avatar from '@mui/material/Avatar';

const Filtered = ({ onFilter }) => {
    const [value, setValue] = useState(2000000);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleFilter = () => {
        onFilter(value);
    };

    return (
        <div style={{ background: '#fff', padding: '20px' }}>
            <h4>Lọc sản phẩm</h4>
            <Slider
                size="small"
                value={value}
                min={200000}
                max={11000000}
                step={100000}
                onChange={handleChange}
                valueLabelDisplay="auto"
                style={{ color: '#000' }}
            />
            <button
                onClick={handleFilter}
                style={{
                    color: '#fff',
                    background: '#000',
                    border: 'none',
                    fontSize: '12px',
                    borderRadius: '5px',
                    height: '40px',
                    width: '80px'
                }}
            >
                Filter
            </button>
            {/* Color selection */}
            <h6 style={{ marginTop: '20px', marginBottom: '20px' }}>Màu sắc</h6>
            <div className='inline-flex'>
                <Avatar style={{ marginRight: '50px', marginBottom: '50px' }} sx={{ bgcolor: '#000' }}>
                    <p style={{ color: '#000' }}>.</p>
                </Avatar>
                <span>Black</span>
            </div><br/>
            <div className='inline-flex'>
                <Avatar style={{ marginRight: '50px', marginBottom: '50px' }} sx={{ bgcolor: '#af6348' }}>
                    <p style={{ color: '#af6348' }}>.</p>
                </Avatar>
                <span>Brown</span>
            </div><br/>
            <div className='inline-flex'>
                <Avatar style={{ marginRight: '50px', marginBottom: '50px' }} sx={{ bgcolor: '#f4eede' }}>
                    <p style={{ color: '#f4eede' }}>.</p>
                </Avatar>
                <span>Cream</span>
            </div>
        </div>
    );
};

export default Filtered;
