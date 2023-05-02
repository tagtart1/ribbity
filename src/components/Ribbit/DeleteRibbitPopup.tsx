import "../../styles/DeleteRibbitPopup.css";

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
      e.target === document.querySelector(".delete-ribbit-popup-container") &&
      e.buttons === 1
    ) {
      document.documentElement.style.overflowY = "visible";
      toggleVisibility(false);
    }
  };
  if (!isVisible) return null;
  return (
    <div
      className="delete-ribbit-popup-container"
      onMouseDown={handleOffSideClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="delete-ribbit-popup-wrapper">
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
