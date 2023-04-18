import "../../styles/DeleteOptionDropdown.css";

interface BackgroundTransparentProps {
  isVisible: boolean;
  toggleVisibility: Function;
}

const BackgroundTransparent = ({
  isVisible,
  toggleVisibility,
}: BackgroundTransparentProps) => {
  if (!isVisible) return null;
  return (
    <div
      className="background-transparent-dropdown"
      onClick={() => {
        toggleVisibility(false);
      }}
    ></div>
  );
};

export default BackgroundTransparent;
