import { useEffect } from "react";
import "../../styles/UnfollowConfirmation.css";
import ReactDOM from "react-dom";

interface UnfollowConfirmationProps {
  setVisibility: Function;
  visibility: boolean;
  confirmationCallback: Function;
  userHandle: string;
}

const UnfollowConfirmation = ({
  setVisibility,
  visibility,
  confirmationCallback,
  userHandle,
}: UnfollowConfirmationProps) => {
  const handleClickAwayCancel = (e: any) => {
    console.log(e.buttons);
    if (e.target === e.currentTarget && e.buttons === 1) {
      setVisibility(false);
      document.documentElement.style.overflowY = "visible";
    }
  };
  const popupRoot = document.getElementById("popup-root");

  if (!visibility || !popupRoot) return null;
  document.documentElement.style.overflowY = "hidden";

  return ReactDOM.createPortal(
    <div
      className="unfollow-confirmation-container"
      onMouseDown={handleClickAwayCancel}
    >
      <section className="unfollow-confirmation-main">
        <h1>Unfollow @{userHandle}</h1>
        <p className="unfollow-confirmatin-text">
          Their Twats will no longer show up in your home timeline. You can
          still view their profile, unless their Twats are protected.{" "}
        </p>
        <div className="unfollow-confirmation-button-group">
          <button
            className="unfollow-confirm-button"
            onClick={() => {
              setVisibility(false);
              document.documentElement.style.overflowY = "visible";
              confirmationCallback();
            }}
          >
            Unfollow
          </button>
          <button
            className="unfollow-cancel-button"
            onClick={() => {
              setVisibility(false);
              document.documentElement.style.overflowY = "visible";
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>,
    popupRoot
  );
};

export default UnfollowConfirmation;