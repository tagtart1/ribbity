import "../../styles/DeleteTwatPopup.css";

interface DeleteTwatPopupProps {
  isVisible: boolean;
  toggleVisibility: Function;
  deleteTwat: Function;
}

const DeleteTwatPopup = ({
  isVisible,
  toggleVisibility,
  deleteTwat,
}: DeleteTwatPopupProps) => {
  const handleOffSideClick = (e: any) => {
    if (
      e.target === document.querySelector(".delete-twat-popup-container") &&
      e.buttons === 1
    ) {
      document.documentElement.style.overflowY = "visible";
      toggleVisibility(false);
    }
  };
  if (!isVisible) return null;
  return (
    <div
      className="delete-twat-popup-container"
      onMouseDown={handleOffSideClick}
    >
      <div className="delete-twat-popup-wrapper">
        <h1>Delete Twat?</h1>
        <p className="delete-confirm-text">
          This can't be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from Twitter search
          results.
        </p>
        <div className="delete-confirm-buttons">
          <button
            className="delete-confirm"
            onClick={() => {
              deleteTwat();
              toggleVisibility(false);
            }}
          >
            Delete
          </button>
          <button
            className="delete-cancel"
            onClick={() => {
              document.documentElement.style.overflowY = "visible";
              toggleVisibility(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTwatPopup;
