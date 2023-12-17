import { useEffect, useState } from 'react';
import {
  getAllVehicles,
  deleteVehicleByPlate,
} from '../../../services/vehicles.service';
import { VehicleCardComponent } from '../../vehicles/components/Card/VehicleCardComponent';
import './ManageProducts.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ModalComponent } from '../../../shared/modal/modal';
import removeIcon from '../../../assets/remove.png';
import { SpinnerComponent } from '../../../shared/spinner/spinner';



export const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [vechicleSelected, setVehicleSelected] = useState('');
  const [loadingSppiner, setLoadingSpinner] = useState(true);

  const navigate = useNavigate();

  const goAddVehicle = (e) => {
    e.preventDefault();
    navigate('/add-vehicle');
  };

  const goEditVehicle = (vehiclePlate) => {
    navigate('/edit-vehicle/' + vehiclePlate);
  };

  const deleteVehicle = () => {
    setConfirmModal(false);
    setLoadingSpinner(true);
    deleteVehicleByPlate(vechicleSelected)
      .then(({ data }) => {
        setSuccessMessage(data);
        setProducts(
          [...products].filter((vehicle) => vehicle.plate !== vechicleSelected)
        );
        setLoadingSpinner(false);
      })
      .catch(() => setLoadingSpinner(false));
  };

  const closeSuccessModal = () => {
    setSuccessMessage('');
  };

  const openConfirmModal = (plate) => {
    setVehicleSelected(plate);
    setConfirmModal(true);
  };

  useEffect(() => {
    getAllVehicles()
      .then(({ data }) => {
        setProducts(data);
        setLoadingSpinner(false);
      })
      .catch(() => setLoadingSpinner(false));
  }, []);

  return (
    <>
      {successMessage && (
        <ModalComponent
          isOpened={successMessage}
          content={
            <div className='success-vehicle-modal'>
              <h3>{successMessage}</h3>
              <img className='remove-icon' src={removeIcon}/>
              <section className='success-buttons'>
                <button className='okay-btn' onClick={closeSuccessModal}>
                  Okay
                </button>
              </section>
            </div>
          }
          closeHandler={closeSuccessModal}
        />
      )}
      {loadingSppiner && <SpinnerComponent isOpened={loadingSppiner} />}
      {confirmModal && (
        <ModalComponent
          isOpened={confirmModal}
          content={
            <div className='success-vehicle-modal'>
              <h3>{`Esta seguro de eliminar el vehiculo con placa: ${vechicleSelected}`}</h3>
              <img className='check-icon' src={removeIcon} alt='' />
              <section className='success-buttons'>
                <button onClick={deleteVehicle}>Eliminar</button>
                <button
                  className='okay-btn'
                  onClick={() => setConfirmModal(false)}
                >
                  Cerrar
                </button>
              </section>
            </div>
          }
          closeHandler={closeSuccessModal}
        />
      )}
      <section className='add-container'>
        <button className='add-btn' onClick={goAddVehicle}>
          Agregar producto
        </button>
      </section>

      <div className='admin-grid'>
        {products.map((vehicle) => (
          <div className='vehicle-card' key={uuidv4()}>
            <VehicleCardComponent {...vehicle} />
            <section className='options'>
              <button
                className='option-btn modify-btn'
                onClick={() => goEditVehicle(vehicle.plate)}
              >
                Modificar
              </button>
              <button
                className='option-btn delete-btn'
                onClick={() => openConfirmModal(vehicle.plate)}
              >
                Eliminar
              </button>
            </section>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageProducts;
