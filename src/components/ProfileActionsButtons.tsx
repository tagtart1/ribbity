import "../styles/ProfileActionsButtons.css";

const ProfileActionsButtons = () => {
  return (
    <div className="profile-actions">
      <div className="profile-action-button">
        <svg viewBox="0 0 24 24">
          <g>
            <path
              fill="#EFF3F4"
              d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
            ></path>
          </g>
        </svg>
      </div>
      <div className="profile-action-button">
        <svg viewBox="0 0 24 24">
          <g>
            <path
              fill="#EFF3F4"
              d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"
            ></path>
          </g>
        </svg>
      </div>
      <button className="follow-user-button">Follow</button>
    </div>
  );
};

export default ProfileActionsButtons;
