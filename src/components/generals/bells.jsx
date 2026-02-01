import { useEffect, useState } from "react";
import echo from "../../echo";
import bellNotification from "../../assets/icons/bellsNotification.webp";

const BellNotification = () => {
  const [numberNotification, setNumberNotification] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    echo
      .channel("notificaciones")
      .listen(".NuevaNotificacion", (data) => {
        setNumberNotification((n) => n + 1);
        setNotifications((prev) => [data, ...prev]);
      });

    return () => {
      echo.leave("notificaciones");
    };
  }, []);

  const openNotifications = () => {
    setOpenModal(true);
    setNumberNotification(0);
  };

  const closeNotifications = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div style={buttonNotifications}>
        <button style={buttonStyle} onClick={openNotifications}>
          {numberNotification > 0 && (
            <span style={badgeStyle}>{numberNotification}</span>
          )}
          <img src={bellNotification} alt="notifications" />
        </button>
      </div>

      {openModal && (
        <div style={overlay} onClick={closeNotifications}>
          <div
            style={{
              ...modal,
              animation: openModal
                ? "slideIn 0.3s ease-out"
                : "slideOut 0.3s ease-in",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "10px" }}>Notificaciones</h2>

            {notifications.length === 0 && (
              <p style={{ opacity: 0.6 }}>No hay notificaciones</p>
            )}

            {notifications.map((n, i) => (
              <div key={i} style={notificationItem}>
                <strong>{n.tipo}</strong>
                <p>{n.detalles}</p>
                <small>{n.fecha}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const buttonNotifications = {
  position: "fixed",
  right: 50,
  bottom: 50,
  zIndex: 300,
  maxWidth: "80px",
};

const buttonStyle = {
  position: "relative",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const badgeStyle = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "red",
  color: "white",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 200,
};

const modal = {
  width: "320px",
  height: "100%",
  background: "#000",
  color: "#fff",
  padding: "20px",
  overflowY: "auto",
};

const notificationItem = {
  borderBottom: "1px solid #333",
  padding: "10px 0",
};

export default BellNotification;
