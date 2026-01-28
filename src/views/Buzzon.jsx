import React, { useEffect, useState } from "react";
import TextTitle from "../components/widgets/TextTitle";
import RowTable from "../components/widgets/RowTable";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import echo from "../echo";

const API_URL = "http://localhost:8000/api";

const Buzzon = () => {
  const { sidebarOpen } = useOutletContext();

  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState({ preguntas: [] });
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventoHoy, setEventoHoy] = useState(null);

  const asistenteId = 1;

  // Cargar todos los eventos
  const cargarEventos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/eventos`);
      setEventos(res.data);

      const hoy = new Date().toLocaleDateString("sv-SE");
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

  useEffect(() => {
    cargarEventos();

    const canal = echo.channel("eventos");
    canal.listen(".NuevaPregunta", async () => {
      console.log("Evento recibido, recargando preguntas...");
      if (eventoSeleccionado?.id) {
        const preguntasActualizadas = await cargarPreguntasEvento(eventoSeleccionado.id);
        setEventoSeleccionado((prev) => ({
          ...prev,
          preguntas: preguntasActualizadas,
        }));
      }
    });

    return () => {
      echo.leaveChannel("eventos");
    };
  }, [eventoSeleccionado?.id]);

  async function agregarPregunta() {
    if (!nuevaPregunta.trim() || !eventoHoy) return;
    try {
      await axios.post(`${API_URL}/preguntas`, {
        pregunta: nuevaPregunta,
        id_evento: eventoHoy.id,
      });

      setNuevaPregunta("");
    } catch (error) {
      console.error("Error creando pregunta:", error.response?.data || error.message);
    }
  }

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

  // Estilos
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

  const scrollContainer = {
    flex: 1,
    overflowY: "auto",
  };

  return (
    <div style={bodyBuzzon}>
  <TextTitle textTitleParam="Buzzón Vecinal" />

  <div style={{ display: "flex", gap: "20px", flex: 1, height: "70%" }}>
    {/* IZQUIERDA */}
    <div style={{ flex: 3, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Contenedor scrollable */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
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

      {/* Input fijo abajo */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input placeholder="Escribe tu pregunta..." value={nuevaPregunta} onChange={(e) => setNuevaPregunta(e.target.value)} style={inputStyle} />
        <button onClick={agregarPregunta} style={buttonStyle}>Enviar</button>
      </div>
    </div>

    {/* DERECHA */}
    <div style={{ flex: 2, display: "flex", flexDirection: "column", height: "100%", borderRadius: "15px", background: "rgba(255,255,255,0.05)", padding: "15px" }}>
      {/* Select fijo arriba */}
      <div>
        <h4>Selecciona un evento</h4>
        <select value={eventoSeleccionado?.id || ""} onChange={(e) => seleccionarEvento(e.target.value)} style={selectStyle}>
          {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.fecha} - {ev.descripcion}</option>)}
        </select>
      </div>

      {/* Contenedor scrollable para preguntas */}
      <div style={{ flex: 1, overflowY: "auto", marginTop: "15px" }}>
        <h4>Preguntas del evento</h4>
        {eventoSeleccionado?.preguntas?.map((p) => (
          <div key={p.id} style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}>
            <p>{p.pregunta}</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => responderPregunta("si", p)}>Sí ({p.votos?.si || 0})</button>
              <button onClick={() => responderPregunta("no", p)}>No ({p.votos?.no || 0})</button>
              <button onClick={() => responderPregunta("abstengo", p)}>Abstengo ({p.votos?.abstengo || 0})</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default Buzzon;
