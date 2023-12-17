import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCar, FaCarSide, FaPalette, FaUsers, FaThLarge, FaGlassWhiskey, FaCheckSquare, FaSuitcaseRolling , FaCarAlt  } from 'react-icons/fa';
import './ProductDetails.css';
import { getVehicleByplate } from "../../services/vehicles.service";
import { calculateBooking, saveBooking } from "../../services/booking.service"
import { DatePicker, Space } from 'antd';
import { ModalComponent } from "../../shared/modal/modal";
import {getBookingDatesByPlate} from "../../services/booking.service";
import { SpinnerComponent } from "../../shared/spinner/spinner";

import moment from 'moment';

const { RangePicker } = DatePicker;


export const ProductDetails = () => {
  const navigate = useNavigate();
  const { plate } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [bookingInitialDate, setBookingInitialDate] = useState();
  const [bookingFinalDate, setBookingFinalDate] = useState();
  const [emailUser, setEmailUser] = useState();
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookingDatesbyPlate, setBookingDatesByPlate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [booking, setBooking] = useState({})
  const [showBookingModal ,setShowBookingModal] = useState(false);
  const [calendarValue ,setCalendarValue] = useState();
  const [calendarDates ,setCalendarDates] = useState();
  const [calendarError ,setCalendarError] = useState();
  
  
  useEffect(() => {
    getVehicleByplate(plate)
      .then(({data}) => {
        setProduct(data);
      })
      .catch(({ response }) => {
        setErrorMessage(response.data?.description || response.data?.error);
      });

    getBookingDatesByPlate(plate)
      .then(({data}) => {
        setBookingDatesByPlate([...new Set(data)]);
      })
      .catch(({ response }) => {
        setErrorMessage(response.data?.description || response.data?.error);
      });
  }, [plate]);

  if (!product) {
    return <p>Cargando...</p>; 
  }

  const image= product.imageUrl;

  const filterByDate = (dates, dateStrings) =>{
    setCalendarDates(dates);
    if(dateStrings) {
      setCalendarError('');
      setCalendarValue(dateStrings);
      setBookingInitialDate(dateStrings[0]);
      setBookingFinalDate(dateStrings[1]);
    } else {
      setCalendarError('error');
      setCalendarValue(dateStrings);
      setBookingInitialDate(null);
      setBookingFinalDate(null);
    }
  }

  
const handleBooking = (e) => {
  //validar que NO se puede reservar
    if (bookingInitialDate == undefined || bookingFinalDate == undefined) {

      alert('debe escoger primero la fecha de reserva');
      setCalendarError('error');
      return;
    }
    const plateVehicle = plate;
    
    e.preventDefault();
    
    const token = localStorage.getItem('token');

    if(token == undefined){

      navigate("/login");

      return;
    }
    
    calculateBooking({
      bookingInitialDate,
      bookingFinalDate,
      plateVehicle,
      emailUser: JSON.parse(localStorage.getItem('user'))?.email,
    })
      .then(({ data }) => {
        setShowConfirmationModal(true);
        setErrorMessage('');
        setBooking(data);
      })
      .catch(({ response }) => {
        setShowConfirmationModal(false);
        setErrorMessage(response?.data?.description || response?.data?.error);
      
      });
  }

  const handleBookingConfirm = (e) => {
    e.preventDefault()

    saveBooking(booking)

    .then(({ data }) => {
      setBooking(data);
      setShowConfirmationModal(false);
      setShowBookingModal(true);
    })
    .catch(({ response }) => {
     
      setErrorMessage(response?.data?.description || response?.data?.error);
     
    })

  }

  const handleBookingCancel = (e) => {

    e.preventDefault()

    setShowConfirmationModal(false)

  }

  const closeBookingModal = () => {
    setLoadingSpinner(true);
    getBookingDatesByPlate(plate)
      .then(({ data }) => {
        setBookingDatesByPlate([...new Set(data)]);
        setCalendarValue(null);
        setCalendarDates(null);
        setBookingInitialDate(null);
        setBookingFinalDate(null);
      })
      .catch(({ response }) => {
        setErrorMessage(response?.data?.description || response?.data?.error);
      })
      .finally(() => {
        setLoadingSpinner(false);
        setShowBookingModal(false);
      });
  };

  let nextDisabledTime;
  let previousDisabledTime;
  const disabledDate = (current) => {
    let isDisabled = false;

    const currentDate = moment(current.$d).format('YYYY-MM-DD');
    if(bookingInitialDate && currentDate >= bookingInitialDate && bookingDatesbyPlate.includes(currentDate) && !nextDisabledTime) {
        nextDisabledTime = current;
    }

    if(bookingFinalDate && currentDate <= bookingFinalDate && bookingDatesbyPlate.includes(currentDate)) {
      if(!previousDisabledTime || previousDisabledTime < current) {
        previousDisabledTime = current;
      }
    }

    if(current < moment() || bookingDatesbyPlate.includes(currentDate) || current > nextDisabledTime || current < previousDisabledTime) {
      isDisabled = true;
    }

    return isDisabled;
  };

  return (

    <div className="product-detail">
      { loadingSpinner && <SpinnerComponent isOpened={loadingSpinner} />}

      <div className="image-container-general">
        <div className='containProduct item1'>
          <img src={product.imageUrl} alt="Producto" className="imagen-producto" />
        </div>
        <div className='containProduct'>
          <img src={product.imageUrl} alt="Producto" className="imagen-producto" />
        </div>
        <div className='containProduct'>
          <img src={product.imageUrl} alt="Producto" className="imagen-producto" />
        </div>
        <div className='containProduct'>
          <img src={product.imageUrl} alt="Producto" className="imagen-producto" />
        </div>
        <div className='containProduct'>
          <img src={product.imageUrl} alt="Producto" className="imagen-producto" />
        </div>
      </div>
      <div className="details-container">
         <div className="product-model">
          

         <div className="tittle"><h1>{product.brand}</h1></div>
          <div className="price"><p>Precio por día: ${product.pricePerDay}</p></div> 
        </div>
        <div className='separation-line'></div>
        <div>
          <p>{product.description}</p>
        </div>
      </div>
      <div className="characteristics-container">
        <h1 className="title-characteristics">Detalles del vehículo</h1>
        <div className="cards-characteristics">
            <div className="characteristic">
              <div className='icon' ><FaCar/> </div>
              <p className="name-characteristic">{product.model}</p>
              <p className='description'>Año</p>

            </div>
            <div className="characteristic">
              <div className='icon' ><FaPalette/> </div>
              <p className="name-characteristic">{product.color}</p>
              <p className='description'>Color</p>
            </div>
            <div className="characteristic">
              <div className='icon' ><FaCheckSquare/> </div>
              <p className="name-characteristic">Si</p>
              <p className='description'>Automatico</p>
            </div>
            <div className="characteristic">
              <div className='icon' ><FaThLarge/> </div>
              <p className="name-characteristic">{product.nameCategory}</p>
              <p className='description'>Categoria</p>
            </div>
            <div className="characteristic">
              <div className='icon' ><FaGlassWhiskey/> </div>
              <p className="name-characteristic">{product.doorCount}</p>
              <p className='description'># Puertas</p>
            </div>
            <div className="characteristic">
              <div className='icon' ><FaUsers/> </div>
              <p className="name-characteristic">{product.passengerCapacity}</p>
              <p className='description'># Personas</p>
            </div>
            <div className="characteristic">
              <div className='icon' ><FaSuitcaseRolling/> </div>
              <p className="name-characteristic">{product.luggageCapacity}</p>
              <p className='description'># Maletas</p>
            </div>
            <div className="characteristic">  
              <div className='icon' ><FaCarAlt/> </div>
              <p className="name-characteristic">Si</p>
              <p className='description'>Disponible</p>
            </div>
        </div>
      </div>

      <div className='containeReserva'>
        <p className='titleReserva'>Fecha de reserva</p>
        <Space direction="horizontal" size={12}>
          <RangePicker
            format='YYYY-MM-DD'
            status={calendarError}
            placement='bottomLeft'
            onCalendarChange={filterByDate}
            onChange={(value) => {
              setCalendarValue(value);
              if(!value) {
                setBookingInitialDate(null);
                setBookingFinalDate(null);
              }
            }}
            disabledDate={disabledDate}
            value={calendarDates || calendarValue}
            onOpenChange={() => {
              if(!bookingInitialDate || !bookingFinalDate) {
                setBookingInitialDate(null);
                setBookingFinalDate(null);
              }
            }}
          />
        </Space>

        <button className='crear-reserva' type="button" onClick={handleBooking}> Guardar Reserva</button>
        <p>{errorMessage}</p>

        { showConfirmationModal && (<ModalComponent
            isOpened={showConfirmationModal}
            content={
              <div className="modalBooking">
                <p className="calculatedBooking">Estos son los datos de tu reseva</p>
                <div >Email: {booking.emailUser}</div>
                <div >Fecha de inicio: {booking.bookingInitialDate}</div>
                <div >Fecha de entrega: {booking.bookingFinalDate}</div>
                <div >Total valor a pagar: ${booking.bookingTotalValue}</div>
                <button className='bookingConfirm' type="button" onClick={handleBookingConfirm}>Confirmar reserva</button>
                <button className='bookingCancel' type="button" onClick={handleBookingCancel}>Cancelar reserva</button>
              </div>
              
            }
            closeHandler={() => {setShowConfirmationModal(false)}}
          />
        )}

        { showBookingModal && (<ModalComponent
            isOpened={showBookingModal}
            content={
              <div className="modalBooking">
                <p className="confirmationdBooking">TU RESERVA HA SIDO CONFIRMADA CON ÉXITO</p>
                <div className="bookingSave" >Numero de reserva: {booking.id}</div>
                <div className="bookingSave" >Email: {booking.emailUser}</div>
                <div className="bookingSave" >Fecha de inicio: {booking.bookingInitialDate}</div>
                <div className="bookingSave"  >Fecha de entrega: {booking.bookingFinalDate}</div>
                <div className="bookingSave" >valor de la reserva: ${booking.bookingTotalValue}</div>
              </div>
            }
            closeHandler={closeBookingModal}
          />
        )}

      </div>
    </div>
  );
};

export default ProductDetails;