import React, { useEffect } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { GrClose } from 'react-icons/gr'
import './modal.css'


export const ModalComponent = ({ isOpened, content, closeHandler }) => {
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false,
    focusTrapOptions: {
      fallbackFocus: '#root',
      clickOutsideDeactivates: () => {
        closeHandler();
      }
    }
  });

  const closeModal = () => {
    close();
    closeHandler();
  };

  useEffect(() => {
    isOpened ? open() : close();

    const handleKeyDown = (e) => {
      if(e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='modal-container'>
      <Modal>
        <div className='modal-content'>
          <section className='modal-header'>
            <GrClose onClick={closeModal} />
          </section>
          {content}
        </div>
      </Modal>
    </div>

  );
};
