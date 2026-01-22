import React, { useState } from "react";
import MensajesIcon from "../../assets/icons/mensajesIcon.png";
import OpenIcon from "../../assets/icons/openLeft.png";
import CloseIcon from "../../assets/icons/openRight.png";
import HouseIcon from "../../assets/icons/houses.png";
import buzzon from "../../assets/icons/buzzonComentarios.png";

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
    { view: "Buzzon", icon: buzzon },
    { view: "Mensajes", icon: MensajesIcon },
    { view: "Departamentos", icon: HouseIcon },
  ];

  return (
    <div style={sideBarStyle}>
      {navigationsViews.map((item, index) => (
        <button
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "10px",
            background:
              hoverIndex === index ? "rgba(138, 42, 42, 0.85)" : "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <div style={iconContainer}>
            <img src={item.icon} style={imageDimensions} alt="" />
          </div>
          {open && item.view}
        </button>
      ))}

      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          left: 20,
          bottom: 20,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <img
          src={open ? OpenIcon : CloseIcon}
          style={{ width: "30px", height: "30px" }}
          alt="toggle"
        />
      </button>
    </div>
  );
};

export default SideBar;
