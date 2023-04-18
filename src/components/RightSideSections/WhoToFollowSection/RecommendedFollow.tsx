import "../../../styles/RecommendedFollow.css";

import { useNavigate } from "react-router-dom";

import ToggleFollowButton from "../../Misc/ToggleFollowButton";
import { RibbityUser } from "../../../Ribbity.types";

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
    <div className="recommended-follow-container">
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
          <p>{recommendedUser.userName}</p>
          <p>@{recommendedUser.userHandle}</p>
        </div>
      </div>

      <ToggleFollowButton mainUser={mainUser} userInfo={recommendedUser} />
    </div>
  );
};

export default RecommendedFollow;
