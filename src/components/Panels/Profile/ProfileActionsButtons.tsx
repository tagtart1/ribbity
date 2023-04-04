import { deleteField, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../scripts/firebaseConfig";
import { getUserHandle, getUserInfo } from "../../../scripts/firebaseHelperFns";
import "../../../styles/ProfileActionsButtons.css";
import UnfollowConfirmation from "../../Misc/UnfollowConfirmation";
import useForceUpdate from "../../useForceUpdate";

interface ProfileActionsButtonsProps {
  userViewing: any;
  mainUser: any;
  refreshUserUI: Function;
}

const ProfileActionsButtons = ({
  userViewing,
  mainUser,
  refreshUserUI,
}: ProfileActionsButtonsProps) => {
  const [beingFollowed, setBeingFollowed] = useState<boolean>(
    userViewing.followers[mainUser.userHandle]
  );

  const [showUnfollowConfirmation, setShowUnfollowConfirmation] =
    useState<boolean>(false);

  const handleFollowAction = async () => {
    if (mainUser.userHandle === userViewing.userHandle) return;
    const followedUserRef = doc(db, "user-info", userViewing.id);
    const followerUserRef = doc(db, "user-info", mainUser.id);

    if (userViewing.followers[mainUser.userHandle]) {
      //Unfollow
      console.log("unfollow");
      setBeingFollowed(false);
      await updateDoc(followedUserRef, {
        [`followers.${mainUser.userHandle}`]: deleteField(),
      });

      await updateDoc(followerUserRef, {
        [`following.${userViewing.userHandle}`]: deleteField(),
      });
    } else {
      //Follow
      setBeingFollowed(true);
      console.log("follow");
      await updateDoc(followedUserRef, {
        [`followers.${mainUser.userHandle}`]: true,
      });

      await updateDoc(followerUserRef, {
        [`following.${userViewing.userHandle}`]: true,
      });
    }
    refreshUserUI();
  };

  return (
    <div className="profile-actions">
      <div className="profile-action-button">
        <svg viewBox="0 0 24 24">
          <g>
            <path
              fill="#EFF3F4"
              d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
            ></path>
          </g>
        </svg>
      </div>
      <div className="profile-action-button">
        <svg viewBox="0 0 24 24">
          <g>
            <path
              fill="#EFF3F4"
              d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"
            ></path>
          </g>
        </svg>
      </div>
      {beingFollowed ? (
        <button
          className="unfollow-user-button"
          onClick={() => {
            setShowUnfollowConfirmation(true);
          }}
          onMouseOver={(e: any) => {
            e.target.textContent = "Unfollow";
          }}
          onMouseOut={(e: any) => {
            e.target.textContent = "Following";
          }}
        >
          Following
        </button>
      ) : (
        <button className="follow-user-button" onClick={handleFollowAction}>
          Follow
        </button>
      )}
      <UnfollowConfirmation
        visibility={showUnfollowConfirmation}
        setVisibility={setShowUnfollowConfirmation}
        confirmationCallback={handleFollowAction}
        userHandle={userViewing.userHandle}
      />
    </div>
  );
};

export default ProfileActionsButtons;
