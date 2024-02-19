import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar-flashy">
      <p id="Title">Flashy!</p>
      <Link to="/home" >
        <button id="HomeButton">Hjem</button>
      </Link>
      <Link to="/userpage">
        <button id="UserButton">Bruker</button>
      </Link>
    </nav>
  );
}

export default Navbar;
