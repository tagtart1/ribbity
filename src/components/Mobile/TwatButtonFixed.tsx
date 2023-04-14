import { useState } from "react";
import FeatherIcon from "../../media/svg/FeatherIcon";
import "../../styles/TwatButtonFixed.css";
import TwatPopupInput from "../Misc/TwatPopupInput";

interface TwatButtonFixedProps {
  mainUser: any;
}

const TwatButtonFixed = ({ mainUser }: TwatButtonFixedProps) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  if (!mainUser.userHandle) return null;
  return (
    <div className="twat-button-mobile-container">
      <button
        className="twat-button-mobile-fixed"
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <FeatherIcon />
      </button>
      <TwatPopupInput
        currentUser={mainUser}
        toggleVisibility={setShowPopup}
        isVisible={showPopup}
      />
    </div>
  );
};

export default TwatButtonFixed;
