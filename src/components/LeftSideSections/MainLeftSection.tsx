import MainNavTabsNoAuth from "../NoAuthComponents/MainNavTabsNoAuth";
import MainNavTabsSignedIn from "./MainNavTabsSignedIn";
import { signOutUser } from "../../scripts/firebaseHelperFns";
import { useState, useEffect } from "react";
import { getUserHandle } from "../../scripts/firebaseHelperFns";

import "../../styles/MainLeftSection.css";
import UserTab from "./UserTab";
import TwatPopupInput from "../Misc/TwatPopupInput";

interface userInfo {
  bio?: string;
  joinDate?: string;
  profileImgUrl?: string;
  userHandle?: string;
  userName?: string;
}

interface MainNavTabsProps {
  currentUser?: userInfo | null;
  signedIn?: boolean;
  refresh: Function;
}

const MainLeftSection = ({
  currentUser,
  signedIn,
  refresh, // Delete maybe soon
}: MainNavTabsProps) => {
  const [showTwatPopup, setShowTwatPopup] = useState<boolean>(false);
  if (!currentUser) return null;
  return signedIn ? (
    <div className="main-left-section">
      <TwatPopupInput
        isVisible={showTwatPopup}
        toggleVisibility={setShowTwatPopup}
        currentUser={currentUser}
        refresh={refresh}
      />
      <div style={{ position: "fixed" }} className="fixed-left-section">
        <div>
          <MainNavTabsSignedIn currentUser={currentUser} />
          <button
            className="tweet-button-left"
            onClick={() => {
              setShowTwatPopup(true);
              document.documentElement.style.overflowY = "hidden";
            }}
          >
            Twat
          </button>
        </div>
        <UserTab currentUser={currentUser} />
      </div>
    </div>
  ) : (
    <div className="main-left-section">
      <div style={{ position: "fixed" }}>
        <MainNavTabsNoAuth />
      </div>
    </div>
  );
};

export default MainLeftSection;
