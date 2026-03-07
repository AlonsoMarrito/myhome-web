import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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

      </div>

    </div>
  );
}