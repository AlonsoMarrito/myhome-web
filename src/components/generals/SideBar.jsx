import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import MensajesIcon from "../../assets/icons/mensajesIcon.png";
import OpenIcon from "../../assets/icons/openLeft.png";
import CloseIcon from "../../assets/icons/openRight.png";
import HouseIcon from "../../assets/icons/houses.png";
import BuzzonIcon from "../../assets/icons/buzzonComentarios.png";
import EventsIcon from "../../assets/icons/events.png";

const SideBar = ({ open, setOpen }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const toggleSidebar = () => setOpen(!open);

  const sideBarStyle = {
    position: "fixed",
    left: 0,
    top: "10vh",
    width: open ? "15vw" : "7vw",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    transition: "width 0.3s ease",
  };

  const iconContainer = {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: open ? "10px" : "0px",
  };

  const imageDimensions = {
    maxWidth: "100%",
    maxHeight: "100%",
  };

  const navigationsViews = [
    { view: "Buzzon", icon: BuzzonIcon, route: "/" },
    { view: "Eventos", icon: EventsIcon, route: "/eventos" },
    { view: "Mensajes", icon: MensajesIcon, route: "/mensajes" },
    { view: "Departamentos", icon: HouseIcon, route: "/departamentos" },
  ];

  return (
    <div style={sideBarStyle}>
      {navigationsViews.map((item, index) => (
        <NavLink
          key={index}
          to={item.route}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "10px",
            marginBottom: "5px",
            background:
              isActive || hoverIndex === index
                ? "rgba(138, 42, 42, 0.85)"
                : "transparent",
            borderRadius: "10px",
            border: "none",
            color: "white",
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.2s ease",
          })}
        >
          <div style={iconContainer}>
            <img src={item.icon} style={imageDimensions} alt={item.view} />
          </div>
          {open && item.view}
        </NavLink>
      ))}

      {/* Botón abrir / cerrar sidebar */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          left: open ? "12vw" : "2vw",
          bottom: 20,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          outline: "none",
          transition: "left 0.3s ease",
        }}
      >
        <img
          src={open ? OpenIcon : CloseIcon}
          style={{ width: "30px", height: "30px" }}
          alt="toggle sidebar"
        />
      </button>
    </div>
  );
};

export default SideBar;
