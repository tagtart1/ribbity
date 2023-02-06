import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExplorePage from "./ExplorePage";

import Home from "./Home";

import "../styles/App.css";
import { Routes, Route } from "react-router-dom";
import {
  isUserSignedIn,
  initFirebaseAuth,
  getUserName,
} from "./firebaseHelperFns";
import MainLeftSection from "./MainLeftSection";
import SignUpModal from "./SignUpModal";
import SignUpFooter from "./SignUpFooter";

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>();

  const navigate = useNavigate();

  const authObserver = (user: any) => {
    if (user) {
      setIsUserSignedIn(true);
      navigate("/home");
    } else {
      setIsUserSignedIn(false);
      navigate("/");
    }
  };

  useEffect(() => {
    initFirebaseAuth(authObserver);
  }, []);
  // SignupModal and SignupFooter need to be conditionally rendered. They are static right now just to test signin pages
  return (
    <div className="main-app-continer">
      <MainLeftSection signedIn={isUserSignedIn} />
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/home" element={<Home />} />
      </Routes>

      <SignUpModal />
      <SignUpFooter />
    </div>
  );
};

export default App;
