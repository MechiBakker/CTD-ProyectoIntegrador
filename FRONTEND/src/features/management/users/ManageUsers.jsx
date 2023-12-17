import { useEffect, useState } from "react";
import { deleteUserByEmail, getAllUsers } from "../../../services/users.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getAllRoles } from "../../../services/role.service";
import { Radio } from "@mui/material";
import { FaUserPlus } from 'react-icons/fa';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import removeIcon from '../../../assets/remove.png';
import checkIcon from "../../../assets/check.png";

import "./ManageUsers.css";
import { ModalComponent } from "../../../shared/modal/modal";
import { CreateUserComponent } from "./components/CreateUser";
import { SpinnerComponent } from "../../../shared/spinner/spinner";

export const ManageUsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalCreateUser, setModalCreateUser] = useState(false);
  const [title, setTitle] = useState('Crear Usuario');
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [sucessModal, setSucessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getAllUsers().then(({ data }) => setUsers(data));
    getAllRoles().then(({ data }) => setRoles(data));
  }, []);

  const handlerCreateUser = (event) => {
    event.preventDefault();
    setTitle('Crear Usuario')
    setModalCreateUser(true);
    setIsEdit(false);
  };

  const handlerEditUser = (event) => {
    event.preventDefault();
    setTitle('Actualizar Usuario')
    setModalCreateUser(true);
    setIsEdit(true);
  }

  const handlerCloseCreateUser = () => {
    setModalCreateUser(false)
    getAllUsers().then(({ data }) => setUsers(data));
  }

  const handlerSelectUser = (user) => {
    setSelectedUser(user);
  }

  const handlerDeleteUser = (event) => {
    event.preventDefault();
    setConfirmModal(true);
  }

  const deleteUser = (event) => {
    setLoading(true);
    setConfirmModal(false);
    event.preventDefault();
    deleteUserByEmail(selectedUser?.email)
    .then(({ data }) => {
      setSelectedUser(null);
      setSuccessMessage(data)
      setSucessModal(true);
      getAllUsers().then(({ data }) => setUsers(data));
    })
    .finally(() => {
      setLoading(false);
    });

  }

  const closeConfirmModal = () => {
    setConfirmModal(false);
  }

  const closeSuccessModal = (event) => {
    event.preventDefault();
    setSucessModal(false);

  }
  return (
    <>
    {loading && <SpinnerComponent isOpened={loading} />}
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
    {confirmModal && (
        <ModalComponent
          isOpened={confirmModal}
          content={
            <div className='success-vehicle-modal'>
              <h3>{`Esta seguro de eliminar el usuario con correo: ${selectedUser?.email}`}</h3>
              <img className='check-icon' src={removeIcon} alt='' />
              <section className='success-buttons'>
                <button onClick={deleteUser}>Eliminar</button>
                <button
                  className='okay-btn'
                  onClick={() => setConfirmModal(false)}
                >
                  Cerrar
                </button>
              </section>
            </div>
          }
          closeHandler={closeConfirmModal}
        />
      )}
    { modalCreateUser && <ModalComponent
    isOpened={modalCreateUser}
    closeHandler={ () => handlerCloseCreateUser() }
    content={<CreateUserComponent title={title} isEdit={isEdit} selectedUser={selectedUser} />}
    />
    }
    <div className="manage-users-container">
      <section className="header-manage-users">
        <button className="manage-users-button"
        onClick={handlerCreateUser}><div className="manage-users-action"><FaUserPlus /> <span>Crear</span></div></button>
        <button className="manage-users-button"
        disabled={!selectedUser}
        onClick={handlerEditUser}><div className="manage-users-action"><AiFillEdit /> <span>Editar</span></div> </button>
        <button
        disabled={!selectedUser} 
        onClick={handlerDeleteUser}
        className="manage-users-button"><div className="manage-users-action"><AiFillDelete /> <span>Eliminar</span></div>  </button>
      </section>
      <section >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell ><span className="header-title">Seleccionar</span> </TableCell>
                <TableCell ><span className="header-title">First Name</span></TableCell>
                <TableCell ><span className="header-title">Last Name</span></TableCell>
                <TableCell ><span className="header-title">Email</span></TableCell>
                <TableCell ><span className="header-title">Phone Number</span></TableCell>
                <TableCell ><span className="header-title">Name Role</span></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow
                  key={row.email}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                  <input id="user-select" name="user-select" type="radio" className="manage-users-select"
                  onChange={() => handlerSelectUser(row)}/>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.firstName}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.lastName}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.nameRole}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </div>
    </>
  );
};
