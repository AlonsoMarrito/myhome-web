import React, { useState } from "react";

const RowTable = ({ pregunta, respuestas }) => {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const rowStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "16px 18px",
    marginBottom: "12px",
    borderRadius: "14px",
    background: hover
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(255, 255, 255, 0.04)",
    transition: "background 0.25s ease",
  };

  const contentStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const footerStyle = {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
    fontSize: "0.85rem",
    opacity: 0.75,
    cursor: "pointer",
  };

  const respuestaStyle = {
    padding: "6px 0",
    fontSize: "0.9rem",
    opacity: 0.85,
  };

  return (
    <div
      style={rowStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={contentStyle}>
        <div>
          <span style={{ opacity: 0.6 }}>#{pregunta.id}</span>
          <div style={{ fontWeight: 600 }}>
            {pregunta.pregunta}
          </div>
        </div>

        <span style={{ opacity: 0.6 }}>
          Evento {pregunta.id_evento}
        </span>
      </div>

      {open && (
        <div style={{ marginTop: "12px" }}>
          {respuestas.slice(0, 3).map((resp) => (
            <div key={resp.id} style={respuestaStyle}>
              • {resp.respuesta}
            </div>
          ))}

          {respuestas.length > 3 && (
            <div
              style={{
                marginTop: "8px",
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#FFD700",
                cursor: "pointer",
              }}
            >
              Ver todas las respuestas
            </div>
          )}
        </div>
      )}

      <div
        style={footerStyle}
        onClick={() => setOpen(!open)}
      >
        Respuestas ({respuestas.length})
      </div>
    </div>
  );
};

export default RowTable;
