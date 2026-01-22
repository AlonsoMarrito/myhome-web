import React, { useState } from "react";
import menuIcon from "../../assets/icons/menuIcon.png";

const BarNav = () => {
  const [hover, setHover] = useState(false);

  const barNavStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    maxWidth: "1600px",
    background: "rgba(242, 66, 66, 0.54)",
    padding: "10px",
    height: "10vh",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
  };

  const spaceIconMenu = {
    maxHeight: "7vh",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const efectsToMenu = {
    marginLeft: "10px",
    padding: "3px",
    backgroundColor: hover ? "rgba(138, 42, 42, 0.85)" : "transparent",
    cursor: "pointer",
    borderRadius: "5px",
  };

  const currentUser = "Chapo Guzman"

  return (
    <div style={barNavStyle}>
      <h1>{currentUser}</h1>
      <div style={spaceIconMenu}>
      <h1>MyHome</h1>
        <img
          src={menuIcon}
          alt="MyHome"
          style={{...spaceIconMenu, ...efectsToMenu}}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </div>
    </div>
  );
};

export default BarNav;
