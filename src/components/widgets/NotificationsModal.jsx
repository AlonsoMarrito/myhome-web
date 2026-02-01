import React, { useEffect, useState } from "react";

const NotificationsModal = ({
  open,
  onClose,
  notifications = [],
  onClear,
}) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  if (!open && !visible) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const modalStyle = {
    width: "380px",
    minWidth: "380px",
    maxHeight: "65vh",
    background: "#0f0f0f",
    color: "#fff",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    animation: visible
      ? "openModal 0.25s ease forwards"
      : "closeModal 0.25s ease forwards",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #333",
    paddingBottom: "10px",
    marginBottom: "10px",
  };

  const itemStyle = {
    background: "#1a1a1a",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "8px",
  };

  const btn = {
    background: "#222",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  };

  return (
    <>
      <style>
        {`
          @keyframes openModal {
            from {
              opacity: 0;
              transform: translateY(-12px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes closeModal {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(-12px) scale(0.95);
            }
          }
        `}
      </style>

      <div style={overlayStyle} onClick={handleClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h3>Notificaciones</h3>
            <div style={{ display: "flex", gap: "6px" }}>
              <button style={btn} onClick={onClear}>
                Limpiar
              </button>
              <button
                style={{ ...btn, background: "#922" }}
                onClick={handleClose}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {notifications.length === 0 && (
              <p style={{ color: "#aaa", textAlign: "center" }}>
                No hay notificaciones
              </p>
            )}

            {notifications.map((n, index) => (
              <div key={index} style={itemStyle}>
                <strong>{n.tipo.toUpperCase()}</strong>
                <p>{n.detalles}</p>
                <small style={{ color: "#888" }}>{n.fecha}</small>
              </div>
            ))}
          </div>

          <button
            onClick={handleClose}
            style={{
              marginTop: "12px",
              padding: "12px",
              background: "#c62828",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            CERRAR
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsModal;
