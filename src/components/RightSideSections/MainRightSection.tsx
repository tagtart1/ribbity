import HomePanelSearch from "../Panels/Home/HomePanelSearch";
import SignUpModal from "../NoAuthComponents/SignUpModal";
import WhatsHappeningPanel from "./WhatsHappeningSection/WhatsHappeningPanel";
import "../../styles/MainRightSection.css";
import WhoToFollowPanel from "./WhoToFollowSection/WhoToFollowPanel";
import MiscLinks from "../Misc/MiscLinks";

interface MainRightSectionProp {
  signedIn?: boolean;
  currentUser: any;
  setCurrentUser: Function;
  showWhoToFollow: boolean;
  setIsLoadingUser: Function;
}

const MainRightSection = ({
  signedIn,
  currentUser,
  setCurrentUser,
  showWhoToFollow,
  setIsLoadingUser,
}: MainRightSectionProp) => {
  // Add the whoToFollow sectoin back and seperate the right panel.css to accomate

  return signedIn ? (
    <div style={{ zIndex: 5 }}>
      <div style={{ width: 300 }}></div>
      <div className="main-right-section-wrapper">
        <HomePanelSearch />
        <div className="side-panels">
          <WhatsHappeningPanel />

          <WhoToFollowPanel
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            isVisible={showWhoToFollow}
          />
          <MiscLinks />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div style={{ width: 300 }}></div>
      <div className="main-right-section-wrapper">
        <div className="side-panels">
          <SignUpModal
            setCurrentUser={setCurrentUser}
            setIsLoadingUser={setIsLoadingUser}
          />
          <WhatsHappeningPanel />
        </div>
      </div>
    </div>
  );
};

export default MainRightSection;
