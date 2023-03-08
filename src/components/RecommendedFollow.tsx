import "../styles/RecommendedFollow.css";
import { updateDoc, deleteField, doc, getDoc } from "firebase/firestore";
import { db } from "../scripts/firebaseConfig";
import { useEffect, useState } from "react";
import { getUserInfo } from "../scripts/firebaseHelperFns";
import { Link, useNavigate } from "react-router-dom";
import UnfollowConfirmation from "./UnfollowConfirmation";

interface RecommendedFollowProps {
  recommendedUser: any;
  mainUser: any;
  setCurrentUser: Function;
}

const RecommendedFollow = ({
  recommendedUser,
  mainUser,
  setCurrentUser,
}: RecommendedFollowProps) => {
  const [beingFollowed, setBeingFollowed] = useState<boolean | null>(null);
  const [showUnfollowConfirmation, setShowUnfollowConfirmation] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleFollowAction = async (e: any) => {
    if (mainUser.userHandle === recommendedUser.userHandle) return;
    const recommendedUserRef = doc(db, "user-info", recommendedUser.id);
    const mainUserRef = doc(db, "user-info", mainUser.id);
    // Retreive most up to date doc ref to make the UI follow buttons function correctly
    const snap = await getDoc(recommendedUserRef);
    const trueRecommendedUser: any = snap.data();

    if (trueRecommendedUser.followers[mainUser.userHandle]) {
      //Unfollow
      setBeingFollowed(false);
      await updateDoc(recommendedUserRef, {
        [`followers.${mainUser.userHandle}`]: deleteField(),
      });

      await updateDoc(mainUserRef, {
        [`following.${recommendedUser.userHandle}`]: deleteField(),
      });
    } else {
      //Follow

      setBeingFollowed(true);
      await updateDoc(recommendedUserRef, {
        [`followers.${mainUser.userHandle}`]: true,
      });

      await updateDoc(mainUserRef, {
        [`following.${recommendedUser.userHandle}`]: true,
      });
    }

    const newMainUser = await getUserInfo(mainUser.userHandle);

    setCurrentUser(newMainUser);
  };

  useEffect(() => {
    const updateBeingFollowStatus = async () => {
      const recommendedUserRef = doc(db, "user-info", recommendedUser.id);
      // Retreive most up to date doc ref to make the UI follow buttons function correctly
      const snap = await getDoc(recommendedUserRef);
      const trueRecommendedUser: any = snap.data();

      if (trueRecommendedUser.followers[mainUser.userHandle]) {
        setBeingFollowed(true);
      } else setBeingFollowed(false);
    };

    updateBeingFollowStatus();
  }, []);
  if (beingFollowed === null) return null;
  return (
    <div className="recommended-follow-container">
      <div
        className="left-side"
        onClick={() => navigate(recommendedUser.userHandle)}
      >
        <img
          src={recommendedUser.profileImgUrl}
          alt="user"
          className="recommended-user-image"
        />
        <div className="recommended-follow-names">
          <p>{recommendedUser.userName}</p>
          <p>@{recommendedUser.userHandle}</p>
        </div>
      </div>

      {beingFollowed ? (
        <button
          className="recommended-unfollow-button"
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
        <button
          className="recommended-follow-button"
          onClick={handleFollowAction}
        >
          Follow
        </button>
      )}

      <UnfollowConfirmation
        userHandle={recommendedUser.userHandle}
        visibility={showUnfollowConfirmation}
        setVisibility={setShowUnfollowConfirmation}
        confirmationCallback={handleFollowAction}
      />
    </div>
  );
};

export default RecommendedFollow;
