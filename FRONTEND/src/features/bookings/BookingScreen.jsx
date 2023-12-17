import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getBookingsForEmail } from "../../services/booking.service";
import { setHours } from "date-fns";
import { Link } from "react-router-dom";
import moment from 'moment';
import './BookingScreen.css';

export const GetAllBookingsForEmail = () => {

    const navigate = useNavigate();
    const [bookingsForEmail, setBookingsForEmail] = useState([]);    

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if(!user) {
            navigate('/login');
            return;
        }

        getBookingsForEmail(user.email)
        .then(({data}) => {
            
            setBookingsForEmail(data);
        })
        .catch((error) => {
            console.log('error', error);
        });
        
    }, []);

   

    return(
        <div className="containeGeneralReser">
            {   bookingsForEmail.length === 0 ? 
                (<div>No se encontraron reservas</div>) : 
                (bookingsForEmail.map(booking => (
                    <div className="containForReser" key={booking.id}>
                        <div>Numero de reserva:{booking.id}</div>
                        <div>Vehiculo:<Link to={`/product-details/${booking.plateVehicle}`}>{booking.plateVehicle}</Link></div>
                        <div>Fecha de inicio: {booking.bookingInitialDate}</div>
                        <div>Fecha de entrega: {booking.bookingFinalDate}</div>
                        <div>Valor de la reserva: {booking.bookingTotalValue}</div>
                        <br/>
                    </div>
                )))
            }
        </div>
    );
}