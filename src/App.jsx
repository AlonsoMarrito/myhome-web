import React, { useState, useEffect } from "react";
import BarNav from "./components/generals/BarNav";
import SideBar from "./components/generals/SideBar";
import Buzon from "./views/Buzzon";

const MainView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div>
      <BarNav />
      <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
      <Buzon sidebarOpen={sidebarOpen} />
    </div>
  );
};

export default MainView;
