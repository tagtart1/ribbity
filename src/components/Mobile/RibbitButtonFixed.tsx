import { useState } from "react";
import FeatherIcon from "../../media/svg/FeatherIcon";
import "../../styles/TwatButtonFixed.css";
import RibbitPopupInput from "../Misc/RibbitPopupInput";

interface RibbitButtonFixedProps {
  mainUser: any;
}

const RibbitButtonFixed = ({ mainUser }: RibbitButtonFixedProps) => {
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
      <RibbitPopupInput
        currentUser={mainUser}
        toggleVisibility={setShowPopup}
        isVisible={showPopup}
      />
    </div>
  );
};

export default RibbitButtonFixed;
