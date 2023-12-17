import React, { useEffect } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { Oval } from 'react-loader-spinner';
import './spinner.css'

export const SpinnerComponent = ({ isOpened }) => {
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false
  });

   useEffect(() => {
    isOpened ? open() : close()
   },[])

  return (
    <div>
      <Modal>
        <div>
        <Oval
        height={80}
        width={80}
        color="#fff"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="#fff"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
          <button className='loading-txt'>Loading...</button>
        </div>
      </Modal>
    </div>
  );
};
