import { useEffect, useState } from "react";
import "./CreateUser.css";
import { createUser } from "../../../../services/user.service";
import { SpinnerComponent } from "../../../../shared/spinner/spinner";
import { ModalComponent } from "../../../../shared/modal/modal";
import checkIcon from "../../../../assets/check.png";
import { getAllRoles } from "../../../../services/role.service";
import { updateUserByEmail } from "../../../../services/users.service";

export const CreateUserComponent = ({ title, isEdit, selectedUser }) => {
  const [loading, setLoading] = useState(false);
  const [sucessModal, setSucessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [roles, setRoles] = useState([]);
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

  useEffect(() => {
    if(isEdit) setUserForm({...selectedUser})
    getAllRoles().then(({ data }) => {
      setRoles(data);
    });
  }, []);


  const handlerCreateUser = (e) => {
    e.preventDefault();
    setLoading(true);
    const request = !isEdit ? createUser(userForm): updateUserByEmail(userForm.email, userForm);
    request
      .then(({ data }) => {
        setSuccessMessage(data);
        setSucessModal(true);
      })
      .catch(({ data }) => {
        setErrorMessage(data?.description || data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const closeSuccessModal = (e) => {
    e.preventDefault();
    setSucessModal(false);
  };

  const handleChangeRole = (e) => {
    e.preventDefault();
    setUserForm({ ...userForm, nameRole: e.target.value });
  };

  const handlerUserForm = (property, value) => {
    setUserForm({ ...userForm, [property]: value })
  };

  return (
    <>
      {sucessModal && (
        <ModalComponent
          isOpened={sucessModal}
          content={
            <div className="success-account-modal">
              <h3>{successMessage}</h3>
              <img className="check-icon" src={checkIcon} alt="" />
              <section className="success-buttons">
                <button className="okay-btn" onClick={closeSuccessModal}>
                  Cerrar
                </button>
              </section>
            </div>
          }
          closeHandler={closeSuccessModal}
        />
      )}
      {loading && <SpinnerComponent isOpened={loading} />}
      <h3 className="create-user-title">{ title }</h3>
      <form className="create-user-container">
        <div className="containInput">
          <label className="labelForm">Nombre</label>
          <input
            value={userForm.firstName}
            className="input-create"
            onChange={(e) => handlerUserForm("firstName", e.target.value)}
            type="text"
            placeholder="Nombre"
          />
        </div>
        <div className="containInput">
          <label className="labelForm">Apellido</label>
          <input
            value={userForm.lastName}
            className="input-create"
            onChange={(e) => handlerUserForm("lastName", e.target.value)}
            type="text"
            placeholder="Apellido"
          />
        </div>
        <div className="containInput">
          <label className="labelForm">Documento de identificacion</label>
          <input
            value={userForm.documentId}
            className="input-create"
            onChange={(e) => handlerUserForm("documentId", e.target.value)}
            type="text"
            placeholder="Documento de identificacion"
          />
        </div>
        <div className="containInput">
          <label className="labelForm">Numero de telefono</label>
          <input
            value={userForm.phoneNumber}
            className="input-create"
            onChange={(e) => handlerUserForm("phoneNumber", e.target.value)}
            type="text"
            placeholder="Numero de telefono"
          />
        </div>
        <div className="containInput">
          <label className="labelForm">Correo Electrónico</label>
          <input
            value={userForm.email}
            disabled={isEdit}
            className="input-create"
            onChange={(e) => handlerUserForm("email", e.target.value)}
            type="email"
            placeholder="usuario@#.com"
          />
        </div>
        <div className="containInput">
          <label className="labelForm">Contraseña</label>
          <input
            value={userForm.password}
            className="input-create"
            onChange={(e) => handlerUserForm("password", e.target.value)}
            type="password"
          />
        </div>
        <div className="containInput">
          <label className="labelForm">Selecciona el rol</label>
          <select
            onChange={handleChangeRole}
            className="create-user-select-role"
            value={userForm.nameRole}
          >
            {roles.map((role) => (
              <option className="create-user-select-option" key={role.name} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="user-create-actions">
          <button onClick={handlerCreateUser}>{ isEdit ? 'Actualizar': 'Crear'  }</button>
        </div>
      </form>
    </>
  );
};
