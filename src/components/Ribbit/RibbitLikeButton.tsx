import RibbitLikeCounter from "./RibbitLikeCounter";
import { updateDoc, deleteField, doc } from "firebase/firestore";
import { db } from "../../scripts/firebaseConfig";
import { useState, useEffect } from "react";

import "../../styles/RibbitLikeButton.css";
import SignupPopup from "../NoAuthComponents/SignupPopup";
import { RibbitType } from "../../Ribbity.types";

interface RibbitLikeButtonProps {
  ribbitInfo: RibbitType;
  currentHandle: string;
  activeButton: string | null;
  setActiveButton: Function;
}

const RibbitLikeButton = ({
  ribbitInfo,
  currentHandle,
  activeButton,
  setActiveButton,
}: RibbitLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    ribbitInfo.likedBy[currentHandle]
  );

  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleLikeRibbit = async (): Promise<void> => {
    if (!currentHandle) {
      setShowPopup(true);
      return;
    }

    setHasClickedLike(true);
    if (isLiked) {
      // Unlke twat

      setIsLiked(false);
      await updateDoc(doc(db, "ribbits", ribbitInfo.id), {
        [`likedBy.${currentHandle}`]: deleteField(),
      });
    } else {
      // Like twat
      setActiveButton("like");

      setIsLiked(true);
      await updateDoc(doc(db, "ribbits", ribbitInfo.id), {
        [`likedBy.${currentHandle}`]: true,
      });
    }
  };

  useEffect(() => {
    if (activeButton === "dislike" && isLiked) {
      handleLikeRibbit();
    }
  }, [activeButton]);

  return (
    <>
      <button
        id="ribbit-option-heart-wrapper"
        onClick={handleLikeRibbit}
        aria-label="Like"
      >
        <div className="ribbit-option-icon ribbit-option-icon-heart">
          {isLiked ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path
                  fill="#F91880"
                  d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                ></path>
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <g>
                <path
                  fill="#71767B"
                  d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                ></path>
              </g>
            </svg>
          )}
        </div>

        <RibbitLikeCounter
          isLiked={isLiked}
          likedBy={ribbitInfo.likedBy}
          hasClickedLike={hasClickedLike}
        />
      </button>
      <SignupPopup
        visibility={showPopup}
        setOwnVisibility={setShowPopup}
        userName={ribbitInfo.handle}
        popupType="like"
      />
    </>
  );
};

export default RibbitLikeButton;
