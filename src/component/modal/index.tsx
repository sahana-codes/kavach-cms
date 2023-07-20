import React, { ReactNode } from 'react';

type Props = { onClose: () => void; children: ReactNode };

function Modal({ onClose, children }: Props) {
  return (
    <>
      <button onClick={onClose}>Close X</button>
      {children}
    </>
  );
}

export default Modal;
