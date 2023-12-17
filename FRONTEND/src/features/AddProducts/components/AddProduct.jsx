import React, { useEffect, useState } from "react";
import { addVehicle, getVehicleByplate, updateVehicleByPlate } from "../../../services/vehicles.service";
import "./AddProduct.css";
import { SpinnerComponent } from "../../../shared/spinner/spinner";
import { ModalComponent } from "../../../shared/modal/modal";
import { getAllCategories } from "../../../services/categories.service";
import { ProductForm } from "./FormComponent.jsx/ProductoForm";
import AddCategory from '../../categories/category-form/categorieForm';
import checkIcon from '../../../assets/check.png'
import { useNavigate } from "react-router-dom";


const AddProduct = ({ isEdit, plate }) => {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [modalImageIsOpen, setModalImageIsOpen] = useState(false);
  const [modalAddCategory, setModalAddCategory] = useState(false);
  const [sucessModal, setSucessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingSppiner, setLoadingSpinner] = useState(true);
  const [listCategories, setListCategories] = useState([]);
  const [productForm, setProductForm] = useState({
    plate: "",
    brand: "",
    model: "",
    color: "",
    imageUrl: "",
    available: true,
    passengerCapacity: null,
    doorCount: null,
    luggageCapacity: null,
    automaticTransmission: false,
    pricePerDay: null,
    nameCategory: "",
    description: "",
  });

  useEffect(() => {
    
    if(isEdit) getVehicleByplate(plate).then(({ data }) => setProductForm(data));
    
    getAllCategories().then(({ data }) => {
          setListCategories(data);
          setLoadingSpinner(false);
        }
      );


  }, []);

  const handlerFillProductData = (e, property) => {
    const data = { ...productForm };

    switch (e.target.type) {
      case "checkbox":
        data[property] = !data[property];
        break;

      case "number":
        const value = e.target.valueAsNumber > 0 ? e.target.valueAsNumber : 0;
        data[property] = value;
        break;

      case 'select-one':
        if(e.target.value === 'Agregar Categoria') {
        setModalAddCategory(true);
          e.target.value = '';
          return;
        }

        data[property] = e.target.value;
        break;

      default:
        data[property] = e.target.value;
        break;
    }
    setProductForm(data);
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicle = {
      ...productForm,
      imageUrl: new Date().getTime() + imageFile?.name?.trim(),
    };

    const dataToSend = new FormData();
    dataToSend.append("vehicleDto", JSON.stringify(vehicle));
    dataToSend.append("imageFile", imageFile);

    setLoadingSpinner(true);

     (isEdit ? updateVehicleByPlate(productForm.plate, dataToSend) : addVehicle(dataToSend))
      .then(({ data }) => {
        setLoadingSpinner(false);
        setSuccessMessage(data);
        setSucessModal(true)
      })
      .catch(({ response }) => {
        setLoadingSpinner(false);
        setErrorMessage(response.data?.description || response.data?.error);
      });
  };


  const openImgPreview = () => {
    setModalImageIsOpen(true);
  };

  const closeImgPreview = () => {
    setModalImageIsOpen(false);
  }

  const closeSuccessModal = () => {
    setSucessModal(false);
  }

  const goToMainPage = () => {
    navigate('/admin');
  }

  const closeModalAddCategory = () => {
    setLoadingSpinner(true);
    getAllCategories()
      .then(({ data }) => {
        setListCategories(data);
        setLoadingSpinner(false);
        setModalAddCategory(false);
      });
  }

  return (
    <>
      { sucessModal && 
      <ModalComponent 
        isOpened={ sucessModal }
        content={
          <div className="success-vehicle-modal">
              <h3>{ successMessage }</h3>
               <img className="check-icon" src={checkIcon} alt="" />
              <section className="success-buttons">
                <button onClick={goToMainPage}>Ir a ver todos</button>
                <button className="okay-btn" onClick={closeSuccessModal}>Okay</button>
              </section>
          </div>
        }
        closeHandler={closeSuccessModal}
      /> }
      { loadingSppiner && <SpinnerComponent isOpened={loadingSppiner} />}
      { modalImageIsOpen && (
        <ModalComponent
          isOpened={modalImageIsOpen}
          content={
            <img
              className="img-modal-preview"
              src={
                !isEdit
                  ? imageFile
                    ? URL.createObjectURL(imageFile)
                    : "https://www.pulsorunner.com/wp-content/uploads/2014/10/default-img.gif"
                  : (imageFile ?  URL.createObjectURL(imageFile) : productForm.imageUrl )
              }
            />
          }
          closeHandler={closeImgPreview}
        />
      )}

      {modalAddCategory && <ModalComponent isOpened={modalAddCategory}
        content={
          <AddCategory />
        }
        closeHandler={closeModalAddCategory} />
      }

      <ProductForm
        imageFile={imageFile}
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
        openImgPreview={openImgPreview}
        productForm={productForm}
        handlerFillProductData={handlerFillProductData}
        handleProductImageChange={handleProductImageChange}
        listCategories={listCategories}
        isEdit={isEdit}
      />
    </>
  );
};
export default AddProduct;
