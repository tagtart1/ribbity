import { getUserName } from "../scripts/firebaseHelperFns";
import "../styles/ProfilePanel.css";
import ProfilePanelInfo from "./ProfilePanelInfo";
import ProfilePanelNav from "./ProfilePanelNavbar";
import testBanner from "../media/1080x360.jpg";
import { useState } from "react";
import { getUserHandle, getUserInfo } from "../scripts/firebaseHelperFns";
import { DocumentData } from "firebase/firestore";

const ProfilePanel = () => {
  const [user, setUser] = useState<DocumentData | undefined>({});

  const getHandle = async () => {
    const user = await getUserInfo();
    setUser(user);
  };
  getHandle();

  return (
    <div className="profile-panel-container">
      <div className="profile-panel-top-header">
        <div className="back-arrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#EFF3F4"
                d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
              ></path>
            </g>
          </svg>
        </div>
        <div className="username-tweet-count">
          <h1>{getUserName()}</h1>
          <p>6 Tweets</p>
        </div>
      </div>
      <img className="test-box" src={testBanner} alt="test" />
      <ProfilePanelInfo currentUser={user} />
      <ProfilePanelNav />
      <div className="user-twat-feed"></div>
    </div>
  );
};

export default ProfilePanel;
