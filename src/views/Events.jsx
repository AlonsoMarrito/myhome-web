import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Calendar from "react-calendar";
import QRCode from "react-qr-code";
import "react-calendar/dist/Calendar.css";

const API_URL = "http://127.0.0.1:8000/api/eventos";

const Events = () => {
  const { sidebarOpen } = useOutletContext();

  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoExistente, setEventoExistente] = useState(null);

  /* =======================
     CARGAR EVENTOS
  ======================= */
  const cargarEventos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error("Error cargando eventos", error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  /* =======================
     UI SIDEBAR
  ======================= */
  let longSideBar = 85;
  let efectCloseSideBar = "margin-left 0.3s, width 0.3s ease";

  if (sidebarOpen) longSideBar -= 8;

  const bodyBuzzon = {
    marginLeft: sidebarOpen ? "15vw" : "7vw",
    transition: efectCloseSideBar,
    width: longSideBar + "vw",
    marginTop: "15vh",
    background: "rgba(98, 98, 98, 0.1)",
    height: "70vh",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    color: "white",
  };

  /* =======================
     UTILIDADES
  ======================= */
  const formatFecha = (date) =>
    typeof date === "string" ? date : date.toISOString().split("T")[0];

  const obtenerEvento = (fecha) =>
    eventos.find((e) => e.fecha === fecha);

  const hoy = formatFecha(new Date());
  const juntaHoy = obtenerEvento(hoy);

  /* =======================
     CALENDAR CLICK
  ======================= */
  const onClickDay = (date) => {
    const fecha = formatFecha(date);
    const evento = obtenerEvento(fecha);

    setFechaSeleccionada(fecha);
    setEventoExistente(evento || null);
    setDescripcion(evento?.descripcion || "");
    setMostrarModal(true);
  };

  /* =======================
     CRUD EVENTOS
  ======================= */
  const guardarEvento = async () => {
    if (!descripcion.trim()) return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fechaSeleccionada,
          descripcion,
        }),
      });

      await cargarEventos();
      cerrarModal();
    } catch (error) {
      console.error("Error guardando evento", error);
    }
  };

  const cancelarEvento = async () => {
    try {
      await fetch(`${API_URL}/${eventoExistente.id}`, {
        method: "DELETE",
      });

      await cargarEventos();
      cerrarModal();
    } catch (error) {
      console.error("Error eliminando evento", error);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setDescripcion("");
    setEventoExistente(null);
    setFechaSeleccionada(null);
  };


  return (
    <div style={bodyBuzzon}>
      <h2 style={{ marginBottom: "15px" }}>Calendario de Juntas</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flex: 1,
          overflow: "hidden",
        }}
      >

        <div style={{ flex: 2, height: "100%" }}>
          <Calendar
            onClickDay={onClickDay}
            tileClassName={({ date }) => {
              const fecha = formatFecha(date);
              return obtenerEvento(fecha) ? "dia-con-evento" : null;
            }}
          />
        </div>


        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "15px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h3>Junta hoy</h3>

          {juntaHoy ? (
            <>
              <p style={{ marginTop: "10px", opacity: 0.85 }}>
                {juntaHoy.descripcion}
              </p>

              <div
                style={{
                  marginTop: "20px",
                  background: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  alignSelf: "center",
                }}
              >
                <QRCode
                  value={`asistencia-junta-${juntaHoy.fecha}`}
                  size={160}
                />
              </div>

              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                Escanea para registrar asistencia
              </p>
            </>
          ) : (
            <p style={{ marginTop: "10px", opacity: 0.6 }}>
              No hay junta programada para hoy
            </p>
          )}
        </div>
      </div>


      {mostrarModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            {eventoExistente ? (
              <>
                <h3>Ya existe una junta</h3>
                <p style={{ margin: "15px 0" }}>
                  {eventoExistente.descripcion}
                </p>

                <div style={modalActions}>
                  <button onClick={cerrarModal} style={btnNeutral}>
                    Cerrar
                  </button>
                  <button onClick={cancelarEvento} style={btnDanger}>
                    Cancelar junta
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Nueva junta</h3>

                <input
                  placeholder="Descripción de la junta"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={inputStyle}
                />

                <div style={modalActions}>
                  <button onClick={cerrarModal} style={btnNeutral}>
                    Cerrar
                  </button>
                  <button onClick={guardarEvento} style={btnPrimary}>
                    Guardar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          .react-calendar {
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.05);
            border: none;
            border-radius: 15px;
            padding: 10px;
            color: white;
          }

          .react-calendar__tile {
            border-radius: 10px;
          }

          .react-calendar__tile:enabled:hover {
            background: rgba(255,255,255,0.15);
          }

          .dia-con-evento {
            background: rgba(255, 215, 0, 0.35) !important;
            color: black !important;
            font-weight: bold;
          }

          .react-calendar__tile--now {
            background: rgba(255, 120, 120, 0.35);
          }

          .react-calendar__navigation button {
            color: white;
            border-radius: 10px;
          }

          .react-calendar__navigation button:enabled:hover {
            background: rgba(138, 42, 42, 0.45);
            color: #fff;
          }

          /* Hover del nombre del mes */
          .react-calendar__navigation__label:enabled:hover {
            background: rgba(255, 215, 0, 0.35);
            color: black;
          }

          /* Evitar blanco al hacer focus */
          .react-calendar__navigation button:focus {
            background: rgba(138, 42, 42, 0.35);
          }

        `}
      </style>
    </div>
  );
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBox = {
  background: "#1e1e1e",
  padding: "30px",
  borderRadius: "15px",
  width: "420px",
};

const modalActions = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};

const btnNeutral = {
  background: "rgba(255,255,255,0.15)",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

const btnPrimary = {
  background: "rgba(255,215,0,0.9)",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
};

const btnDanger = {
  background: "rgba(255,90,90,0.85)",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  margin: "15px 0",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};

export default Events;
