import "../../styles/UserTab.css";
import { signOutUser } from "../../scripts/firebaseHelperFns";

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
  const toggleLogoutDropdown = () => {
    const dropdown = document.querySelector(".logout-dropdown");

    if (dropdown?.getAttribute("hidden") !== null) {
      dropdown?.removeAttribute("hidden");
      return;
    }

    dropdown?.setAttribute("hidden", "true");
    console.log(dropdown);
  };

  return (
    <div className="user-tab-wrapper">
      <div className="user-tab-container" onClick={toggleLogoutDropdown}>
        <div className="user-tab-left">
          <img
            src={currentUser.profileImgUrl}
            alt="User Profile"
            className="user-tab-profile-image"
          />
          <div>
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
      <div
        style={{ position: "fixed" }}
        hidden={true}
        className="logout-dropdown"
      >
        <button onClick={signOutUser}>Log out {currentUser.userName}</button>
      </div>
    </div>
  );
};

export default UserTab;
