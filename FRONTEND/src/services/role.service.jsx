import axios from 'axios';
import { BASE_URL, ROLES_PATH } from '../environment';

export const updateRoleByName = (name, body) => axios.put(`${BASE_URL}${ROLES_PATH}/update/${name}`, body);
export const saveRole = (body) => axios.post(`${BASE_URL}${ROLES_PATH}/save`, body);
export const getAllRoles = () => axios.get(`${BASE_URL}${ROLES_PATH}/getAll`, {
  headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
export const getRoleByName = (name) => axios.get(`${BASE_URL}${ROLES_PATH}/get/${name}`);
export const deleteRoleByName = (name) => axios.delete(`${BASE_URL}${ROLES_PATH}/delete/${name}`);
