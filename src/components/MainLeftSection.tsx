import MainNavTabsNoAuth from "./MainNavTabsNoAuth";
import MainNavTabsSignedIn from "./MainNavTabsSignedIn";
import { signOutUser } from "./firebaseHelperFns";

import "../styles/MainLeftSection.css";
import UserTab from "./UserTab";

interface MainNavTabsProps {
  signedIn?: boolean;
}

const MainLeftSection = ({ signedIn }: MainNavTabsProps) => {
  return signedIn ? (
    <div className="main-left-section">
      <div style={{ position: "fixed" }} className="fixed-left-section">
        <div>
          <MainNavTabsSignedIn />
          <button className="tweet-button-left">Twat</button>
        </div>
        <UserTab />
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
