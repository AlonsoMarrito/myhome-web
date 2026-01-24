import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        width: "100vw"
      }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: 700 }}>404</h1>
      <p style={{ fontSize: "1.5rem", opacity: 0.8 }}>
        Ups… esta página no existe
      </p>
    </div>
  );
};

export default NotFound;
