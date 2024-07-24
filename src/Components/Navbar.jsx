import React from "react";

const Navbar = () => {
  return (
    <div className="navbar" style={{ backgroundColor: "#2a2c2e" }}>
      <h1
        onClick={() => {
          window.location.href = "/";
        }}
        style={{ color: "white" }}
      >
        Vehicle Registration
      </h1>
      <h3 style={{ marginLeft: "550px", color: "white" }}>
        Username: {window.localStorage.getItem("username")}
      </h3>
      <div>
        <button
          onClick={() => {
            window.location.href = "/new";
          }}
        >
          Register New Vehicle
        </button>
        <button
          onClick={() => {
            window.location.href = "/transfer";
          }}
        >
          Transfer Ownership
        </button>

        <button
          onClick={() => {
            window.localStorage.removeItem("username");
            window.location.href = "/login";
          }}
          className="logoutbutton"
          style={{ backgroundColor: "red", fontWeight: "bold" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
