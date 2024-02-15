import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import CardViewer from "./pages/CardViewer";
import Login from "./pages/Login";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/cards" element={<CardViewer />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

reportWebVitals();

root.render(<App />);
