import { useState, useRef } from "react";
import "../../styles/ToggleFollowButton.css";
import UnfollowConfirmation from "./UnfollowConfirmation";
import { updateDoc, doc, deleteField } from "firebase/firestore";
import { db } from "../../scripts/firebaseConfig";

interface ToggleFollowButtonProps {
  mainUser: any;
  userInfo: any;
}

const ToggleFollowButton = ({
  mainUser,
  userInfo,
}: ToggleFollowButtonProps) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const userRef = doc(db, "user-info", userInfo.id);
  let mainRef: any = "";
  if (mainUser.id) mainRef = doc(db, "user-info", mainUser.id);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    userInfo.followers[mainUser.userHandle]
  );

  const unfollowUser = async () => {
    setIsFollowing(false);
    await updateDoc(userRef, {
      [`followers.${mainUser.userHandle}`]: deleteField(),
    });

    await updateDoc(mainRef, {
      [`following.${userInfo.userHandle}`]: deleteField(),
    });
  };

  const followUser = async () => {
    setIsFollowing(true);
    await updateDoc(userRef, {
      [`followers.${mainUser.userHandle}`]: true,
    });

    await updateDoc(mainRef, {
      [`following.${userInfo.userHandle}`]: true,
    });
  };

  if (mainUser.userHandle === userInfo.userHandle) return null;

  return (
    <div>
      {isFollowing ? (
        <button
          className="toggle-follow-button-unfollow"
          onMouseOver={(e: any) => (e.target.textContent = "Unfollow")}
          onMouseOut={(e: any) => {
            e.target.textContent = "Following";
          }}
          onClick={() => setVisibility(true)}
        >
          Following
        </button>
      ) : (
        <button className="toggle-follow-button-follow " onClick={followUser}>
          Follow
        </button>
      )}
      <UnfollowConfirmation
        visibility={visibility}
        setVisibility={setVisibility}
        userHandle={userInfo.userHandle}
        confirmationCallback={unfollowUser}
      />
    </div>
  );
};

export default ToggleFollowButton;
