import React from "react";
import HomeNoAuth from "./HomeNoAuth";
import Test from "./Test";

import "../styles/App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeNoAuth />} />
      <Route path="test-route" element={<Test />} />
    </Routes>
  );
}

export default App;
