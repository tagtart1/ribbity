import { useState } from "react";
import FeatherIcon from "../../media/svg/FeatherIcon";
import "../../styles/RibbitButtonFixed.css";
import RibbitPopupInput from "../Misc/RibbitPopupInput";
import { RibbityUser } from "../../Ribbity.types";

interface RibbitButtonFixedProps {
  mainUser: RibbityUser;
}

const RibbitButtonFixed = ({ mainUser }: RibbitButtonFixedProps) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  if (!mainUser.userHandle) return null;
  return (
    <div className="ribbit-button-mobile-container">
      <button
        className="ribbit-button-mobile-fixed"
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <FeatherIcon />
      </button>
      <RibbitPopupInput
        mainUser={mainUser}
        toggleVisibility={setShowPopup}
        isVisible={showPopup}
      />
    </div>
  );
};

export default RibbitButtonFixed;
