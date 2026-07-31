import { deleteField, updateDoc, doc } from "firebase/firestore";
import { RibbitType } from "../../Ribbity.types";
import ReRibbitIcon from "../../media/svg/ReRibbitIcon";
import "../../styles/ReRibbitButton.css";
import { useState } from "react";
import { db } from "../../scripts/firebaseConfig";
import { toast } from "react-hot-toast";
import SignupPopup from "../NoAuthComponents/SignupPopup";
import ReRibbitCounter from "./ReRibbitCounter";

interface ReRibbitButtonProps {
  ribbitInfo: RibbitType;
  currentHandle: string;
}

const ReRibbitButton = ({ ribbitInfo, currentHandle }: ReRibbitButtonProps) => {
  const [isReRibbited, setIsReRibbited] = useState<boolean>(
    !!ribbitInfo.reribbitedBy[currentHandle]
  );

  const [showSignupPopup, setShowSignupPopup] = useState<boolean>(false);

  const [hasClickedReRibbit, setHasClickedReRibbit] = useState<boolean>(false);

  const closePopup = (): void => {
    setShowSignupPopup(false);
  };

  const notifySuccessfulReribbit = () => toast("Reribbited!");
  const notifyError = () => toast.error(`You can't Reribbit yourself.`);

  const handleReRibbit = async (): Promise<void> => {
    if (!currentHandle) {
      setShowSignupPopup(true);
      return;
    }

    if (currentHandle === ribbitInfo.handle) {
      notifyError();
      return;
    }

    setHasClickedReRibbit(true);

    if (isReRibbited) {
      // Undo reribbit
      setIsReRibbited(false);
      await updateDoc(doc(db, "ribbits", ribbitInfo.id), {
        [`reribbitedBy.${currentHandle}`]: deleteField(),
      });
    } else {
      // Reribbit

      setIsReRibbited(true);
      await updateDoc(doc(db, "ribbits", ribbitInfo.id), {
        [`reribbitedBy.${currentHandle}`]: Date.now(),
      });

      notifySuccessfulReribbit();
    }
  };

  return (
    <>
      <button
        id="reribbit-button-wrapper"
        onClick={handleReRibbit}
        aria-label="Re-ribbit"
      >
        <div
          className={
            isReRibbited
              ? "ribbit-option-icon-retweet active"
              : "ribbit-option-icon-retweet"
          }
        >
          <ReRibbitIcon />
        </div>
        <ReRibbitCounter
          isReRibbited={isReRibbited}
          reribbitedBy={ribbitInfo.reribbitedBy}
          hasClickedReRibbit={hasClickedReRibbit}
        />
      </button>
      <SignupPopup
        userName={ribbitInfo.handle}
        visibility={showSignupPopup}
        setOwnVisibility={closePopup}
        popupType="reribbit"
      />
    </>
  );
};

export default ReRibbitButton;
