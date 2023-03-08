import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ProfilePanelNavbar.css";
import { Link } from "react-router-dom";

const ProfilePanelNavbar = () => {
  const [selectedTab, setSelectedTab] = useState<any>();
  const { handle, tab } = useParams();
  const navigate = useNavigate();

  const handleTabSwitch = (e: any, route: string) => {
    const listItem = e.target.firstChild;

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
        toSelectTab = document.querySelector(".twats-tab");
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
        toSelectTab = document.querySelector(".twats-tab");
    }
    if (toSelectTab) {
      toSelectTab.classList.add("selected-tab-profile");
    }
    setSelectedTab(toSelectTab);
  }, [tab]);

  return (
    <ul className="profile-panel-navbar-container">
      <div onClick={(e) => handleTabSwitch(e, `/${handle}`)}>
        <li className=" twats-tab">Twats</li>
      </div>
      <div onClick={(e) => handleTabSwitch(e, `/${handle}/replies`)}>
        <li className="replies-tab">Replies</li>
      </div>
      <div onClick={(e) => handleTabSwitch(e, `/${handle}/media`)}>
        <li className="media-tab">Media</li>
      </div>

      <div onClick={(e) => handleTabSwitch(e, `/${handle}/likes`)}>
        <li className="likes-tab">Likes</li>
      </div>
    </ul>
  );
};

export default ProfilePanelNavbar;
