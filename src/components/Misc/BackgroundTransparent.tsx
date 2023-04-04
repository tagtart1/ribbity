import "../../styles/DeleteOptionDropdown.css";

const BackgroundTransparent = ({ isVisible, toggleVisibility }: any) => {
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
