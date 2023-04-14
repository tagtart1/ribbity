import { useEffect, useState } from "react";

interface TwatLikeCounterProps {
  isLiked: boolean;
  likedBy: {
    [key: string]: boolean;
  };
  hasClickedLike: boolean;
}

const TwatLikeCounter = ({
  isLiked,
  likedBy,
  hasClickedLike,
}: TwatLikeCounterProps) => {
  const [count, setCount] = useState<number>(Object.keys(likedBy).length);

  useEffect(() => {
    if (hasClickedLike) {
      if (!isLiked) {
        setCount((prevCount) => prevCount - 1);
      } else {
        setCount((prevCount) => prevCount + 1);
      }
    }
  }, [isLiked, hasClickedLike]);

  return count > 0 ? (
    <div>
      {isLiked ? (
        <span className="likes-count liked">{count}</span>
      ) : (
        <span className="likes-count ">{count}</span>
      )}
    </div>
  ) : null;
};

export default TwatLikeCounter;
