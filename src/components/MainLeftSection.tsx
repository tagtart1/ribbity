import MainNavTabsNoAuth from "./MainNavTabsNoAuth";
import MainNavTabsSignedIn from "./MainNavTabsSignedIn";
import { signOutUser } from "../scripts/firebaseHelperFns";
import { useState, useEffect } from "react";
import { getUserHandle } from "../scripts/firebaseHelperFns";

import "../styles/MainLeftSection.css";
import UserTab from "./UserTab";
import TwatPopupInput from "./TwatPopupInput";

interface MainNavTabsProps {
  signedIn?: boolean;
}

const MainLeftSection = ({ signedIn }: MainNavTabsProps) => {
  const [userHandle, setUserHandle] = useState<string>(" ");
  const [showTwatPopup, setShowTwatPopup] = useState<boolean>(false);

  const getHandle = async () => {
    const handle = await getUserHandle();
    setUserHandle(handle);
  };
  getHandle();

  return signedIn ? (
    <div className="main-left-section">
      <TwatPopupInput
        isVisible={showTwatPopup}
        toggleVisibility={setShowTwatPopup}
      />
      <div style={{ position: "fixed" }} className="fixed-left-section">
        <div>
          <MainNavTabsSignedIn userHandle={userHandle} />
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
        <UserTab userHandle={userHandle} />
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
