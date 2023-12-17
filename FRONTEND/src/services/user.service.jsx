import axios from 'axios';
import { BASE_URL, USER_PATH } from '../environment';

export const createUser = (body) => axios.post(`${BASE_URL}${USER_PATH}/save`, body);
export const loginUser = (body) => axios.post(`${BASE_URL}${USER_PATH}/login`, body);
export const getUserByEmail = (userEmail) => axios.get(
    `${BASE_URL}${USER_PATH}/getEmail/${userEmail}`,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
);
export const activeUser = (path) => axios.get(`${BASE_URL}${path}`);
