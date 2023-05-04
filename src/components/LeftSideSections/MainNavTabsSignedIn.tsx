import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FrogIconLogo from "../Misc/FrogIconLogo";
import HomeIcon from "../../media/svg/HomeIcon";
import ExploreHashtagIcon from "../../media/svg/ExploreHashtagIcon";
import NotifcationsIcon from "../../media/svg/NotificationsIcon";
import MessagesIcon from "../../media/svg/MessagesIcon";
import BookmarksIcon from "../../media/svg/BookmarksIcon";
import ProfileIcon from "../../media/svg/ProfileIcon";
import { RibbityUser } from "../../Ribbity.types";
import RibbityGreenPopup from "../Misc/RibbityGreenPopup";

interface MainNavTabsProps {
  mainUser: RibbityUser;
}

const MainNavTabsSignedIn = ({ mainUser }: MainNavTabsProps) => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const pathname: string = window.location.pathname;
  const [openRibbityGreenPopup, setOpenRibbityGreenPopup] =
    useState<boolean>(false);

  // Set the active tab when we refresh by checking the url
  useEffect(() => {
    switch (pathname) {
      case "/home":
        setActiveTab(0);
        break;
      case "/explore":
        setActiveTab(1);
        break;
      case "/notifications":
        setActiveTab(2);
        break;
      case "/messages":
        setActiveTab(3);
        break;
      case "/bookmarks":
        setActiveTab(4);
        break;
      case `/${mainUser.userHandle}`:
        setActiveTab(6);
        break;
      case `/${mainUser.userHandle}/replies`:
        setActiveTab(6);
        break;
      case `/${mainUser.userHandle}/media`:
        setActiveTab(6);
        break;
      case `/${mainUser.userHandle}/likes`:
        setActiveTab(6);
        break;
      default:
        setActiveTab(null);
    }
  }, [pathname, mainUser.userHandle]);

  return (
    <ul className="main-nav-tabs-list">
      <li className="logo-item">
        <FrogIconLogo />
      </li>

      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        icon={<HomeIcon />}
        title="Home"
        tabNum={0}
        linkTo="/home"
      />

      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        icon={<ExploreHashtagIcon />}
        title="Explore"
        tabNum={1}
        linkTo="/explore"
      />

      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        icon={<NotifcationsIcon />}
        title="Notifications"
        tabNum={2}
        linkTo="/notifications"
      />

      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        icon={<MessagesIcon />}
        title="Messages"
        tabNum={3}
        linkTo="/messages"
      />

      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        icon={<BookmarksIcon />}
        title="Bookmarks"
        tabNum={4}
        linkTo="/bookmarks"
      />

      <li
        className="tab-list-item"
        onClick={() => setOpenRibbityGreenPopup(true)}
      >
        <div className="tab-items">
          <FrogIconLogo />
          <p>Ribbity Green</p>
        </div>
      </li>

      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        icon={<ProfileIcon />}
        title="Profile"
        tabNum={6}
        linkTo={`/${mainUser.userHandle}`}
      />

      <li className="tab-list-item">
        <div className="tab-items">
          <svg viewBox="0 0 24 24">
            <g>
              <path
                fill="#ececec"
                d="M3.75 12c0-4.56 3.69-8.25 8.25-8.25s8.25 3.69 8.25 8.25-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12zM12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-4.75 11.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25S6 11.31 6 12s.56 1.25 1.25 1.25zm9.5 0c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zM13.25 12c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25z"
              ></path>
            </g>
          </svg>
          <p>More</p>
        </div>
      </li>
      <RibbityGreenPopup
        isVisible={openRibbityGreenPopup}
        setOwnVisibility={setOpenRibbityGreenPopup}
      />
    </ul>
  );
};

interface TabProps {
  icon: any;
  activeTab: number | null;
  setActiveTab: Function;
  tabNum: number;
  title: string;
  linkTo: string;
}

const Tab = ({
  icon,
  activeTab,
  setActiveTab,
  tabNum,
  title,
  linkTo,
}: TabProps) => {
  return (
    <li className="tab-list-item" onClick={() => setActiveTab(tabNum)}>
      <Link to={linkTo}>
        <div className="tab-items">
          {icon}
          {activeTab === tabNum ? (
            <p style={{ fontWeight: "900" }}>{title}</p>
          ) : (
            <p>{title}</p>
          )}
        </div>
      </Link>
    </li>
  );
};

export default MainNavTabsSignedIn;
