import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HomePanel from "./HomePanel";

import "../styles/App.css";
import { Routes, Route } from "react-router-dom";
import {
  getUserInfo,
  initFirebaseAuth,
  getUserHandle,
} from "../scripts/firebaseHelperFns";
/* Components */
import MainLeftSection from "./MainLeftSection";
import SignUpFooter from "./SignUpFooter";
import ExplorePanel from "./ExplorePanel";
import MainRightSection from "./MainRightSection";
import ProfilePanel from "./ProfilePanel";
import useForceUpdate from "./useForceUpdate";
import TwatPanel from "./TwatPanel";
import UserFollowPanel from "./UserFollowPanel";

interface userInfo {
  bio?: string;
  joinDate?: string;
  profileImgUrl?: string;
  userHandle?: string;
  userName?: string;
  location?: string;
  id?: string;
  following?: {
    [key: string]: boolean;
  };
}

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>();
  const [currentUser, setCurrentUser] = useState<userInfo>();
  const [showWhoToFollow, setShowWhoToFollow] = useState<boolean>(true);

  const navigate = useNavigate();
  const refresh = useForceUpdate();

  // Fires when the state of the user being signed in changes
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
    console.log(handle);
    const signedUser = await getUserInfo(handle);
    setCurrentUser(signedUser);
  };

  useEffect(() => {
    initFirebaseAuth(authObserver);
  }, []);
  if (!currentUser) return null;
  return (
    <div className="main-app-continer">
      <MainLeftSection
        currentUser={currentUser}
        signedIn={isUserSignedIn}
        refresh={refresh}
      />
      <Routes>
        <Route path="/" element={<ExplorePanel />} />
        <Route path="/home" element={<HomePanel currentUser={currentUser} />} />
        <Route path="/explore" element={<ExplorePanel />} />
        <Route
          path="/:handle"
          element={
            <ProfilePanel
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setShowWhoToFollow={setShowWhoToFollow}
            />
          }
        />
        <Route
          path="/:handle/:tab"
          element={
            <ProfilePanel
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setShowWhoToFollow={setShowWhoToFollow}
            />
          }
        />
        <Route
          path="/:handle/twat/:twatId"
          element={<TwatPanel mainUser={currentUser} />}
        />

        <Route
          path="/:handle/followers"
          element={
            <UserFollowPanel startTab="followers" mainUser={currentUser} />
          }
        />
        <Route
          path="/:handle/following"
          element={
            <UserFollowPanel startTab="following" mainUser={currentUser} />
          }
        />
      </Routes>

      <MainRightSection
        signedIn={isUserSignedIn}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        showWhoToFollow={showWhoToFollow}
      />

      <SignUpFooter signedIn={isUserSignedIn} />
    </div>
  );
};

export default App;
