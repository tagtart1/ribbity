import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import "../../../styles/ProfilePanelNavbar.css";

type ClickDivEvent = React.MouseEvent<HTMLElement>;

const ProfilePanelNavbar = () => {
  const [selectedTab, setSelectedTab] = useState<HTMLElement>();
  const { handle, tab } = useParams();
  const navigate: NavigateFunction = useNavigate();

  const handleTabSwitch = (e: ClickDivEvent, route: string) => {
    const target = e.target as HTMLElement;
    const listItem = target.firstChild as HTMLElement;

    if (listItem === selectedTab) return;
    selectedTab?.classList.remove("selected-tab-profile");
    listItem.classList.add("selected-tab-profile");
    navigate(route);
    setSelectedTab(listItem);
  };

  useEffect(() => {
    // Set the start tab based on the param
    selectedTab?.classList.remove("selected-tab-profile");
    let toSelectTab: any;
    switch (tab) {
      case "":
        toSelectTab = document.querySelector(".ribbits-tab");
        break;
      case "replies":
        toSelectTab = document.querySelector(".replies-tab");
        break;
      case "media":
        toSelectTab = document.querySelector(".media-tab");
        break;
      case "likes":
        toSelectTab = document.querySelector(".likes-tab");
        break;
      default:
        toSelectTab = document.querySelector(".ribbits-tab");
    }
    if (toSelectTab) {
      toSelectTab.classList.add("selected-tab-profile");
    }
    setSelectedTab(toSelectTab);
  }, [tab]);

  return (
    <ul className="profile-panel-navbar-container">
      <li onClick={(e) => handleTabSwitch(e, `/${handle}`)}>
        <div className=" ribbits-tab">Ribbits</div>
      </li>
      <li onClick={(e) => handleTabSwitch(e, `/${handle}/replies`)}>
        <div className="replies-tab">Replies</div>
      </li>
      <li onClick={(e) => handleTabSwitch(e, `/${handle}/media`)}>
        <div className="media-tab">Media</div>
      </li>

      <li onClick={(e) => handleTabSwitch(e, `/${handle}/likes`)}>
        <div className="likes-tab">Likes</div>
      </li>
    </ul>
  );
};

export default ProfilePanelNavbar;
