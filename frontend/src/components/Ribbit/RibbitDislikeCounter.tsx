import { useEffect, useState } from "react";

interface RibbitDislikeCounterProps {
  isDisliked: boolean;
  dislikedBy: {
    [key: string]: boolean;
  };
  hasClickedDislike: boolean;
}

const RibbitDislikeCounter = ({
  isDisliked,
  dislikedBy,
  hasClickedDislike,
}: RibbitDislikeCounterProps) => {
  const [count, setCount] = useState<number>(Object.keys(dislikedBy).length);

  useEffect(() => {
    if (hasClickedDislike) {
      if (!isDisliked) {
        setCount((prevCount) => prevCount - 1);
      } else {
        setCount((prevCount) => prevCount + 1);
      }
    }
  }, [isDisliked, hasClickedDislike]);

  return count > 0 ? (
    <div>
      {isDisliked ? (
        <span className="dislikes-count disliked">{count}</span>
      ) : (
        <span className="dislikes-count ">{count}</span>
      )}
    </div>
  ) : null;
};

export default RibbitDislikeCounter;
