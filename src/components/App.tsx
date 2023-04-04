import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HomePanel from "./Panels/Home/HomePanel";
import frogLogo from "../media/froglogo.png";

import "../styles/App.css";
import { Routes, Route } from "react-router-dom";
import {
  getUserInfo,
  initFirebaseAuth,
  getUserHandle,
} from "../scripts/firebaseHelperFns";
/* Components */
import MainLeftSection from "./LeftSideSections/MainLeftSection";
import SignUpFooter from "./NoAuthComponents/SignUpFooter";
import ExplorePanel from "./Panels/Explore/ExplorePanel";
import MainRightSection from "./RightSideSections/MainRightSection";
import ProfilePanel from "./Panels/Profile/ProfilePanel";
import useForceUpdate from "./useForceUpdate";
import TwatPanel from "./Panels/TwatShowcase/TwatPanel";
import UserFollowPanel from "./Panels/Profile/UserFollowingPanel/UserFollowPanel";
import { Toaster } from "react-hot-toast";
import InvalidRoutePanel from "./Misc/InvalidRoutePanel";
import FrogIconLogo from "./Misc/FrogIconLogo";

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
  const [currentUser, setCurrentUser] = useState<userInfo | null>();
  const [showWhoToFollow, setShowWhoToFollow] = useState<boolean>(true);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  const navigate = useNavigate();
  const refresh = useForceUpdate();

  // Fires when the state of the user being signed in changes
  const authObserver = async (user: any) => {
    console.log("authobserver");
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
    setIsLoadingUser(true);
    const handle: string = await getUserHandle();
    if (!handle) return;
    console.log(handle);
    const signedUser = await getUserInfo(handle);
    setCurrentUser(signedUser);
    setIsLoadingUser(false);
  };

  useEffect(() => {
    initFirebaseAuth(authObserver);
  }, []);

  // If users are not signed it they should be replaced by a 'dummy' account that lets them still browse the app. main proble is when a user is created the getCurrentUser is returning null data
  if (isLoadingUser)
    return (
      <div className="loading-user">
        <FrogIconLogo />
      </div>
    );
  if (!currentUser) return null;
  return (
    <div className="main-app-continer">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: `rgb(29, 155, 240)`, color: "#FFF" },

          error: {
            style: {
              background: `rgb(255, 37, 59)`,
            },
          },
        }}
      />
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

        <Route path="*" element={<InvalidRoutePanel />} />
      </Routes>

      <MainRightSection
        signedIn={isUserSignedIn}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        showWhoToFollow={showWhoToFollow}
        setIsLoadingUser={setIsLoadingUser}
      />

      <SignUpFooter signedIn={isUserSignedIn} />
    </div>
  );
};

export default App;
