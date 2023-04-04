import { MouseEventHandler, useEffect, useState } from "react";
import "../../../styles/ExplorePanelNavbar.css";

const ExplorePanelNavbar = () => {
  const [selectedTab, setSelectedTab] = useState<Element | null>();

  const handleTabSwitch = (e: any) => {
    const listItem: Element = e.target.firstChild;

    if (listItem === selectedTab) return;
    selectedTab?.classList.remove("selected-tab");
    listItem.classList.add("selected-tab");

    setSelectedTab(listItem);
  };

  useEffect(() => {
    setSelectedTab(document.querySelector(".selected-tab"));
  }, []);

  return (
    <ul className="explore-panel-navbar-container">
      <div onClick={handleTabSwitch}>
        <li className="selected-tab">For you</li>
      </div>
      <div onClick={handleTabSwitch}>
        <li>Trending</li>
      </div>
      <div onClick={handleTabSwitch}>
        <li>News</li>
      </div>
      <div onClick={handleTabSwitch}>
        <li>Sports</li>
      </div>
      <div onClick={handleTabSwitch}>
        <li>Entertainment</li>
      </div>
    </ul>
  );
};

export default ExplorePanelNavbar;
