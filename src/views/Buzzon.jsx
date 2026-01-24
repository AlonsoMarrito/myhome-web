import React, { useEffect, useState } from "react";
import TextTitle from "../components/widgets/TextTitle";
import RowTable from "../components/widgets/RowTable";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { echo } from "../echo"; // Tu instancia de Echo ya configurada

const API_URL = "http://localhost:8000/api";

const Buzzon = () => {
  const { sidebarOpen } = useOutletContext();

  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState({ preguntas: [] });
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventoHoy, setEventoHoy] = useState(null);

  const asistenteId = 1;

  /* ===============================
     CARGAR EVENTOS
  =============================== */
  const cargarEventos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/eventos`);
      setEventos(res.data);

      const hoy = new Date().toISOString().split("T")[0];
      const eventoActivoHoy = res.data.find((ev) => ev.fecha === hoy);
      setEventoHoy(eventoActivoHoy || null);

      if (eventoActivoHoy) {
        const preguntas = await cargarPreguntasEvento(eventoActivoHoy.id);
        setEventoSeleccionado({ ...eventoActivoHoy, preguntas });
      } else if (res.data.length > 0) {
        seleccionarEvento(res.data[0].id);
      }
    } catch (error) {
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     CARGAR PREGUNTAS POR EVENTO
  =============================== */
  const cargarPreguntasEvento = async (eventoId) => {
    if (!eventoId) return [];
    try {
      const res = await axios.get(`${API_URL}/preguntas?id_evento=${eventoId}`);
      const preguntasConVotos = await Promise.all(
        res.data.map(async (p) => {
          try {
            const votosRes = await axios.get(`${API_URL}/respuestas-count?id_pregunta=${p.id}`);
            return { ...p, votos: votosRes.data || { si: 0, no: 0, abstengo: 0 } };
          } catch {
            return { ...p, votos: { si: 0, no: 0, abstengo: 0 } };
          }
        })
      );
      return preguntasConVotos;
    } catch (error) {
      console.error("Error cargando preguntas del evento:", error);
      return [];
    }
  };

  /* ===============================
     SELECCIONAR EVENTO
  =============================== */
  const seleccionarEvento = async (eventoId) => {
    const ev = eventos.find((e) => e.id === parseInt(eventoId));
    if (!ev) return;

    setLoading(true);
    try {
      const preguntas = await cargarPreguntasEvento(ev.id);
      setEventoSeleccionado({ ...ev, preguntas });
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     SUSCRIPCIÓN A WEBSOCKET
  =============================== */
  useEffect(() => {
    cargarEventos();

    echo.channel("eventos")
      .listen("NuevaPregunta", (e) => {
        const preguntaNueva = e.pregunta;
        console.log("Evento recibido desde backend:", e);

        // Mensaje visual
        alert(`Nueva pregunta recibida: "${preguntaNueva.pregunta}"`);

        setEventoSeleccionado((prev) => {
          if (prev.id === preguntaNueva.id_evento) {
            return {
              ...prev,
              preguntas: [
                ...prev.preguntas,
                { ...preguntaNueva, votos: { si: 0, no: 0, abstengo: 0 } },
              ],
            };
          }
          return prev;
        });
      });

    return () => {
      echo.leaveChannel("eventos");
    };
  }, []);

  /* ===============================
     AGREGAR PREGUNTA
  =============================== */
  const agregarPregunta = async () => {
    if (!nuevaPregunta.trim() || !eventoHoy) return;
    try {
      const res = await axios.post(`${API_URL}/preguntas`, {
        pregunta: nuevaPregunta,
        id_evento: eventoHoy.id,
      });

      const nueva = { ...res.data, votos: { si: 0, no: 0, abstengo: 0 } };
      setEventoSeleccionado((prev) => ({
        ...prev,
        preguntas: [...(prev.preguntas || []), nueva],
      }));
      setNuevaPregunta("");

      console.log("Pregunta creada y evento disparado:", res.data);
    } catch (error) {
      console.error("Error creando pregunta:", error.response?.data || error.message);
    }
  };

  /* ===============================
     RESPONDER PREGUNTA
  =============================== */
  const responderPregunta = async (tipo, pregunta) => {
    if (!pregunta) return;
    try {
      await axios.post(`${API_URL}/respuestas`, {
        id_pregunta: pregunta.id,
        id_asistente: asistenteId,
        respuesta: tipo,
      });

      const votosRes = await axios.get(`${API_URL}/respuestas-count?id_pregunta=${pregunta.id}`);
      const nuevosVotos = votosRes.data || { si: 0, no: 0, abstengo: 0 };

      setEventoSeleccionado((prev) => ({
        ...prev,
        preguntas: prev.preguntas.map((p) =>
          p.id === pregunta.id ? { ...p, votos: nuevosVotos } : p
        ),
      }));
    } catch (error) {
      console.error("Error guardando respuesta:", error.response?.data || error.message);
    }
  };

  /* ===============================
     ESTILOS CON LÓGICA DE SIDEBAR
  =============================== */
  let longSideBar = 85;
  if (sidebarOpen) longSideBar -= 8;

  const bodyBuzzon = {
    marginLeft: sidebarOpen ? "15vw" : "7vw",
    transition: "margin-left 0.3s, width 0.3s ease",
    width: longSideBar + "vw",
    marginTop: "15vh",
    background: "rgba(98, 98, 98, 0.1)",
    height: "70vh",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  };

  const inputStyle = {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
  };

  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#FFD700",
    cursor: "pointer",
    fontWeight: 600,
  };

  const selectStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    border: "none",
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div style={bodyBuzzon}>
      <TextTitle textTitleParam="Buzzón Vecinal" />

      <div style={{ display: "flex", gap: "20px", flex: 1 }}>
        {/* IZQUIERDA */}
        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: "15px" }}>
            {loading && <p>Cargando...</p>}
            {!loading && !eventoHoy && <p style={{ opacity: 0.6 }}>No hay evento activo hoy</p>}
            {!loading && eventoSeleccionado?.preguntas?.length === 0 && (
              <p style={{ opacity: 0.6 }}>Aún no hay preguntas en este evento</p>
            )}
            {eventoSeleccionado?.preguntas?.map((p) => (
              <RowTable
                key={p.id}
                pregunta={{
                  ...p,
                  resumen: `Sí: ${p.votos?.si || 0} | No: ${p.votos?.no || 0} | Abst: ${p.votos?.abstengo || 0}`,
                }}
                respuestas={p.votos || {}}
              />
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              placeholder="Escribe tu pregunta..."
              value={nuevaPregunta}
              onChange={(e) => setNuevaPregunta(e.target.value)}
              style={inputStyle}
              disabled={!eventoHoy}
            />
            <button onClick={agregarPregunta} style={buttonStyle} disabled={!eventoHoy}>
              Enviar
            </button>
          </div>
        </div>

        {/* DERECHA */}
        <div
          style={{
            flex: 2,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "15px",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            overflowY: "auto",
          }}
        >
          <div>
            <h4>Selecciona un evento</h4>
            <select
              value={eventoSeleccionado?.id || ""}
              onChange={(e) => seleccionarEvento(e.target.value)}
              style={selectStyle}
            >
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.fecha} - {ev.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h4>Preguntas del evento</h4>
            {eventoSeleccionado?.preguntas?.length > 0 ? (
              eventoSeleccionado.preguntas.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <p>{p.pregunta}</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button onClick={() => responderPregunta("si", p)}>
                      Sí ({p.votos?.si || 0})
                    </button>
                    <button onClick={() => responderPregunta("no", p)}>
                      No ({p.votos?.no || 0})
                    </button>
                    <button onClick={() => responderPregunta("abstengo", p)}>
                      Abstengo ({p.votos?.abstengo || 0})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.6 }}>Aún no hay preguntas en este evento</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buzzon;
