import "../styles/RecommendedFollow.css";

interface RecommendedFollowProps {
  profileImage: string;
  name: string;
  userName: string;
}

const RecommendedFollow = ({
  profileImage,
  name,
  userName,
}: RecommendedFollowProps) => {
  return (
    <div className="recommended-follow-container">
      <div className="left-side">
        <img src={profileImage} alt="user" className="recommended-user-image" />
        <div className="recommended-follow-names">
          <p>{name}</p>
          <p>@{userName}</p>
        </div>
      </div>
      <button className="recommended-follow-button">Follow</button>
    </div>
  );
};

export default RecommendedFollow;
