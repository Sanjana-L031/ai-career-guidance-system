import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ padding: "10px", background: "#282c34" }}>
    <Link to="/" style={{ color: "white", marginRight: "15px" }}>Home</Link>
    <Link to="/recommend" style={{ color: "white" }}>Career Recommender</Link>
  </nav>
);

export default Navbar;
