import "../styles/HomePanelNavbar.css";
import { useState, useEffect } from "react";

interface HomePanelNavbarProps {
  setTab: Function;
}

const HomePanelNavbar = ({ setTab }: HomePanelNavbarProps) => {
  const [selectedTab, setSelectedTab] = useState<any>();

  const handleTabSwitch = (e: any) => {
    const listItem = e.target.firstChild;

    if (listItem === selectedTab) return;
    selectedTab?.classList.remove("selected-tab-home");
    listItem.classList.add("selected-tab-home");
    setTab(listItem.textContent);
    setSelectedTab(listItem);
  };

  useEffect(() => {
    setSelectedTab(document.querySelector(".selected-tab-home"));
  }, []);
  return (
    <div>
      <h1 className="home-panel-header-text">Home</h1>

      <ul className="home-panel-navbar">
        <div onClick={handleTabSwitch}>
          <li className="selected-tab-home">For you</li>
        </div>
        <div onClick={handleTabSwitch}>
          <li>Following</li>
        </div>
      </ul>
    </div>
  );
};

export default HomePanelNavbar;
