import React, { useState } from "react";
import TextTitle from "../components/widgets/TextTitle";
import RowTable from "../components/widgets/RowTable";

const Buzzon = ({ sidebarOpen }) => {
  const [nuevaPregunta, setNuevaPregunta] = useState("");

  const bodyBuzzon = {
    marginLeft: sidebarOpen ? "15vw" : "7vw",
    transition: "margin-left 0.3s, width 0.3s ease",
    width: sidebarOpen ? "77vw" : "85vw",
    marginTop: "15vh",
    background: "rgba(98, 98, 98, 0.1)",
    height: "70vh",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  };

  const listContainer = {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
  };

  const formContainer = {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "15px",
    display: "flex",
    gap: "10px",
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "1rem",
    background: "rgba(255,255,255,0.08)",
    color: "white",
  };

  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#FFD700",
    color: "#000",
    fontWeight: 600,
  };


  const preguntasQuery = [
    { id: 1, pregunta: "¿Habrá corte de agua esta semana?", id_evento: 3 },
    { id: 2, pregunta: "¿A qué hora empieza la junta vecinal?", id_evento: 3 },
    { id: 3, pregunta: "¿Se permitirá estacionarse afuera del parque?", id_evento: 5 },
  ];

  const respuestaQuery = [
    {
      id: 1,
      id_pregunta: 1,
      id_asistente: 2,
      respuesta: "Sí, el corte será el miércoles de 9 a 14 horas.",
    },
    {
      id: 2,
      id_pregunta: 1,
      id_asistente: 4,
      respuesta: "Solo afectará al bloque A.",
    },
    {
      id: 3,
      id_pregunta: 1,
      id_asistente: 1,
      respuesta: "El aviso se publicó ayer.",
    },
    {
      id: 4,
      id_pregunta: 1,
      id_asistente: 3,
      respuesta: "Habrá baja presión antes del corte.",
    },
    {
      id: 5,
      id_pregunta: 1,
      id_asistente: 5,
      respuesta: "Recomiendan almacenar agua.",
    },
    {
      id: 6,
      id_pregunta: 1,
      id_asistente: 2,
      respuesta: "El servicio regresará gradualmente.",
    },
  ];


  const handleEnviar = () => {
    if (!nuevaPregunta.trim()) return;
    console.log("Nueva pregunta:", nuevaPregunta);
    setNuevaPregunta("");
  };

  return (
    <div style={bodyBuzzon}>
      <TextTitle textTitleParam="Buzzón Vecinal" />

      <div style={listContainer}>
        {preguntasQuery.map((pregunta) => {
          const respuestasDePregunta = respuestaQuery.filter(
            (r) => r.id_pregunta === pregunta.id
          );

          return (
            <RowTable
              key={pregunta.id}
              pregunta={pregunta}
              respuestas={respuestasDePregunta}
            />
          );
        })}
      </div>

      <div style={formContainer}>
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={nuevaPregunta}
          onChange={(e) => setNuevaPregunta(e.target.value)}
          style={inputStyle}
        />
        <button style={buttonStyle} onClick={handleEnviar}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Buzzon;
