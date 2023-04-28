import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalEl } from "./Modal.styled";

const modalRoot = document.querySelector('#modal-root');

const Modal = ({onCloseModal, largeImg, tagsImg}) => {
    useEffect(() => {
        const handleKeyDown = e => {
            if(e.code === 'Escape') {
                onCloseModal();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    },[onCloseModal]);

    const handleBackdropClick = e => {
        if(e.currentTarget === e.target) {
            onCloseModal();
        }
    }

    return createPortal(
        <Overlay onClick={handleBackdropClick}>
            <ModalEl>
                <img src={largeImg} alt={tagsImg} />
            </ModalEl>
        </Overlay>, modalRoot
    );
}

Modal.propTypes = {
        onCloseModal: PropTypes.func.isRequired,
        largeImg: PropTypes.string.isRequired,
        tagsImg: PropTypes.string.isRequired,
    };

export default Modal;