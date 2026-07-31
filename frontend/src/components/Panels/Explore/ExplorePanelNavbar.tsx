import { useEffect, useState } from "react";
import "../../../styles/ExplorePanelNavbar.css";

interface ExplorePanelNavbarProps {
  setActiveTab: Function;
}

type ClickListEvent = React.MouseEvent<HTMLElement>;

const ExplorePanelNavbar = ({ setActiveTab }: ExplorePanelNavbarProps) => {
  const [selectedTab, setSelectedTab] = useState<Element | null>();

  const handleTabSwitch = (e: ClickListEvent, tabNum: number) => {
    const target = e.target as HTMLElement;
    const listItem = target.firstChild as Element;

    if (listItem === selectedTab || !listItem) return;
    selectedTab?.classList.remove("selected-tab");
    listItem.classList.add("selected-tab");

    setSelectedTab(listItem);
    setActiveTab(tabNum);
  };

  useEffect(() => {
    setSelectedTab(document.querySelector(".selected-tab"));
  }, []);

  return (
    <nav>
      <ul className="explore-panel-navbar-container">
        <li onClick={(e: ClickListEvent) => handleTabSwitch(e, 0)}>
          <div className="selected-tab">For you</div>
        </li>
        <li onClick={(e: ClickListEvent) => handleTabSwitch(e, 1)}>
          <div>Trending</div>
        </li>
        <li onClick={(e: ClickListEvent) => handleTabSwitch(e, 2)}>
          <div>News</div>
        </li>
        <li onClick={(e: ClickListEvent) => handleTabSwitch(e, 3)}>
          <div>Sports</div>
        </li>
        <li onClick={(e: ClickListEvent) => handleTabSwitch(e, 4)}>
          <div>Entertainment</div>
        </li>
      </ul>
    </nav>
  );
};

export default ExplorePanelNavbar;
