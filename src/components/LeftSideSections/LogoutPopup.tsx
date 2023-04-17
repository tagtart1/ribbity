import CloseCross from "../../media/svg/CloseCross";
import { signOutUser } from "../../scripts/firebaseHelperFns";
import "../../styles/LogoutPopup.css";
import ReactDOM from "react-dom";

interface LogoutPopupProps {
  isVisible: boolean;
  setVisibility: Function;
}

const LogoutPopup = ({ isVisible, setVisibility }: LogoutPopupProps) => {
  const popupRoot = document.getElementById("popup-root");

  const handleOffsideClickClose = (e: any) => {
    if (e.target === e.currentTarget) {
      document.documentElement.style.overflowY = "visible";
      setVisibility(false);
    }
  };

  const closePopup = () => {
    setVisibility(false);
    document.documentElement.style.overflowY = "visible";
  };

  if (!isVisible || !popupRoot) return null;
  document.documentElement.style.overflowY = "hidden";
  return ReactDOM.createPortal(
    <div className="logout-popup-container" onClick={handleOffsideClickClose}>
      <div className="logout-popup-main">
        <div className="text-group">
          <h1>Do you wish to log out?</h1>
          <p>You can always sign back in at any time.</p>
        </div>
        <div className="button-group">
          <button
            className="logout-button"
            onClick={() => {
              document.documentElement.style.overflowY = "visible";
              signOutUser();
            }}
          >
            Log out
          </button>
          <button className="cancel-button" onClick={closePopup}>
            Cancel
          </button>
        </div>
        <div className="backout-button" onClick={closePopup}>
          <CloseCross />
        </div>
      </div>
    </div>,
    popupRoot
  );
};

export default LogoutPopup;