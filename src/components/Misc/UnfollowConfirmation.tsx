import "../../styles/UnfollowConfirmation.css";
import ReactDOM from "react-dom";

interface UnfollowConfirmationProps {
  setVisibility: Function;
  visibility: boolean;
  confirmationCallback: Function;
  userHandle: string;
}

// Type aliases
type ClickDivEvent = React.MouseEvent<HTMLDivElement>;

const UnfollowConfirmation = ({
  setVisibility,
  visibility,
  confirmationCallback,
  userHandle,
}: UnfollowConfirmationProps) => {
  const handleClickAwayCancel = (e: ClickDivEvent) => {
    if (e.target === e.currentTarget && e.buttons === 1) {
      setVisibility(false);
      document.documentElement.style.overflowY = "visible";
    }
  };

  const popupRoot: HTMLElement | null = document.getElementById("popup-root");

  if (!visibility || !popupRoot) return null;
  document.documentElement.style.overflowY = "hidden";

  return ReactDOM.createPortal(
    <div
      className="unfollow-confirmation-container"
      onMouseDown={handleClickAwayCancel}
    >
      <section
        className="unfollow-confirmation-main"
        role="dialog"
        aria-modal="true"
      >
        <h1>Unfollow @{userHandle}</h1>
        <p className="unfollow-confirmatin-text">
          Their Ribbits will no longer show up in your home timeline. You can
          still view their profile, unless their Ribbits are protected.{" "}
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
