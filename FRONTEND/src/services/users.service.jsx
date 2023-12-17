import axios from 'axios';
import { BASE_URL, USERS_PATH } from '../environment';

export const getAllUsers = () => axios.get(`${BASE_URL}${USERS_PATH}/getAll`, {
  headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
export const getUserByEmail = (email) => axios.get(`${BASE_URL}${USERS_PATH}/email/${email}`)
export const getUserByRole = (name) => axios.get(`${BASE_URL}${USERS_PATH}/Role/${name}`);
export const updateUserByEmail = (email, body) => axios.put(`${BASE_URL}${USERS_PATH}/update/${email}`, body , {
  headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
export const deleteUserByEmail = (email) => axios.delete(`${BASE_URL}${USERS_PATH}/delete/${email}` , {
  headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
export const addUser = (body) => axios.post(`${BASE_URL}${USERS_PATH}/save`, body);
export const loginUser = (body) => axios.post(`${BASE_URL}${USERS_PATH}/login`, body);
