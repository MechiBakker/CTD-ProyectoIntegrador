import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './admin.css';
import { useEffect, useContext } from 'react';
import { SessionContext, actions } from '../../../contexts/session.context';


export const AdminComponent = () => {
  const navigate = useNavigate();

  const { dispatch } = useContext(SessionContext);

  useEffect(() => {
  }, []);

  return (
    <div className="contain">
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/admin/manage-products" className="sidebar-link">Gestionar vehículos</Link>
          </li>
          <li>
            <Link to="/admin/manage-categories" className="sidebar-link">Gestionar categorías</Link>
          </li>
          <li>
            <Link to="/admin/manage-users" className="sidebar-link">Gestionar usuarios</Link>
          </li>
          <li>
          <Link to="/my-bookings" className="sidebar-link">Gestionar reservas</Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <div className="card">
          <Link to="/admin/manage-products">
            <div className="image">
              <img src="/product.jpg" alt="Producto" />
            </div>
          </Link>
          <h3>Gestionar vehículos</h3>
        </div>
        <div className="card">
          <Link to="/admin/manage-categories">
            <div className="image">
              <img src="/category.jpg" alt="category" />
            </div>
          </Link>
          <h3>Gestionar categorías</h3>
        </div>
        
        <div className="card">
          <Link to="/admin/manage-users">
            <div className="image">
              <img src="/role.jpg" alt="role" />
            </div>
          </Link>
          <h3>Gestionar usuarios</h3>
        </div>
        <div className="card">
          <Link to="/my-bookings">
          <div className="image">
            <img src="/calendar.jpg" alt="calendar" />
          </div>
          </Link>
          
          <h3>Gestionar reservas</h3>
        </div>
      </div>

    </div>
  );
};

export default AdminComponent;