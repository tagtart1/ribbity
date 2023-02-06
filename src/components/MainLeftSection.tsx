import MainNavTabsNoAuth from "./MainNavTabsNoAuth";
import MainNavTabsSignedIn from "./MainNavTabsSignedIn";

import "../styles/MainLeftSection.css";

interface MainNavTabsProps {
  signedIn?: boolean;
}

const MainLeftSection = ({ signedIn }: MainNavTabsProps) => {
  return signedIn ? (
    <div className="main-left-container-signedin">
      <MainNavTabsSignedIn />
      <div style={{ position: "relative" }}>
        <button className="tweet-button-left" style={{ position: "fixed" }}>
          poop
        </button>
      </div>
    </div>
  ) : (
    <MainNavTabsNoAuth />
  );
};

export default MainLeftSection;
