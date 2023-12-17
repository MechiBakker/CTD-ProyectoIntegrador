import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginUser, getUserByEmail} from "../../../services/user.service";
import { SpinnerComponent } from "../../../shared/spinner/spinner";
import { useContext } from "react";
import { SessionContext, actions } from "../../../contexts/session.context";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSppiner, setLoadingSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { dispatch } = useContext(SessionContext);

  const navigate = useNavigate();


  const handleUsernameChange = (e) => {
    /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)
      ? setEmail(e.target.value)
      : setErrorMessage("Por favor digite un correo valido");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);
    loginUser({
      password,
      email,
    })
      .then(({ data }) => {
        localStorage.setItem('token', data);
        return getUserByEmail(email);
      })
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({ type: actions.setLoggedUser, payload: data });
      })
      .catch(({ response }) => {
        setErrorMessage(response?.data?.description || response?.data?.error);
      })
      .finally(() => {
        setLoadingSpinner(false);
        const user = JSON.parse(localStorage.getItem('user'));
        if(user?.nameRole === 'ADMIN') {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      });
  };

  return (
    <>
      {loadingSppiner && <SpinnerComponent isOpened={loadingSppiner} />}
      <div className="containerGeneral">
        <h1>Iniciar sesion</h1>
        <form onSubmit={handleSubmit} className="containerForm">
          <div className="containInput">
            <label className="labelForm">Correo Electronico:</label>
            <input
            className="input-login"
              type="text"
              placeholder="Ingrese su correo electronico"
              onChange={handleUsernameChange}
            ></input>
          </div>
          <div className="containInput">
            <label className="labelForm">Contraseña:</label>
            <input
            className="input-login"
              type="password"
              placeholder="Ingrese su contraseña"
              onChange={handlePasswordChange}
            ></input>
          </div>
          <br />
          <button type="submit">Iniciar sesión</button>
        </form>
        {errorMessage && <p className="error-msg"> {errorMessage} </p>}
      </div>
    </>
  );
};

export default LoginForm;
