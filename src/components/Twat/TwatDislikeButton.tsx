import { deleteField, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../scripts/firebaseConfig";
import "../../styles/TwatDislikeButton.css";
import TwatDislikeCounter from "./TwatDislikeCounter";

interface TwatDislikeButtonProps {
  twatInfo: {
    dislikedBy: {
      [key: string]: boolean;
    };
    id: string;
  };
  currentHandle: string;
  activeButton: string | null;
  setActiveButton: Function;
}

const TwatDislikeButton = ({
  twatInfo,
  currentHandle,
  activeButton,
  setActiveButton,
}: TwatDislikeButtonProps) => {
  const [isDisliked, setIsDisliked] = useState<boolean>(
    twatInfo.dislikedBy[currentHandle]
  );

  const [hasClickedDislike, setHasClickedDislike] = useState<boolean>(false);

  const handleDislike = async () => {
    setHasClickedDislike(true);
    if (isDisliked) {
      //Undislike twat

      setIsDisliked(false);
      await updateDoc(doc(db, "twats", twatInfo.id), {
        [`dislikedBy.${currentHandle}`]: deleteField(),
      });
    } else {
      //Dislike twat
      setActiveButton("dislike");

      setIsDisliked(true);
      await updateDoc(doc(db, "twats", twatInfo.id), {
        [`dislikedBy.${currentHandle}`]: true,
      });
    }
  };

  useEffect(() => {
    if (activeButton === "like" && isDisliked) {
      handleDislike();
    }
  }, [activeButton]);

  return (
    <div id="twat-option-dislike-wrapper" onClick={handleDislike}>
      <div className="twat-option-icon twat-option-icon-dislike ">
        {isDisliked ? (
          <svg fill="#bb731b" viewBox="0 0 16 16">
            <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16">
            <path
              fill="#71767B"
              d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"
            />
          </svg>
        )}
      </div>
      <TwatDislikeCounter
        hasClickedDislike={hasClickedDislike}
        isDisliked={isDisliked}
        dislikedBy={twatInfo.dislikedBy}
      />
    </div>
  );
};

export default TwatDislikeButton;
