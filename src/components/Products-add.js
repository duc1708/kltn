import React , {useEffect} from 'react';
import axios from 'axios';
const ProductsAdd = () => {
    useEffect(()=>{
        const form = document.getElementById("form-add");
        const productImages = document.getElementById("product-images");

        form.addEventListener("submit", function(e){
            e.preventDefault();
            uploadFiles(productImages.files);
        })
    },[])

    const uploadFiles = (files) =>{
        const CLOUD_NAME = 'deuqzffc4';
        const PRESET_NAME = 'marshall-upload';
        const FOLDER_NAME = 'MARSHALL';
        // const urls = [];
        const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append("upload_preset", PRESET_NAME);
        formData.append("folder", FOLDER_NAME);
        for(const file of files){
            formData.append("file", file);
            axios.post(api, formData,{
                headers:{
                    "Content-Type": "multipart/form-data",
                },
            }).then(respone => console.log(respone));
        }
    }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Upload Sản Phẩm</h2>
      <form  action='' id="form-add" >
        <div style={{ marginBottom: "15px" }}>
          <label>Ảnh:</label>
          <input
            id='product-images'
            multiple
            type="file"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Tải Lên
        </button>
      </form>
    </div>
  );
};

export default ProductsAdd;