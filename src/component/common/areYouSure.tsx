import React from 'react';

type Props = {
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

const AreYouSure: React.FC<Props> = ({
  message,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <p>{message}</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          <button onClick={onConfirm} style={{ marginRight: '10px' }}>
            Confirm
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AreYouSure;
