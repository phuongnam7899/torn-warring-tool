import React from "react";
import "./index.css";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink exact to="/" activeClassName="activeLink">
            Report
          </NavLink>
        </li>
        <li>
          <NavLink to="/setting" activeClassName="activeLink">
            Setting
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
