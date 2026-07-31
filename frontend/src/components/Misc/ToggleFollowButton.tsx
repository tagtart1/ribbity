import { useState } from "react";
import "../../styles/ToggleFollowButton.css";
import UnfollowConfirmation from "./UnfollowConfirmation";
import {
  updateDoc,
  doc,
  deleteField,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../scripts/firebaseConfig";
import { RibbityUser } from "../../Ribbity.types";

interface ToggleFollowButtonProps {
  mainUser: RibbityUser;
  userInfo: RibbityUser;
}

// Type aliases
type DocRef = DocumentReference<DocumentData>;
// The standard follow button that goes on the whoToFollow panel and user profile panels
const ToggleFollowButton = ({
  mainUser,
  userInfo,
}: ToggleFollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(
    userInfo.followers[mainUser.userHandle]
  );
  const [visibility, setVisibility] = useState<boolean>(false);

  const userRef: DocRef = doc(db, "user-info", userInfo.id);
  const mainRef: DocRef = doc(db, "user-info", mainUser.id);

  const unfollowUser = async (): Promise<void> => {
    setIsFollowing(false);
    await updateDoc(userRef, {
      [`followers.${mainUser.userHandle}`]: deleteField(),
    });

    await updateDoc(mainRef, {
      [`following.${userInfo.userHandle}`]: deleteField(),
    });
  };

  const followUser = async (): Promise<void> => {
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
