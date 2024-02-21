import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigateTo = useNavigate();

    const goToHome = () => {
        navigateTo("/home");
      };

    return (
    <nav role="main" className="navbar-flashy">
      <p id="Title">Flashy!</p>
      <button id="HomeButton" onClick={goToHome}>Hjem</button>
      <button id="UserButton">Bruker</button>
    </nav>
  )
}

export default Navbar;
