import { MouseEventHandler, useEffect, useState } from "react";
import "../../../styles/ExplorePanelNavbar.css";

interface ExplorePanelNavbarProps {
  setActiveTab: Function;
}

const ExplorePanelNavbar = ({ setActiveTab }: ExplorePanelNavbarProps) => {
  const [selectedTab, setSelectedTab] = useState<Element | null>();

  const handleTabSwitch = (e: any, tabNum: number) => {
    const listItem: Element = e.target.firstChild;

    if (listItem === selectedTab) return;
    selectedTab?.classList.remove("selected-tab");
    listItem.classList.add("selected-tab");

    setSelectedTab(listItem);
    setActiveTab(tabNum);
  };

  useEffect(() => {
    setSelectedTab(document.querySelector(".selected-tab"));
  }, []);

  return (
    <ul className="explore-panel-navbar-container">
      <div onClick={(e) => handleTabSwitch(e, 0)}>
        <li className="selected-tab">For you</li>
      </div>
      <div onClick={(e) => handleTabSwitch(e, 1)}>
        <li>Trending</li>
      </div>
      <div onClick={(e) => handleTabSwitch(e, 2)}>
        <li>News</li>
      </div>
      <div onClick={(e) => handleTabSwitch(e, 3)}>
        <li>Sports</li>
      </div>
      <div onClick={(e) => handleTabSwitch(e, 4)}>
        <li>Entertainment</li>
      </div>
    </ul>
  );
};

export default ExplorePanelNavbar;
