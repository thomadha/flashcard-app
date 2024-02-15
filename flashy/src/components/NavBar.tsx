import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav role="main" className="navbar-flashy">
      <p id="Title">Flashy!</p>
      <button id="HomeButton">Hjem</button>
      <button id="UserButton">Bruker</button>
    </nav>
  );
}

export default Navbar;
