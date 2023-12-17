import axios from "axios";
import { BASE_URL, CATEGORIES_PATH } from '../environment';

export const getAllCategories = () => axios.get(`${BASE_URL}${CATEGORIES_PATH}/getAll`);
export const addCategory = (body) => {
    return axios.post(
        `${BASE_URL}${CATEGORIES_PATH}/create`,
        body,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
}