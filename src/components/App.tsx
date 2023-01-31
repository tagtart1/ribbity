import React from "react";
import Home from "./Home";
import Test from "./Test";

import "../styles/App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="test-route" element={<Test />} />
    </Routes>
  );
}

export default App;
