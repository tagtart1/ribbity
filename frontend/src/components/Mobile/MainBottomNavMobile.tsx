import "../../styles/MainBottomNavMobile.css";
import HomeIcon from "../../media/svg/HomeIcon";
import ProfileIcon from "../../media/svg/ProfileIcon";
import ExploreSearchIcon from "../../media/svg/ExploreSearchIcon";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import { RibbityUser } from "../../Ribbity.types";

interface TabProps {
  tabNum: number;
  Icon: React.ReactNode;
  handleTabSelect: Function;
  activeTab: number;
}

interface AppContextProps {
  mainUser: RibbityUser;
}

const MainBottomNavMobile = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [activeTab, setActiveTab] = useState<number>(-1);
  const { mainUser }: AppContextProps = useContext(AppContext);

  const handleTabSelect = (tabNum: number): void => {
    setActiveTab(tabNum);

    switch (tabNum) {
      case 0:
        navigate("/home");
        break;
      case 1:
        navigate("/explore");
        break;
      case 2:
        navigate(`/${mainUser.userHandle}`);
        break;
    }
  };

  useEffect(() => {
    switch (true) {
      case pathname === "/home":
        setActiveTab(0);
        break;
      case pathname === "/explore":
        setActiveTab(1);
        break;
      case pathname.startsWith(`/${mainUser.userHandle}`):
        setActiveTab(2);
        break;

      default:
        setActiveTab(-1);
    }
  }, [mainUser.userHandle, pathname]);

  return (
    <div className="main-bottom-nav-mobile-container">
      <ul className="main-bottom-nav">
        <Tab
          tabNum={0}
          Icon={<HomeIcon />}
          handleTabSelect={handleTabSelect}
          activeTab={activeTab}
        />
        <Tab
          tabNum={1}
          Icon={<ExploreSearchIcon />}
          handleTabSelect={handleTabSelect}
          activeTab={activeTab}
        />
        <Tab
          tabNum={2}
          Icon={<ProfileIcon />}
          handleTabSelect={handleTabSelect}
          activeTab={activeTab}
        />
      </ul>
    </div>
  );
};

const Tab: React.FC<TabProps> = ({
  tabNum,
  Icon,
  handleTabSelect,
  activeTab,
}) => (
  <li onClick={() => handleTabSelect(tabNum)}>
    <span
      className={
        activeTab === tabNum
          ? "selected-bottom-mobile-tab"
          : "mobile-tab-border"
      }
    >
      {Icon}
    </span>
  </li>
);

export default MainBottomNavMobile;
