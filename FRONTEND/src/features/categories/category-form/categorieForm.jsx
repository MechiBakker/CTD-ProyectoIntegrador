import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './categoryForm.css';
import { addCategory } from '../../../services/categories.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner';
import { ModalComponent } from '../../../shared/modal/modal';
import { BsEyeFill } from 'react-icons/bs';
import { ModalDialog } from 'react-bootstrap';


const AddCategory = () => {

  const navigate = useNavigate();

  const [categoryForm, setCategoryForm] = useState({
    
    title: '',
    description: '',
    imageUrl: '',
    
  });

  const [imageFile, setImageFile] = useState(null);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlerFillCategoryData = (e, property) => {
    const data = { ...categoryForm }

    switch (e.target.type) {
      case 'checkbox':
        data[property] = !data[property];
        break;

      default:
        data[property] = e.target.value;
        break;
    }
    setCategoryForm(data);
  }

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    const category = {
      ...categoryForm,
      imageUrl: new Date().getTime() + imageFile?.name?.trim()
    }

    const dataToSend = new FormData();
    dataToSend.append('categoryDto', JSON.stringify(category));
    dataToSend.append('imageFile', imageFile);

    setLoadingSpinner(true)

    addCategory(dataToSend)
      .then(() => {
        setLoadingSpinner(false);
        setSuccessMessage(true);
        setImageFile(null);
        setErrorMessage('');
        setCategoryForm({title: '', description: '', imageUrl: ''});

      })
      .catch((axiosResponse) => {
        setLoadingSpinner(false);
        setErrorMessage(axiosResponse.response.data?.description || axiosResponse.response.data?.error);
        setSuccessMessage(false);
      });
  };

  const openImgPreview = () => {
    setModalOpen(true)
  }

  const closeImgPreview = () => {
    setModalOpen(false)
  }


  return(


    <div>
      {loadingSpinner && <SpinnerComponent isOpened={loadingSpinner} />}
      {modalIsOpen && <ModalComponent isOpened={modalIsOpen}
        content={
          <img className='img-modal-preview' src={imageFile ? URL.createObjectURL(imageFile) : 'https://www.pulsorunner.com/wp-content/uploads/2014/10/default-img.gif'} />
        }
        closeHandler={closeImgPreview} />
      }
      <form className='formCategory' onSubmit={handleSubmit}>

        { errorMessage && <p className='error-msg'> { errorMessage } </p> }
        { successMessage && <p className='success-msg'> Categoría creada con éxito </p> }
      <h1 className='create-category'>Crear categoría</h1>

      <section className='add-category-img'>
          <img className='category-img' src={imageFile ? URL.createObjectURL(imageFile) : 'https://www.pulsorunner.com/wp-content/uploads/2014/10/default-img.gif'}
            onClick={openImgPreview} 
          />
        </section>

      <label className='label-input'> Nombre: </label>
      <input required 
        type="text" 
        name='title'
        placeholder="ingrese nombre de categoria"
        value={categoryForm.title}
        
        onChange={(event) => handlerFillCategoryData(event, 'title')}
                  
        />
      <label className='label-input'> Descripción: </label>
      <input
        type="text" 
        name='description'
        placeholder="ingrese descripción"
        value={categoryForm.description}
        
        onChange={(event) => handlerFillCategoryData(event, 'description')}
                  
        />

      <input required
        type="file"
        id="categoryImage"
        accept=".jpg, .png"
        onChange={(event) => handleProductImageChange(event, 'imgUrl')}
        className="input-data"

      />
       <button className='btn'>{!imageFile ? 'Cargar Imagen' : '¡ Imagen Cargada !'}</button>

       <BsEyeFill className='camera-icon' onClick={() => openImgPreview()} />
    
      <input 
      type="submit" 
      className='submit-category'
      /> 

      </form>
  </div>

  )


}


export default AddCategory;