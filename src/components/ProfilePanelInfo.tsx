import "../styles/ProfilePanelInfo.css";
import testpfp from "../media/randompfp.jpg";
import {
  getProfilePicUrl,
  getUserHandle,
  getUserName,
} from "../scripts/firebaseHelperFns";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProfileActionsButtons from "./ProfileActionsButtons";
import EditProfilePopup from "./EditProfilePopup";

interface ProfilePanelInfoProps {
  user: DocumentData | undefined; // The user of whatever page we are viewing
  currentHandle?: string; // Current handle of the signed in user
}

const ProfilePanelInfo = ({ user, currentHandle }: ProfilePanelInfoProps) => {
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  if (!user) return null;
  return (
    <div className="profile-panel-info-container">
      <div className="profile-info-top">
        <div>
          <div className="profile-img-wrapper">
            <img src={user.profileImgUrl} alt="profile" />
          </div>
        </div>
        {currentHandle ? (
          // Check if the profile we are viewing is ourselves, if so dispaly edit profile, if not display follow button and other actions
          currentHandle === user.userHandle ? (
            <button
              className="edit-profile-button"
              onClick={() => {
                setShowEditProfile(true);
              }}
            >
              Edit Profile
            </button>
          ) : (
            <ProfileActionsButtons />
          )
        ) : null}
      </div>
      <h1>{user.userName}</h1>
      <p className="user-handle">@{user.userHandle}</p>
      <p className="user-bio">{user.bio}</p>
      <p className="user-join-date">
        <svg viewBox="0 0 24 24">
          <g>
            <path
              fill="#64696D"
              d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"
            ></path>
          </g>
        </svg>
        Joined {user.joinDate}
      </p>
      <div className="user-following-nums">
        <span>
          <span style={{ color: "white" }}>19</span> Following
        </span>
        <span>
          <span style={{ color: "white" }}>70</span> Followers
        </span>
      </div>
      <EditProfilePopup
        isVisible={showEditProfile}
        userName={user.userName}
        bio={user.bio}
        location={user.location}
        docId={user.id}
      />
    </div>
  );
};

export default ProfilePanelInfo;
