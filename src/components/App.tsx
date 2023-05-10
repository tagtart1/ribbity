import { useEffect, useState } from "react";

import HomePanel from "./Panels/Home/HomePanel";

import "../styles/App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import RibbitPanel from "./Panels/RibbitShowcase/RibbitPanel";
import UserFollowPanel from "./Panels/Profile/UserFollowingPanel/UserFollowPanel";
import { Toaster } from "react-hot-toast";
import InvalidRoutePanel from "./Misc/InvalidRoutePanel";
import FrogIconLogo from "./Misc/FrogIconLogo";
import AppContext from "./AppContext";
import MainBottomNavMobile from "./Mobile/MainBottomNavMobile";

import { RibbityUser } from "../Ribbity.types";

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>(false);
  const [mainUser, setMainUser] = useState<RibbityUser | null>();
  const [showWhoToFollow, setShowWhoToFollow] = useState<boolean>(true);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  const navigate = useNavigate();

  const blankUser: RibbityUser = {
    bannerImgPath: "",
    bannerImgUrl: "",
    bio: "",
    followers: {},
    following: {},
    id: "",
    joinDate: "",
    location: "",
    profileImgPath: "",
    profileImgUrl: "",
    userHandle: "",
    userName: "",
    isVerified: false,
  };
  // Fires when the state of the user being signed in changes
  const authObserver = async (user: any) => {
    if (user) {
      setIsUserSignedIn(true);
      getCurrentUser();
    } else {
      setIsUserSignedIn(false);
      if (window.location.pathname === "/home") {
        navigate("/");
      }
      setMainUser(blankUser);
    }
  };

  const getCurrentUser = async (): Promise<void> => {
    setIsLoadingUser(true);
    const handle: string = await getUserHandle();
    if (!handle) return;

    const signedUser: RibbityUser = await getUserInfo(handle);
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
        <MainLeftSection mainUser={mainUser} signedIn={isUserSignedIn} />
        <Routes>
          <Route path="/" element={<ExplorePanel mainUser={mainUser} />} />
          <Route path="/home" element={<HomePanel mainUser={mainUser} />} />
          <Route
            path="/explore"
            element={<ExplorePanel mainUser={mainUser} />}
          />
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

          <Route
            path="/notifications"
            element={<InvalidRoutePanel isWorkInProgress={true} />}
          />
          <Route
            path="/messages"
            element={<InvalidRoutePanel isWorkInProgress={true} />}
          />
          <Route
            path="/bookmarks"
            element={<InvalidRoutePanel isWorkInProgress={true} />}
          />

          <Route path="*" element={<InvalidRoutePanel />} />
        </Routes>

        <MainRightSection
          signedIn={isUserSignedIn}
          mainUser={mainUser}
          setCurrentUser={setMainUser}
          showWhoToFollow={showWhoToFollow}
          setIsLoadingUser={setIsLoadingUser}
        />

        <SignUpFooter signedIn={isUserSignedIn} />
      </div>
      <MainBottomNavMobile />
    </AppContext.Provider>
  );
};

export default App;
