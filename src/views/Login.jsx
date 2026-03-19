import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [emailRecover, setEmailRecover] = useState("");
  const [recoverMessage, setRecoverMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        id_persona: usuario,
        password
      });

      login(res.data.token, res.data.admin);
      navigate("/events");

    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handleRecoverPassword = async () => {
    setRecoverMessage("");
    setError("");

    if (!emailRecover) {
      setError("Ingresa tu correo para recuperar la contraseña");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/recover-password", {
        email: emailRecover
      });
      setRecoverMessage("Se ha enviado un correo para recuperar tu contraseña");
      setEmailRecover(""); // Limpiar campo
    } catch (err) {
      setError("Error al enviar el correo, intenta nuevamente");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-lg w-80 shadow-lg border border-red-600">

        <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
          Login
        </h1>

        {error && (
          <div className="bg-red-600 text-white text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="bg-green-600 text-white text-sm p-2 rounded mb-4">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="p-2 rounded border border-red-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded border border-red-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Iniciar sesión
          </button>

        </form>

        {/* Botón para abrir modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition text-sm"
        >
          ¿Olvidaste tu contraseña?
        </button>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-80 shadow-lg border border-red-600 relative">
              
              <button 
                onClick={() => setModalOpen(false)} 
                className="absolute top-2 right-2 text-red-600 font-bold"
              >
                X
              </button>

              <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
                Recuperar contraseña
              </h2>

              {error && (
                <div className="bg-red-600 text-white text-sm p-2 rounded mb-4">
                  {error}
                </div>
              )}

              {recoverMessage && (
                <div className="bg-green-600 text-white text-sm p-2 rounded mb-4">
                  {recoverMessage}
                </div>
              )}

              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={emailRecover}
                onChange={(e) => setEmailRecover(e.target.value)}
                className="p-2 rounded border border-red-600 bg-gray-800 text-white w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              <button
                onClick={handleRecoverPassword}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full transition"
              >
                Enviar correo
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}