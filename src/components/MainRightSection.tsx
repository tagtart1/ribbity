import HomePanelSearch from "./HomePanelSearch";
import SignUpModal from "./SignUpModal";
import WhatsHappeningPanel from "./WhatsHappeningPanel";
import "../styles/MainRightSection.css";
import WhoToFollowPanel from "./WhoToFollowPanel";

interface MainRightSectionProp {
  signedIn?: boolean;
}

const MainRightSection = ({ signedIn }: MainRightSectionProp) => {
  // Add the whoToFollow sectoin back and seperate the right panel.css to accomate

  return signedIn ? (
    <div style={{ zIndex: 5 }}>
      <div style={{ width: 300 }}></div>
      <div className="main-right-section-wrapper">
        <HomePanelSearch />

        <WhatsHappeningPanel />
      </div>
    </div>
  ) : (
    <div>
      <div style={{ width: 300 }}></div>
      <SignUpModal />
    </div>
  );
};

export default MainRightSection;
