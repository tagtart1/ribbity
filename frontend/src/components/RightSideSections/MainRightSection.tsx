import HomePanelSearch from "../Panels/Home/HomePanelSearch";
import SignUpModal from "../NoAuthComponents/SignUpModal";
import WhatsHappeningPanel from "./WhatsHappeningSection/WhatsHappeningPanel";
import "../../styles/MainRightSection.css";
import WhoToFollowPanel from "./WhoToFollowSection/WhoToFollowPanel";
import MiscLinks from "../Misc/MiscLinks";
import { RibbityUser } from "../../Ribbity.types";

interface MainRightSectionProp {
  signedIn?: boolean;
  mainUser: RibbityUser;
  setCurrentUser: Function;
  showWhoToFollow: boolean;
  setIsLoadingUser: Function;
}

const MainRightSection = ({
  signedIn,
  mainUser,
  setCurrentUser,
  showWhoToFollow,
  setIsLoadingUser,
}: MainRightSectionProp) => {
  // Add the whoToFollow sectoin back and seperate the right panel.css to accomate

  return signedIn ? (
    <div style={{ zIndex: 5 }}>
      <div className="main-right-section-wrapper">
        <HomePanelSearch />
        <div className="side-panels">
          <WhatsHappeningPanel />

          <WhoToFollowPanel mainUser={mainUser} isVisible={showWhoToFollow} />
          <MiscLinks />
        </div>
      </div>
    </div>
  ) : (
    <div>
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
