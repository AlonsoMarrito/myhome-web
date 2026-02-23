import { useContext, useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import BarNav from "./components/generals/BarNav";
import SideBar from "./components/generals/SideBar";
import BellNotification from "./components/generals/bells";

const MainView = () => {
  const { token } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => JSON.parse(localStorage.getItem("sidebarOpen")) || false
  );

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Guard: si no hay token, redirige a login
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <BarNav />
        <BellNotification />
        <main className="flex-1 p-4 overflow-auto">
          <Outlet context={{ sidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default MainView;