import HomePanelSearch from "./HomePanelSearch";
import SignUpModal from "./SignUpModal";

interface MainRightSectionProp {
  signedIn?: boolean;
}

const MainRightSection = ({ signedIn }: MainRightSectionProp) => {
  return signedIn ? (
    <div>
      <div style={{ width: 300 }}></div> <HomePanelSearch />
    </div>
  ) : (
    <div>
      <div style={{ width: 300 }}></div>
      <SignUpModal />
    </div>
  );
};

export default MainRightSection;
