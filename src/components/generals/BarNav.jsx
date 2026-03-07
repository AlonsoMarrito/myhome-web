import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import menuIcon from "../../assets/icons/menuIcon.png";

const BarNav = () => {

  const [hover, setHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToSettings = () => {
    navigate("/configuracion");
    setOpenMenu(false);
  };

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
    position: "relative",
  };

  const efectsToMenu = {
    marginLeft: "10px",
    padding: "3px",
    backgroundColor: hover ? "rgba(138, 42, 42, 0.85)" : "transparent",
    cursor: "pointer",
    borderRadius: "5px",
  };

  const dropdownMenu = {
    position: "absolute",
    top: "8vh",
    right: "0",
    background: "white",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    minWidth: "150px",
    overflow: "hidden",
  };

  const dropdownItem = {
    padding: "8px 15px",
    cursor: "pointer",
    color: "black",
    transition: "background 0.2s",
  };

  const currentUser = "Chapo Guzman";

  return (
    <div style={barNavStyle}>
      <h1>{currentUser}</h1>

      <div style={spaceIconMenu}>
        <h1>MyHome</h1>

        <img
          src={menuIcon}
          alt="MyHome"
          style={{ ...spaceIconMenu, ...efectsToMenu }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => setOpenMenu(!openMenu)}
        />

        {openMenu && (
          <div style={dropdownMenu}>

            <div
              style={dropdownItem}
              onClick={goToSettings}
              onMouseEnter={(e) => e.target.style.background = "#f2f2f2"}
              onMouseLeave={(e) => e.target.style.background = "transparent"}
            >
              Configuraciones
            </div>

            <div
              style={dropdownItem}
              onClick={handleLogout}
              onMouseEnter={(e) => e.target.style.background = "#f2f2f2"}
              onMouseLeave={(e) => e.target.style.background = "transparent"}
            >
              Cerrar sesión
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default BarNav;