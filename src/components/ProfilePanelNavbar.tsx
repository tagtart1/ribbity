import { useState, useEffect } from "react";
import "../styles/ProfilePanelNavbar.css";

const ProfilePanelNavbar = () => {
  const [selectedTab, setSelectedTab] = useState<any>();

  const handleTabSwitch = (e: any) => {
    const listItem = e.target.firstChild;

    if (listItem === selectedTab) return;
    selectedTab?.classList.remove("selected-tab-profile");
    listItem.classList.add("selected-tab-profile");

    setSelectedTab(listItem);
  };

  useEffect(() => {
    setSelectedTab(document.querySelector(".selected-tab-profile"));
  }, []);
  return (
    <ul className="profile-panel-navbar-container">
      <div onClick={handleTabSwitch}>
        <li className="selected-tab-profile">Twats</li>
      </div>
      <div onClick={handleTabSwitch}>
        <li>Twats & replies</li>
      </div>
      <div onClick={handleTabSwitch}>
        <li>Media</li>
      </div>
      <div onClick={handleTabSwitch}>
        <li>Likes</li>
      </div>
    </ul>
  );
};

export default ProfilePanelNavbar;
