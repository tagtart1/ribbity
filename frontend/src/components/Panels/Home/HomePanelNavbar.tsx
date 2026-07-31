import "../../../styles/HomePanelNavbar.css";
import { useState, useEffect } from "react";
import UserTabMobileFixed from "../../Mobile/UserTabMobileFixed";

interface HomePanelNavbarProps {
  setTab: Function;
}

type ClickDivEvent = React.MouseEvent<HTMLElement>;

const HomePanelNavbar = ({ setTab }: HomePanelNavbarProps) => {
  const [selectedTab, setSelectedTab] = useState<HTMLElement>();

  const handleTabSwitch = (e: ClickDivEvent) => {
    const target = e.target as HTMLElement;
    const listItem = target.firstChild as HTMLElement;

    if (listItem === selectedTab) return;
    selectedTab?.classList.remove("selected-tab-home");
    listItem.classList.add("selected-tab-home");
    setTab(listItem.textContent);
    setSelectedTab(listItem);
  };

  useEffect(() => {
    setSelectedTab(document.querySelector(".selected-tab-home") as HTMLElement);
  }, []);
  return (
    <div className="home-panel-header-container">
      <UserTabMobileFixed />
      <h1 className="home-panel-header-text">Home</h1>
      <nav>
        <ul className="home-panel-navbar">
          <li onClick={handleTabSwitch}>
            <div className="selected-tab-home">For you</div>
          </li>
          <li onClick={handleTabSwitch}>
            <div>Following</div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePanelNavbar;
