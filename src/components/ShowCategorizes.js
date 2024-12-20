import React from 'react';
import '../assets/styles/index.css';
function ShowCategorizes ({categorizes}){
    return (
        <div className='list-categorize inline-flex'>
            {categorizes.map((categorize)=>(
                    <div className='categorize'>
                        <img src={categorize.img} alt=''/>
                        <h6>{categorize.tenLoai}</h6>
                        <p>{categorize.soLuong} products</p>
                    </div>
            ))}
        </div>
    );
};

export default ShowCategorizes;