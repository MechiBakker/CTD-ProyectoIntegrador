import React, { useState } from "react";
import "./createAcount.css";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/user.service";
import { SpinnerComponent } from "../../../shared/spinner/spinner";
import { ModalComponent } from "../../../shared/modal/modal";
import checkIcon from '../../../assets/check.png'


export const CreateAcount = () => {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingSppiner, setLoadingSpinner] = useState(false);
  const [sucessModal, setSucessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    documentId: "",
    phoneNumber: "",
    email: "",
    password: "",
    nameRole: "User",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handlerSubmit = (e) => {

    e.preventDefault();
    if (
      userForm.firstName === "" ||
      userForm.lastName === "" ||
      userForm.documentIs === "" ||
      userForm.phoneNumber === "" ||
      userForm.email === "" ||
      userForm.password === "" ||
      userForm.nameRole === ""
    ) {
      setErrorMessage("Todos los campos son requeridos y deben ser validos");
    } else if (userForm.password !== confirmPassword) {
      setErrorMessage("La contraseña no coincide");
    } else {
      setErrorMessage("");
      sendData();
    }
  };

  const sendData = () => {
    setLoadingSpinner(true);
    createUser(userForm)
      .then(({ data }) => {
        setSuccessMessage(data);
        setSucessModal(true);
      })
      .catch(({ data }) => {
        setErrorMessage(data?.description || data?.error);
      })
      .finally(() => {
        setLoadingSpinner(false);
      });
  };

  const gotoLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  }

  const closeSuccessModal = (e) => {
    e?.preventDefault();
    setSucessModal(false);
  }


  const handlerUserForm = (property, value) => {
    //nombre y apellido no caracteres especiales ni numeros y no vacios
    // email
    // la contrasenay y confirmacion coincida
    switch (property) {
      case "firstName":
        const isValidFirstName = (/^[a-zA-Z\s]+$/).test(value) && value.length > 0;
        isValidFirstName
          ? setUserForm({ ...userForm, [property]: value })
          : setErrorMessage("Por favor ingrese datos validos");
        break;
      case "lastName":
        const isValidLastNaem = /^[a-zA-Z\s]+$/.test(value) && value.length > 0;
        isValidLastNaem
          ? setUserForm({ ...userForm, [property]: value })
          : setErrorMessage("Por favor ingrese datos validos");
        break;
      case "documentId":
        const isValidDocumentId = /^[a-z0-9]+$/.test(value) && value.length > 0;
        isValidDocumentId
          ? setUserForm({ ...userForm, [property]: value })
          : setErrorMessage("Por favor ingrese datos validos");
        break;
      case "phoneNumber":
        const isValidPhoneNumber =
          /^[a-z0-9]+$/.test(value) && value.length > 0;
        isValidPhoneNumber
          ? setUserForm({ ...userForm, [property]: value })
          : setErrorMessage("Por favor ingrese datos validos");
        break;
      case "email":
        const isValidEmail =
        /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value) &&
          value.length > 0;
        isValidEmail
          ? setUserForm({ ...userForm, [property]: value })
          : setErrorMessage("Por favor ingrese datos validos");
        break;
      case "password":
        const isValidPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)
        isValidPassword
          ? setUserForm({ ...userForm, [property]: value })
          : setErrorMessage("Por favor ingrese datos validos");
        break;
      default:
        setConfirmPassword(value);
        const isValidConfirmPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)
        isValidConfirmPassword
          ? setUserForm({ ...userForm, ["password"]: value })
          : setErrorMessage("Por favor ingrese datos validos");
        break;
    }
  };

  return (
    <>
     { sucessModal && 
      <ModalComponent
        isOpened={ sucessModal }
        content={
          <div className="success-account-modal">
              <h3>{ successMessage }</h3>
               <img className="check-icon" src={checkIcon} alt="" />
              <section className="success-buttons">
                <button onClick={gotoLogin}>Ir a Iniciar sesión</button>
                <button className="okay-btn" onClick={closeSuccessModal}>Cerrar</button>
              </section>
          </div>
        }
        closeHandler={closeSuccessModal}
      /> }
      {loadingSppiner && <SpinnerComponent isOpened={loadingSppiner} />}
      <div className="containerGeneral">
        <h1>Crear Cuenta</h1>
        <form className="containerForm" onSubmit={handlerSubmit}>
          <p>{errorMessage}</p>
          <div className="containInput">
            <label className="labelForm">Nombre</label>
            <input
            className="input-create"
              onChange={(e) =>
                handlerUserForm("firstName", e.target.value)
              }
              type="text"
              placeholder="Nombre"
            />
          </div>
          <div className="containInput">
            <label className="labelForm">Apellido</label>
            <input
            className="input-create"
              onChange={(e) =>
                handlerUserForm("lastName", e.target.value)
              }
              type="text"
              placeholder="Apellido"
            />
          </div>
          <div className="containInput">
            <label className="labelForm">Documento de identificacion</label>
            <input
            className="input-create"
              onChange={(e) =>
                handlerUserForm("documentId", e.target.value)
              }
              type="text"
              placeholder="Documento de identificacion"
            />
          </div>
          <div className="containInput">
            <label className="labelForm">Numero de telefono</label>
            <input
            className="input-create"
              onChange={(e) =>
                handlerUserForm("phoneNumber", e.target.value)
              }
              type="text"
              placeholder="Numero de telefono"
            />
          </div>
          <div className="containInput">
            <label className="labelForm">Correo Electrónico</label>
            <input
            className="input-create"
              onChange={(e) =>
                handlerUserForm("email", e.target.value)
              }
              type="email"
              placeholder="usuario@#.com"
            />
          </div>
          <div className="containInput">
            <label className="labelForm">Contraseña</label>
            <input
            className="input-create"
              onChange={(e) =>
                handlerUserForm("password", e.target.value)
              }
              type="password"
            />
          </div>
          <div className="containInput">
            <label className="labelForm">Confirmación</label>
            <input
            className="input-create"
              onChange={(e) =>
                handlerUserForm("confirmPassword", e.target.value)
              }
              type="password"
            />
          </div>
          <div className="containerButton">
            <button type="submit" disabled={ errorMessage === '' }>Crear Cuenta</button>
          </div>
          <div>
            <p className="textLogin">
              ¿Ya tienes una cuenta?<a href="#">Iniciar sesión</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
