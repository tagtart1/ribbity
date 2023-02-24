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

interface userInfo {
  bio?: string;
  joinDate?: string;
  profileImgUrl?: string;
  userHandle?: string;
  userName?: string;
  id?: string;
}

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>();
  const [currentUser, setCurrentUser] = useState<userInfo>();

  const navigate = useNavigate();

  const authObserver = async (user: any) => {
    if (user) {
      setIsUserSignedIn(true);
      getCurrentUser();
    } else {
      setIsUserSignedIn(false);
      setCurrentUser({});
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
      <MainLeftSection currentUser={currentUser} signedIn={isUserSignedIn} />
      <Routes>
        <Route path="/" element={<ExplorePanel />} />
        <Route path="/home" element={<HomePanel />} />
        <Route path="/explore" element={<ExplorePanel />} />
        <Route
          path="/:handle"
          element={
            <ProfilePanel
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
      </Routes>

      <MainRightSection signedIn={isUserSignedIn} />

      <SignUpFooter signedIn={isUserSignedIn} />
    </div>
  );
};

export default App;
