import Spinner from "./Spinner";

import "../../styles/LoadingPanel.css";

const LoadingPanel = () => {
  return (
    <div className="loading-panel-wrapper">
      <Spinner />
    </div>
  );
};

export default LoadingPanel;
