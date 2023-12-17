import axios from 'axios';
import { BASE_URL, BOOKINGS_PATH } from '../environment';

export const saveBooking = (body) => axios.post(`${BASE_URL}${BOOKINGS_PATH}/`, body,   {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const calculateBooking = (body) => axios.post(`${BASE_URL}${BOOKINGS_PATH}/calculate`, body, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});


export const getAllBookings = () => axios.get(`${BASE_URL}${BOOKINGS_PATH}`);


export const getBookingDatesByPlate = (plate) => axios.get(`${BASE_URL}${BOOKINGS_PATH}/vehicle/dates/${plate}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getBookingsForEmail = (email) => axios.get(`${BASE_URL}${BOOKINGS_PATH}/user/${email}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});