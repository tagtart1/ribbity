import "../../../styles/ProfilePanelInfo.css";

import ProfileActionsButtons from "./ProfileActionsButtons";
import EditProfilePopup from "./EditProfilePopup";

import { Link } from "react-router-dom";
import { RibbityUser } from "../../../Ribbity.types";
import RibbityVerifyIcon from "../../../media/svg/RibbityVerifyIcon";
import SignupPopup from "../../NoAuthComponents/SignupPopup";
import { useState } from "react";

interface ProfilePanelInfoProps {
  visitedUser: RibbityUser; // The user of whatever page we are viewing
  currentUser: RibbityUser; // Current handle of the signed in user
  showEditPopup: boolean;
  setEditPopup: Function;
  updateChanges: Function;
  refreshUserUI: Function;
}

const ProfilePanelInfo = ({
  visitedUser,
  currentUser,
  setEditPopup,
  showEditPopup,
  updateChanges,
  refreshUserUI,
}: ProfilePanelInfoProps) => {
  const [showSignupPopup, setShowSignupPopup] = useState<boolean>(false);

  if (!visitedUser) return null;

  const handleNavigate = (e: any) => {
    // Do not navigate if the user is not signed in
    if (!currentUser.userHandle) {
      e.preventDefault();
      setShowSignupPopup(true);
    }
  };

  return (
    <div className="profile-panel-info-container">
      <div className="profile-info-top">
        <div className="profile-img-wrapper">
          <img src={visitedUser.profileImgUrl} alt="profile" />
        </div>

        {currentUser.userHandle === visitedUser.userHandle ? (
          <button
            className="edit-profile-button"
            onClick={() => {
              setEditPopup(true);
            }}
          >
            Edit profile
          </button>
        ) : (
          <ProfileActionsButtons
            userViewing={visitedUser}
            mainUser={currentUser}
            refreshUserUI={refreshUserUI}
          />
        )}
      </div>
      <h1 className="user-name">
        {visitedUser.userName}
        {visitedUser.userHandle === currentUser.userHandle ? (
          currentUser.isVerified ? (
            <span className="verified-icon">
              <RibbityVerifyIcon />
            </span>
          ) : null
        ) : visitedUser.isVerified ? (
          <span className="verified-icon">
            <RibbityVerifyIcon />
          </span>
        ) : null}
      </h1>

      <p className="user-handle">@{visitedUser.userHandle}</p>
      <p className="user-bio">{visitedUser.bio}</p>
      <div className="misc-user-info">
        {visitedUser.location ? (
          <p className="user-location">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path
                  fill="#64696D"
                  d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"
                ></path>
              </g>
            </svg>
            {visitedUser.location}
          </p>
        ) : null}

        <p className="user-join-date">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#64696D"
                d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"
              ></path>
            </g>
          </svg>
          Joined {visitedUser.joinDate}
        </p>
      </div>
      <div className="user-following-nums">
        <Link
          to={`/${visitedUser.userHandle}/following`}
          onClick={handleNavigate}
        >
          <span style={{ color: "white" }}>
            {visitedUser.following
              ? Object.keys(visitedUser.following).length - 1
              : null}
          </span>{" "}
          Following
        </Link>
        <Link
          to={`/${visitedUser.userHandle}/followers`}
          onClick={handleNavigate}
        >
          <span style={{ color: "white" }}>
            {visitedUser.followers
              ? Object.keys(visitedUser.followers).length
              : null}
          </span>{" "}
          Followers
        </Link>
      </div>
      <EditProfilePopup
        isVisible={showEditPopup}
        userName={visitedUser.userName}
        bio={visitedUser.bio}
        location={visitedUser.location}
        docId={visitedUser.id}
        profileImg={visitedUser.profileImgUrl}
        setShowEditProfile={setEditPopup}
        updateChanges={updateChanges}
        profileImgPath={visitedUser.profileImgPath}
        bannerImg={visitedUser.bannerImgUrl}
        bannerImgPath={visitedUser.bannerImgPath}
      />
      <SignupPopup
        visibility={showSignupPopup}
        setOwnVisibility={setShowSignupPopup}
        userName={visitedUser.userName}
        popupType="invalidRoute"
      />
    </div>
  );
};

export default ProfilePanelInfo;
