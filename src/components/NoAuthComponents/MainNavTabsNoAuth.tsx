import { NavigateFunction, useNavigate } from "react-router-dom";
import "../../styles/MainNavTabs.css";
import { useState, useEffect } from "react";
import FrogIconLogo from "../Misc/FrogIconLogo";

// Type aliases
type ClickListEvent = React.MouseEvent<HTMLElement>;

// The left side navbar for when user is not signed in
const MainNavTabsNoAuth = () => {
  const [selectedTab, setSelectedTab] = useState<HTMLElement>();

  const navigate: NavigateFunction = useNavigate();

  const handleTabSwitch = (e: ClickListEvent) => {
    const target = e.target as HTMLElement;
    if (!target.firstChild) return;
    const trueTarget = target.firstChild.lastChild as HTMLElement;

    if (trueTarget === selectedTab) return;
    if (selectedTab) selectedTab.classList.remove("left-section-tab-selected");
    trueTarget.classList.add("left-section-tab-selected");

    setSelectedTab(trueTarget);
  };

  useEffect(() => {
    setSelectedTab(
      document.querySelector(".left-section-tab-selected") as HTMLElement
    );
  }, []);

  return (
    <nav>
      <ul className="main-nav-tabs-list-no-auth">
        <li className="logo-item">
          <FrogIconLogo />
        </li>

        <li
          className="tab-list-item"
          onClick={(e) => {
            handleTabSwitch(e);
            navigate("/");
          }}
        >
          <div className="tab-items">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path
                  fill="#ececec"
                  d="M10.64 3.157l-.36 3.593h4.99l.38-3.892 2.99.299-.36 3.593h2.97v2.5h-3.22l-.55 5.5h2.77v2.5h-3.02l-.39 3.892-2.98-.299.36-3.593H9.23l-.39 3.892-2.98-.299.36-3.593H2.75v-2.5h3.72l.55-5.5H3.75v-2.5h3.52l.38-3.892 2.99.299zm3.83 11.593l.55-5.5h-4.99l-.55 5.5h4.99z"
                ></path>
              </g>
            </svg>
            <p className="left-section-tab-selected">Explore</p>
          </div>
        </li>
        <li className="tab-list-item" onClick={handleTabSwitch}>
          <div className="tab-items">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path
                  fill="#ececec"
                  d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"
                ></path>
              </g>
            </svg>

            <p>Settings</p>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavTabsNoAuth;
