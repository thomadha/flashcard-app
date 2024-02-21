import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import CardViewer from "./pages/CardViewer";
import AddCards from "./pages/AddCards";
import Login from "./pages/Login";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/cards" element={<CardViewer />}></Route>
        <Route path="/edit" element={<AddCards />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

reportWebVitals();

root.render(<App />);
