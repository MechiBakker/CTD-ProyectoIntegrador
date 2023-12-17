import logoDark from "../../assets/logo-dark.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { SessionContext, actions } from "../../contexts/session.context";

import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useState, useEffect} from "react";

export const HeaderComponent = (props) => {
  const { loggedUser, dispatch } = useContext(SessionContext);
  const navigate = useNavigate();
  const [showButtonAdmin, setShowButtonAdmin] = useState(false);
  const [showButtonMyBookings, setShowButtonMyBookings] = useState(true);
 

  const handlerRedirect = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  const closeSession = (e) => {
    e.preventDefault();
    localStorage.clear();
    dispatch({ type: actions.clear })
    navigate('/login')
  };

 
  useEffect(() => {
      const user =  localStorage.getItem('user');
      if (user)  dispatch({ type: actions.setLoggedUser, payload: JSON.parse(user) });
  }, []);


  return (
    <SessionContext.Consumer>
      {({ session }) => (
        <div className="header-container">
          <div
            className="logo-container"
            onClick={(event$) => handlerRedirect(event$, "/home")}
          >
            <img className="logo-app" src={logoDark} />
          </div>
          
             
          <GiHamburgerMenu className="burger-icon" />
          {session?.loggedUser?.email ? (

            
            <div className="session-container">
              
              {session?.loggedUser.nameRole == 'ADMIN' && <Link to="/admin"> <button className="admin-boton">Admin</button> </Link>}
             {session?.loggedUser.nameRole == 'User' && <Link to="/my-bookings"> <button className="bookings-boton">Mis Reservas</button></Link>} 
         
              <Link to="/profile">
                <span className="avatar">
                  {session.loggedUser.firstName.slice(0, 1) +
                    session.loggedUser.lastName.slice(0, 1)}
                </span>
              </Link>

               <span
                className="close-session-text"
                onClick={closeSession}
              >
                Cerrar Sesión
              </span>
             
            </div>
          ) : (
            <div className="button-options">
              <button
                className="button"
                onClick={($event) => {
                  handlerRedirect($event, "/login");
                }}
              >
                Iniciar Sesión
              </button>
              <button
                className="button"
                onClick={($event) => {
                  handlerRedirect($event, "/create-account");
                }}
              >
                Crear Cuenta
              </button>
            </div>
          )}
        </div>
      )}
    </SessionContext.Consumer>
  );
};
