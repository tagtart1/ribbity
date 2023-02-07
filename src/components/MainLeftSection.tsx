import MainNavTabsNoAuth from "./MainNavTabsNoAuth";
import MainNavTabsSignedIn from "./MainNavTabsSignedIn";
import { signOutUser } from "./firebaseHelperFns";

import "../styles/MainLeftSection.css";

interface MainNavTabsProps {
  signedIn?: boolean;
}

const MainLeftSection = ({ signedIn }: MainNavTabsProps) => {
  return signedIn ? (
    <div className="main-left-section">
      <div style={{ position: "fixed" }}>
        <MainNavTabsSignedIn />
        <button className="tweet-button-left">Twat</button>
        <button onClick={signOutUser}>Sign Out</button>
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
