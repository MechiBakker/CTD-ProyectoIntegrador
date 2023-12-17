import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserConfirm.css';
import { activeUser } from '../../services/user.service';
import { ModalComponent } from '../../shared/modal/modal';
import { SpinnerComponent } from '../../shared/spinner/spinner';
import checkIcon from '../../assets/check.png'

export const UserConfirmComponent = () => {
  const navigate = useNavigate();
  const [loadingSppiner, setLoadingSpinner] = useState(false);
  const [sucessModal, setSucessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const urlActive = location.pathname.slice(1);

  const handlerConfirm = (e) => {
    e.preventDefault();
    setLoadingSpinner(true)
    activeUser(urlActive)
    .then(({ data }) => {
      setSuccessMessage(data);
      setSucessModal(true);
    }).finally(() => {
      setLoadingSpinner(false)
    })
  }

  const closeSuccessModal = (e) => {
    e.preventDefault();
    setSucessModal(false);
  }

  const gotoLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  }

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
    <div className="container-confirmation">
      <h1>Confirmación de cuenta</h1>
      <div className="confirmation-grid">
      <section className="email-container">
      <h3>¡Felicidades! Tu cuenta ha sido confirmada.</h3>
      <p className="confirmation-txt">{`
      Nos complace informarte que tu cuenta ha sido confirmada con éxito. Ahora eres parte de nuestra comunidad y puedes disfrutar de todos los beneficios y servicios que ofrecemos.

      Con tu cuenta confirmada, tendrás acceso completo a todas las características y funcionalidades de nuestro sitio web/plataforma. Podrás explorar nuestros productos/servicios, interactuar con otros usuarios y acceder a contenido exclusivo.
      
      Te recordamos que es importante mantener la seguridad de tu cuenta. Asegúrate de utilizar una contraseña segura y evitar compartirla con terceros. Si en algún momento sospechas de actividades sospechosas en tu cuenta, no dudes en contactar a nuestro equipo de soporte para recibir asistencia inmediata.
      
      Gracias por unirte a nosotros y confiar en nuestros servicios. Esperamos que disfrutes de tu experiencia en nuestra plataforma. Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en comunicarte con nuestro equipo de soporte, estaremos encantados de ayudarte.
      `}</p>
      <button onClick={handlerConfirm} className="confirmation-button"> Activar cuenta </button>

      </section>
      <div className="confirmation-image-container" style={{ backgroundImage: 'url(https://www.lavanguardia.com/files/og_thumbnail/uploads/2019/01/02/5f15f465dc419.jpeg)' }}>
      </div>
      </div>
    </div>
    </>

  )
}