import "../../styles/DeleteTwatPopup.css";

interface DeleteRibbitPopupProps {
  isVisible: boolean;
  toggleVisibility: Function;
  deleteRibbit: Function;
}

const DeleteRibbitPopup = ({
  isVisible,
  toggleVisibility,
  deleteRibbit,
}: DeleteRibbitPopupProps) => {
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
        <h1>Delete Ribbit?</h1>
        <p className="delete-confirm-text">
          This can't be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from Ribbity search
          results.
        </p>
        <div className="delete-confirm-buttons">
          <button
            className="delete-confirm"
            onClick={() => {
              deleteRibbit();
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

export default DeleteRibbitPopup;
