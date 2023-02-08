import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HomePanel from "./HomePanel";

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
import ExplorePanel from "./ExplorePanel";
import MainRightSection from "./MainRightSection";

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
        <Route path="/" element={<ExplorePanel />} />
        <Route path="/home" element={<HomePanel />} />
        <Route path="/explore" element={<ExplorePanel />} />
      </Routes>

      <MainRightSection signedIn={isUserSignedIn} />

      <SignUpFooter signedIn={isUserSignedIn} />
    </div>
  );
};

export default App;
