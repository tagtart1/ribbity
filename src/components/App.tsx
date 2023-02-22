import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HomePanel from "./HomePanel";

import "../styles/App.css";
import { Routes, Route } from "react-router-dom";
import {
  getUserInfo,
  initFirebaseAuth,
  getUserHandle,
} from "../scripts/firebaseHelperFns";
import MainLeftSection from "./MainLeftSection";

import SignUpFooter from "./SignUpFooter";
import ExplorePanel from "./ExplorePanel";
import MainRightSection from "./MainRightSection";
import ProfilePanel from "./ProfilePanel";

// Pass the user info down from here. do not grab handle. pass user info into profile panel and userTabs. this will allow you to check if tweets belong to the signed in user from anywhere

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>();
  const [currentUser, setCurrentUser] = useState<any>();

  const navigate = useNavigate();

  const authObserver = async (user: any) => {
    if (user) {
      setIsUserSignedIn(true);
      getCurrentUser();
    } else {
      setIsUserSignedIn(false);
      setCurrentUser(null);
      navigate("/");
    }
  };

  const getCurrentUser = async () => {
    const handle: string = await getUserHandle();
    const signedUser = await getUserInfo(handle);
    setCurrentUser(signedUser);
  };

  useEffect(() => {
    initFirebaseAuth(authObserver);
  }, []);

  return (
    <div className="main-app-continer">
      <MainLeftSection signedIn={isUserSignedIn} />
      <Routes>
        <Route path="/" element={<ExplorePanel />} />
        <Route path="/home" element={<HomePanel />} />
        <Route path="/explore" element={<ExplorePanel />} />
        <Route
          path="/:id"
          element={<ProfilePanel currentUser={currentUser} />}
        />
      </Routes>

      <MainRightSection signedIn={isUserSignedIn} />

      <SignUpFooter signedIn={isUserSignedIn} />
    </div>
  );
};

export default App;
