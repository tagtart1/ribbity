import "../../styles/MainBottomNavMobile.css";
import HomeIcon from "../../media/svg/HomeIcon";
import ProfileIcon from "../../media/svg/ProfileIcon";
import ExploreSearchIcon from "../../media/svg/ExploreSearchIcon";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../AppContext";

interface TabProps {
  tabNum: number;
  Icon: any;
  handleTabSelect: Function;
  activeTab: number;
}

const MainBottomNavMobile = () => {
  const navigate = useNavigate();
  const { handle } = useParams();
  const [activeTab, setActiveTab] = useState<number>(-1);
  const { mainUser }: any = useContext(AppContext);

  const handleTabSelect = (tabNum: number) => {
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
    switch (window.location.pathname) {
      case "/home":
        setActiveTab(0);
        break;
      case "/explore":
        setActiveTab(1);
        break;
      case `/${mainUser.userHandle}`:
        setActiveTab(2);
    }
  }, [mainUser.userHandle]);

  return (
    <div className="main-bottom-nav-mobile-container">
      <ul className="main-bottom-nav">
        <Tab
          tabNum={0}
          Icon={HomeIcon}
          handleTabSelect={handleTabSelect}
          activeTab={activeTab}
        />
        <Tab
          tabNum={1}
          Icon={ExploreSearchIcon}
          handleTabSelect={handleTabSelect}
          activeTab={activeTab}
        />
        <Tab
          tabNum={2}
          Icon={ProfileIcon}
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
      <Icon />
    </span>
  </li>
);

export default MainBottomNavMobile;
