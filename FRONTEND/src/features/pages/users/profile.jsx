import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import './profile.css';
import avatar from '../../../assets/avatar.png';
import { getUserByEmail } from "../../../services/users.service"

export const Profile = () => {
    const navigate = useNavigate();
    const { email } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    return (
        <div className="profile">
        {user && (
            <div className="card">
                <div>
                <h2>Que tal, {user.firstName}!</h2>
                </div>
                <div>
                    <img src={avatar} alt="Avatar" className="avatar-profile" />
                </div>
                <div className="info">
                    <p>{user.email}</p>
                </div>
                <div className="info">
                    <h3>Verifica tus datos:</h3>
                    <p>Documento: {user.documentId}</p>
                    <p>Telefono: {user.phoneNumber}</p>
                    <p>Rol: {user.nameRole}</p>
                </div>
            </div>
        )}
        </div>
    );
}

export default Profile;
