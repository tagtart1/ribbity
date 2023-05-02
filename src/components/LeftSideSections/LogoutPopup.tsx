import { NavigateFunction, useNavigate } from "react-router-dom";
import CloseCross from "../../media/svg/CloseCross";
import { signOutUser } from "../../scripts/firebaseHelperFns";
import "../../styles/LogoutPopup.css";
import ReactDOM from "react-dom";

interface LogoutPopupProps {
  isVisible: boolean;
  setVisibility: Function;
}

// Type aliases
type ClickDivEvent = React.MouseEvent<HTMLDivElement>;

const LogoutPopup = ({ isVisible, setVisibility }: LogoutPopupProps) => {
  const navigate: NavigateFunction = useNavigate();
  const popupRoot = document.getElementById("popup-root");

  const handleOffsideClickClose = (e: ClickDivEvent): void => {
    if (e.target === e.currentTarget) {
      document.documentElement.style.overflowY = "visible";
      setVisibility(false);
    }
  };

  const closePopup = (): void => {
    setVisibility(false);
    document.documentElement.style.overflowY = "visible";
  };

  if (!isVisible || !popupRoot) return null;
  document.documentElement.style.overflowY = "hidden";
  return ReactDOM.createPortal(
    <div
      className="logout-popup-container"
      onClick={handleOffsideClickClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="logout-popup-main">
        <div className="text-group">
          <h1>Do you wish to log out?</h1>
          <p>You can always sign back in at any time.</p>
        </div>
        <div className="button-group">
          <button
            className="logout-button"
            onClick={() => {
              signOutUser();
              closePopup();
              navigate("/");
            }}
          >
            Log out
          </button>
          <button className="cancel-button" onClick={closePopup}>
            Cancel
          </button>
        </div>
        <button
          className="backout-button"
          onClick={closePopup}
          aria-label="close popup"
        >
          <CloseCross />
        </button>
      </div>
    </div>,
    popupRoot
  );
};

export default LogoutPopup;
