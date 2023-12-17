import { BsEyeFill } from "react-icons/bs";


export const ProductForm = ({
  imageFile,
  handleSubmit,
  errorMessage,
  openImgPreview,
  productForm,
  handlerFillProductData,
  listCategories,
  handleProductImageChange,
  isEdit,
}) => {
  return (
    <div>
      <h1 className="title">
        {" "}
        {isEdit ? "Editar Producto" : "Agregar Producto"}{" "}
      </h1>
      <div className="add-vehicle-form">
        <section className="add-vehicle-img">
          <img
            className="vehicle-img"
            src={
              !isEdit
                ? imageFile
                  ? URL.createObjectURL(imageFile)
                  : "https://www.pulsorunner.com/wp-content/uploads/2014/10/default-img.gif"
                : (imageFile ?  URL.createObjectURL(imageFile) : productForm.imageUrl )
            }
            onClick={openImgPreview}
          />
        </section>
        <main className="vehicle-form-content">
          <form
            className="form"
            onSubmit={ handleSubmit }
          >
            {errorMessage && <p className="error-msg"> {errorMessage} </p>}
            <section className="inputs-vehicle-container">
              <div className="form-control-data">
                <label className="label-input"> Precio del auto</label>
                <span className="add-vehicle-input">
                  {" "}
                  {"$    "}
                  <input
                    type="number"
                    placeholder="Agregue el precio del producto"
                    value={productForm.pricePerDay || 0}
                    min={0}
                    onChange={(event) =>
                      handlerFillProductData(event, "pricePerDay")
                    }
                    //
                  />
                </span>
              </div>
              <div className="form-control-data">
                <label className="label-input"> Placa del auto</label>
                <input required
                  className="add-vehicle-input"
                  type="text"
                  placeholder="Agregue la placa del auto"
                  value={productForm.plate  || ''}
                  disabled={isEdit}
                  onChange={(event) => handlerFillProductData(event, "plate")}
                />
              </div>
            </section>
            <section className="inputs-vehicle-container">
              <div className="form-control-data">
                <label className="label-input"> Marca del auto</label>
                <input required
                  className="add-vehicle-input"
                  type="text"
                  placeholder="Agregue la marca del auto"
                  value={productForm.brand  || ''}
                  onChange={(event) => handlerFillProductData(event, "brand")}
                />
              </div>
              <div className="form-control-data">
                <label className="label-input"> Modelo del auto</label>
                <input required
                  className="add-vehicle-input"
                  type="text"
                  placeholder="Agregue el modelo del auto"
                  value={productForm.model  || ''}
                  onChange={(event) => handlerFillProductData(event, "model")}
                />
              </div>
            </section>
            <section className="inputs-vehicle-container">
              <div className="form-control-data">
                <label className="label-input"> Color del auto</label>
                <input required
                  className="add-vehicle-input"
                  type="text"
                  placeholder="Agregue el color del auto"
                  value={productForm.color  || ''}
                  onChange={(event) => handlerFillProductData(event, "color")}
                />
              </div>
              <div className="form-control-data">
                <label className="label-input"> Equipaje del auto</label>
                <span className="add-vehicle-input">
                  {" "}
                  {"#    "}
                  <input required
                    type="number"
                    placeholder="Agregue el equipaje del auto"
                    value={productForm.luggageCapacity  || 0}
                    min={0}
                    onChange={(event) =>
                      handlerFillProductData(event, "luggageCapacity")
                    }
                  />
                </span>
              </div>
            </section>
            <section className="inputs-vehicle-container">
              <div className="form-control-data">
                <label className="label-input"> Capacidad del auto</label>
                <span className="add-vehicle-input">
                  {" "}
                  {"#    "}
                  <input required
                    type="number"
                    placeholder="Agregue la capacidad de pasajeros"
                    value={productForm.passengerCapacity  || 0}
                    min={0}
                    onChange={(event) =>
                      handlerFillProductData(event, "passengerCapacity")
                    }
                  />
                </span>
              </div>
              <div className="form-control-data">
                <label className="label-input"> N° Puertas del auto</label>
                <span className="add-vehicle-input">
                  {" "}
                  {"#    "}
                  <input required
                    type="number"
                    placeholder="Agregue la cantidad de puertas del auto"
                    value={productForm.doorCount  || 0}
                    min={0}
                    onChange={(event) =>
                      handlerFillProductData(event, "doorCount")
                    }
                  />
                </span>
              </div>
            </section>
            <section className="inputs-vehicle-container">
              <div className="form-control-data">
                <label className="label-input"> Imagen del auto</label>
                <div className="img-preview">
                  <div className="upload-btn-wrapper">
                    <input required
                      type="file"
                      id="productImage"
                      accept=".jpg, .png"
                      onChange={handleProductImageChange}
                      className="input-data"
                    />
                    <button className="btn">
                      {!imageFile ? "Cargar Imagen" : "¡ Imagen Cargada !"}
                    </button>
                  </div>
                  <BsEyeFill
                    className="camera-icon"
                    onClick={() => openImgPreview()}
                  />
                </div>
              </div>
              <div className="form-control-data">
                <label className="label-input"> Categoria del auto</label>
                <select
                  name="categories"
                  className="select-category"
                  value={productForm.nameCategory  || ''}
                  onChange={(event) =>
                    handlerFillProductData(event, "nameCategory")
                  }
                >
                  {listCategories.length === 0 ? (
                    <option
                      className="select-option"
                      value=""
                      disabled={true}
                    >
                      No hay categorías disponibles
                    </option>
                  ) : (
                    <option
                      className="select-option"
                      value=""
                      disabled={true}
                    >
                      Seleccione una categoría...
                    </option>
                  )}

                  <option className="select-option" value="Agregar Categoria">
                    Agregar categoría
                  </option>

                  {listCategories.map(({ title }) => (
                    <option className="select-option" value={title} key={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </section>
            <section className="inputs-vehicle-container">
              <div className="form-control-data">
                <label className="label-input"> Transmision del auto</label>
                <div className="available-container">
                  <p> ¿ Tiene transmision automatica ?</p>
                  <input
                    className="available-checkbox"
                    type="checkbox"
                    placeholder="disponible"
                    name="automaticTransmission"
                    value={productForm.automaticTransmission  || false}
                    checked={productForm.automaticTransmission}
                    onChange={(event) =>
                      handlerFillProductData(event, "automaticTransmission")
                    }
                  />
                </div>
              </div>
              <div className="form-control-data">
                <label className="label-input"> Disponibilidad del auto</label>
                <div className="available-container">
                  <p> ¿ Esta disponible ?</p>
                  <input 
                    className="available-checkbox"
                    type="checkbox"
                    placeholder="disponible"
                    name="available"
                    value={productForm.available || false}
                    checked={productForm.available}
                    onChange={(event) =>
                      handlerFillProductData(event, "available")
                    }
                  />
                </div>
              </div>
            </section>

            <textarea
              className="description-textarea"
              id="productDescription"
              placeholder="Agregue la descripcion del auto"
              value={productForm.description}
              onChange={(event) => handlerFillProductData(event, "description")}
            ></textarea>

            <input required type="submit" className="submit-vehicle" />
          </form>
        </main>
      </div>
    </div>
  );
};
