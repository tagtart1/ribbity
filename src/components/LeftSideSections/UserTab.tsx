import "../../styles/UserTab.css";
import { useState } from "react";
import LogoutPopup from "./LogoutPopup";
import { RibbityUser } from "../../Ribbity.types";
import RibbityVerifyIcon from "../../media/svg/RibbityVerifyIcon";

interface UserTabProps {
  mainUser: RibbityUser;
}
// This component contains the signed in user's name, handle, and profile image and when clicked will prompt a logout box. Usually is at the bottom left of screen
const UserTab = ({ mainUser }: UserTabProps) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);

  return (
    <div className="user-tab-wrapper">
      <div
        className="user-tab-container"
        onClick={() => setShowLogoutPopup(true)}
      >
        <div className="user-tab-left">
          <img
            src={mainUser.profileImgUrl}
            alt="User Profile"
            className="user-tab-profile-image"
          />
          <div className="names-group">
            <p className="user-name">
              <span className="name"> {mainUser.userName}</span>
              {mainUser.isVerified ? <RibbityVerifyIcon /> : null}{" "}
            </p>
            <p className="ribbity-unique-name">@{mainUser.userHandle}</p>
          </div>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="misc-icon">
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
