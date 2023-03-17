interface TwatLikeCounterProps {
  currentHandle: string;
  likedBy: {
    [key: string]: boolean;
  };
}

const TwatLikeCounter = ({ currentHandle, likedBy }: TwatLikeCounterProps) => {
  return Object.keys(likedBy).length > 0 ? (
    <div>
      {likedBy[currentHandle] ? (
        <span className="likes-count liked">{Object.keys(likedBy).length}</span>
      ) : (
        <span className="likes-count ">{Object.keys(likedBy).length}</span>
      )}
    </div>
  ) : null;
};

export default TwatLikeCounter;
