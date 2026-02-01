import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import BarNav from "./components/generals/BarNav";
import SideBar from "./components/generals/SideBar";
import BellNotification from "./components/generals/bells";

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
      <BellNotification />
      <Outlet context={{ sidebarOpen }} />
    </div>
  );
};

export default MainView;

