import "../../styles/UserTab.css";
import { signOutUser } from "../../scripts/firebaseHelperFns";
import { useState } from "react";
import LogoutPopup from "./LogoutPopup";

interface userInfo {
  bio?: string;
  joinDate?: string;
  profileImgUrl?: string;
  userHandle?: string;
  userName?: string;
}

interface UserTabProps {
  currentUser: userInfo;
}

const UserTab = ({ currentUser }: UserTabProps) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);

  return (
    <div className="user-tab-wrapper">
      <div
        className="user-tab-container"
        onClick={() => setShowLogoutPopup(true)}
      >
        <div className="user-tab-left">
          <img
            src={currentUser.profileImgUrl}
            alt="User Profile"
            className="user-tab-profile-image"
          />
          <div className="names-group">
            <p>{currentUser.userName}</p>
            <p className="tweeter-unique-name">@{currentUser.userHandle}</p>
          </div>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g>
            <path
              fill="#E7E9EA"
              d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
            ></path>
          </g>
        </svg>
      </div>
      <LogoutPopup
        isVisible={showLogoutPopup}
        setVisibility={setShowLogoutPopup}
      />
    </div>
  );
};

export default UserTab;
