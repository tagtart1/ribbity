interface TwatLikeCounterProps {
  currentHandle: string;
  likedBy: Array<string>;
}

const TwatLikeCounter = ({ currentHandle, likedBy }: TwatLikeCounterProps) => {
  return likedBy.length > 0 ? (
    <div>
      {likedBy.includes(currentHandle) ? (
        <span className="likes-count liked">{likedBy.length}</span>
      ) : (
        <span className="likes-count ">{likedBy.length}</span>
      )}
    </div>
  ) : null;
};

export default TwatLikeCounter;
