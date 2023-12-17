import axios from 'axios';
import { BASE_URL, VEHICLES_PATH } from '../environment';

export const getAllVehicles = () => axios.get(`${BASE_URL}${VEHICLES_PATH}/getall`);
export const getVehicleByplate = (plateVehicle) => axios.get(`${BASE_URL}${VEHICLES_PATH}/get/${plateVehicle}`);
export const updateVehicleByPlate = (plateVehicle, body) => axios.put(`${BASE_URL}${VEHICLES_PATH}/update/${plateVehicle}`, body, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
export const deleteVehicleByPlate = (plateVehicle) => axios.delete(`${BASE_URL}${VEHICLES_PATH}/delete/${plateVehicle}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
export const addVehicle = (body) => axios.post(`${BASE_URL}${VEHICLES_PATH}/save`, body, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
export const listVehiclesCategory = (title) => axios.get(`${BASE_URL}${VEHICLES_PATH}/category/${title}`);

