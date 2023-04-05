import TwatLikeButton from "./TwatLikeButton";
import TwatDislikeButton from "./TwatDislikeButton";
import { useState } from "react";

interface TwatReactionButtonsProps {
  twatInfo: any;
  currentHandle: string;
}

const TwatReactionButtons = ({
  twatInfo,
  currentHandle,
}: TwatReactionButtonsProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  return (
    <>
      <TwatLikeButton
        twatInfo={twatInfo}
        currentHandle={currentHandle}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
      <TwatDislikeButton
        twatInfo={twatInfo}
        currentHandle={currentHandle}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
    </>
  );
};
export default TwatReactionButtons;
