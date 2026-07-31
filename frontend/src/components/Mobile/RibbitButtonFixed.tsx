import { useState, useContext } from "react";
import FeatherIcon from "../../media/svg/FeatherIcon";
import "../../styles/RibbitButtonFixed.css";
import RibbitPopupInput from "../Misc/RibbitPopupInput";
import { RibbityUser } from "../../Ribbity.types";
import AppContext from "../AppContext";

interface AppContextProps {
  mainUser: RibbityUser;
}

const RibbitButtonFixed = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { mainUser }: AppContextProps = useContext(AppContext);
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
