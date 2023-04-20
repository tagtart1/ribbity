import { useEffect, useState } from "react";

interface ReRibbitCounterProps {
  isReRibbited: boolean;
  reribbitedBy: {
    [key: string]: number;
  };
  hasClickedReRibbit: boolean;
}

const ReRibbitCounter = ({
  isReRibbited,
  reribbitedBy,
  hasClickedReRibbit,
}: ReRibbitCounterProps) => {
  const [count, setCount] = useState<number>(Object.keys(reribbitedBy).length);

  useEffect(() => {
    if (hasClickedReRibbit) {
      if (!isReRibbited) {
        setCount((prevCount) => prevCount - 1);
      } else {
        setCount((prevCount) => prevCount + 1);
      }
    }
  }, [isReRibbited, hasClickedReRibbit]);

  return count > 0 ? (
    <div>
      {isReRibbited ? (
        <span className="reribbit-count reribbited">{count}</span>
      ) : (
        <span className="reribbit-count">{count}</span>
      )}
    </div>
  ) : null;
};

export default ReRibbitCounter;
