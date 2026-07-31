import "../../../styles/RecommendedFollow.css";

import { useNavigate } from "react-router-dom";

import ToggleFollowButton from "../../Misc/ToggleFollowButton";
import { RibbityUser } from "../../../Ribbity.types";
import RibbityVerifyIcon from "../../../media/svg/RibbityVerifyIcon";

interface RecommendedFollowProps {
  recommendedUser: RibbityUser;
  mainUser: RibbityUser;
}

const RecommendedFollow = ({
  recommendedUser,
  mainUser,
}: RecommendedFollowProps) => {
  const navigate = useNavigate();

  return (
    <li className="recommended-follow-container">
      <div
        className="left-side"
        onClick={() => navigate(recommendedUser.userHandle)}
      >
        <img
          src={recommendedUser.profileImgUrl}
          alt="user"
          className="recommended-user-image"
        />
        <div className="recommended-follow-names">
          <p className="user-name">
            <span> {recommendedUser.userName}</span>
            {recommendedUser.isVerified ? <RibbityVerifyIcon /> : null}
          </p>

          <p>@{recommendedUser.userHandle}</p>
        </div>
      </div>

      <ToggleFollowButton mainUser={mainUser} userInfo={recommendedUser} />
    </li>
  );
};

export default RecommendedFollow;
