import {
  Link,
  NavigateFunction,
  useNavigate,
  useParams,
} from "react-router-dom";
import "../../../../styles/UserFollowPanelMember.css";
import ToggleFollowButton from "../../../Misc/ToggleFollowButton";
import { RibbityUser } from "../../../../Ribbity.types";
import RibbityVerifyIcon from "../../../../media/svg/RibbityVerifyIcon";

interface UserFollowPanelMemberProps {
  mainUser: RibbityUser;
  userInfo: RibbityUser;
}

const UserFollowPanelMember: React.FC<UserFollowPanelMemberProps> = ({
  mainUser,
  userInfo,
}) => {
  const { handle } = useParams();
  const navigate: NavigateFunction = useNavigate();
  if (handle === userInfo.userHandle) return null;
  if (!mainUser.userHandle) return null;
  return (
    <div
      className="user-follow-member"
      onClick={(e: any) => {
        if (e.target === e.currentTarget) navigate(`/${userInfo.userHandle}`);
      }}
    >
      <img src={userInfo.profileImgUrl} alt="user" />
      <div className="user-follow-member-rightside">
        <div className="top">
          <Link to={`/${userInfo.userHandle}`}>
            <h3 className="user-name">
              {userInfo.userName}
              {userInfo.isVerified ? <RibbityVerifyIcon /> : null}
            </h3>
            <p className="handle">@{userInfo.userHandle}</p>
          </Link>

          <ToggleFollowButton mainUser={mainUser} userInfo={userInfo} />
        </div>
        <p className="bio">{userInfo.bio}</p>
      </div>
    </div>
  );
};

export default UserFollowPanelMember;
