import { useNavigate } from "react-router-dom";
import "../../../styles/RibbitPanelHeader.css";

const RibbitPanelHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="ribbit-panel-header">
      <div
        className="back-arrow"
        onClick={() => {
          navigate(-1);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g>
            <path
              fill="#EFF3F4"
              d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
            ></path>
          </g>
        </svg>
      </div>
      <h1>Ribbit</h1>
    </header>
  );
};

export default RibbitPanelHeader;
