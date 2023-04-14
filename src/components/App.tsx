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
import RibbitPanel from "./Panels/RibbitShowcase/RibbitPanel";
import UserFollowPanel from "./Panels/Profile/UserFollowingPanel/UserFollowPanel";
import { Toaster } from "react-hot-toast";
import InvalidRoutePanel from "./Misc/InvalidRoutePanel";
import FrogIconLogo from "./Misc/FrogIconLogo";
import AppContext from "./AppContext";
import MainBottomNavMobile from "./Mobile/MainBottomNavMobile";
import RibbitButtonFixed from "./Mobile/RibbitButtonFixed";

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
  const [mainUser, setMainUser] = useState<userInfo | null>();
  const [showWhoToFollow, setShowWhoToFollow] = useState<boolean>(true);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fires when the state of the user being signed in changes
  const authObserver = async (user: any) => {
    console.log("authobserver");
    if (user) {
      setIsUserSignedIn(true);
      getCurrentUser();
    } else {
      setIsUserSignedIn(false);
      setMainUser({});
    }
  };

  const getCurrentUser = async () => {
    setIsLoadingUser(true);
    const handle: string = await getUserHandle();
    if (!handle) return;
    console.log(handle);
    const signedUser = await getUserInfo(handle);
    setMainUser(signedUser);
    setIsLoadingUser(false);
  };

  useEffect(() => {
    initFirebaseAuth(authObserver);
  }, []);

  const loadingHandler = (value: boolean) => {
    setIsLoadingUser(value);
  };

  // If users are not signed it they should be replaced by a 'dummy' account that lets them still browse the app. main proble is when a user is created the getCurrentUser is returning null data
  if (isLoadingUser)
    return (
      <div className="loading-user">
        <FrogIconLogo />
      </div>
    );
  if (!mainUser) return null;
  return (
    <AppContext.Provider value={{ mainUser, loadingHandler, setMainUser }}>
      <div className="main-app-continer">
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { background: `rgb(51, 190, 109)`, color: "#FFF" },

            error: {
              style: {
                background: `rgb(255, 37, 59)`,
              },
            },
          }}
        />
        <MainLeftSection currentUser={mainUser} signedIn={isUserSignedIn} />
        <Routes>
          <Route path="/" element={<ExplorePanel />} />
          <Route path="/home" element={<HomePanel currentUser={mainUser} />} />
          <Route path="/explore" element={<ExplorePanel />} />
          <Route
            path="/:handle"
            element={
              <ProfilePanel
                currentUser={mainUser}
                setCurrentUser={setMainUser}
                setShowWhoToFollow={setShowWhoToFollow}
              />
            }
          />
          <Route
            path="/:handle/:tab"
            element={
              <ProfilePanel
                currentUser={mainUser}
                setCurrentUser={setMainUser}
                setShowWhoToFollow={setShowWhoToFollow}
              />
            }
          />
          <Route
            path="/:handle/ribbit/:ribbitId"
            element={<RibbitPanel mainUser={mainUser} />}
          />

          <Route
            path="/:handle/followers"
            element={
              <UserFollowPanel startTab="followers" mainUser={mainUser} />
            }
          />
          <Route
            path="/:handle/following"
            element={
              <UserFollowPanel startTab="following" mainUser={mainUser} />
            }
          />

          <Route path="*" element={<InvalidRoutePanel />} />
        </Routes>

        <MainRightSection
          signedIn={isUserSignedIn}
          currentUser={mainUser}
          setCurrentUser={setMainUser}
          showWhoToFollow={showWhoToFollow}
          setIsLoadingUser={setIsLoadingUser}
        />

        <SignUpFooter signedIn={isUserSignedIn} />
      </div>
      <MainBottomNavMobile />
      <RibbitButtonFixed mainUser={mainUser} />
    </AppContext.Provider>
  );
};

export default App;
