import RibbitLikeButton from "./RibbitLikeButton";
import RibbitDislikeButton from "./RibbitDislikeButton";
import { useState } from "react";
import { RibbitType } from "../../Ribbity.types";

interface RibbitReactionButtonsProps {
  ribbitInfo: RibbitType;
  currentHandle: string;
}

const RibbitReactionButtons = ({
  ribbitInfo,
  currentHandle,
}: RibbitReactionButtonsProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  return (
    <>
      <RibbitLikeButton
        ribbitInfo={ribbitInfo}
        currentHandle={currentHandle}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
      <RibbitDislikeButton
        ribbitInfo={ribbitInfo}
        currentHandle={currentHandle}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
    </>
  );
};
export default RibbitReactionButtons;
