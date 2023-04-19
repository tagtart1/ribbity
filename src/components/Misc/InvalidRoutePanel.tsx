import { NavigateFunction, useNavigate } from "react-router-dom";
import "../../styles/InvalidRoutePanel.css";

interface InvalidRoutePanelProps {
  isWorkInProgress?: boolean;
}

const InvalidRoutePanel = ({ isWorkInProgress }: InvalidRoutePanelProps) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="invalid-route-panel-container">
      <div className="invalid-route-header">
        <div
          className="back-arrow"
          onClick={() => {
            navigate(-1);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#FFF"
                d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
              ></path>
            </g>
          </svg>
        </div>
        <h1>Go Back</h1>
      </div>
      <div className="invalid-route-banner"></div>

      <div className="invalid-route-img-wrapper">
        <div className="invalid-route-img"></div>
      </div>
      <div className="invalid-route-message-wrapper">
        <div>
          {isWorkInProgress ? (
            <>
              <h1>Oops, nothing is here yet!</h1>
              <p>
                We're working very hard to get this feature out to you quickly.
              </p>
            </>
          ) : (
            <>
              <h1>Nothing to see here!</h1>
              <p>Try searching for something else.</p>
            </>
          )}

          <div className="button-wrapper">
            <button
              onClick={() => {
                navigate("/home");
              }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvalidRoutePanel;
