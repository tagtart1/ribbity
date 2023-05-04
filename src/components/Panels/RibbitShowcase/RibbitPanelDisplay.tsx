import { useState } from "react";

import {
  get12hourFromTimestamp,
  getDateStringFromTimestamp,
} from "../../../scripts/HelperFns";
import "../../../styles/RibbitPanelDisplay.css";

import RibbitReactionButtons from "../../Ribbit/RibbitReactionButtons";
import RibbitReplyButton from "../../Ribbit/RibbitReplyButton";
import { toast } from "react-hot-toast";
import BackgroundTransparent from "../../Misc/BackgroundTransparent";
import DeleteOptionDropdown from "../../Ribbit/DeleteOptionDropdown";
import useDeleteRibbit from "../../useDeleteRibbit";
import { RibbitType, RibbityUser } from "../../../Ribbity.types";
import ReRibbitButton from "../../Ribbit/ReRibbitButton";
import RibbityVerifyIcon from "../../../media/svg/RibbityVerifyIcon";

import RibbitPanelReplyInput from "./RibbitPanelReplyInput";
interface RibbitPanelDisplayProps {
  ribbitInfo: RibbitType;
  mainUser: RibbityUser;
  addNewComment: Function;
}

const RibbitPanelDisplay = ({
  ribbitInfo,
  mainUser,
  addNewComment,
}: RibbitPanelDisplayProps) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const deleteRibbit = useDeleteRibbit({
    ribbitInfo,
    inShowcase: true,
  });

  const notifyClipboard = () => toast("Copied to clipboard");

  const openDeleteOption = (): void => {
    if (mainUser.userHandle !== ribbitInfo.handle) return;
    setOpenDelete(true);
  };

  const handleDeleteRibbit = (): void => {
    deleteRibbit();
    setOpenDelete(false);
  };

  const copyRibbitLinkToClipboard = (): void => {
    const currentPath = window.location.href;

    navigator.clipboard.writeText(currentPath);
    notifyClipboard();
  };

  return (
    <div className="ribbit-panel-display-container">
      <div className="header">
        <div className="user-info">
          <img
            src={ribbitInfo.userProfileImg}
            alt="User"
            className="threaded-profile-img"
          />
          <div>
            <p className="user-name">
              {ribbitInfo.userName}
              {ribbitInfo.isVerified ? <RibbityVerifyIcon /> : null}
            </p>
            <p className="user-handle">@{ribbitInfo.handle}</p>
          </div>
        </div>
        <div className="more-button" onClick={openDeleteOption}>
          <DeleteOptionDropdown
            isVisible={openDelete}
            deleteRibbit={handleDeleteRibbit}
          />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                className="ribbit-path"
                fill="#71767B"
                d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <div>
        <p className="text">{ribbitInfo.text}</p>
        {ribbitInfo.mediaUrl ? (
          <img
            className="attached-ribbit-image"
            src={ribbitInfo.mediaUrl}
            alt="attached media"
          />
        ) : null}
      </div>
      <div className="date-posted">
        {" "}
        {get12hourFromTimestamp(ribbitInfo.timeStamp)} ·{" "}
        {getDateStringFromTimestamp(ribbitInfo.timeStamp)}
      </div>
      <div className="action-buttons">
        <RibbitReplyButton
          ribbitId={ribbitInfo.id}
          ribbitHandle={ribbitInfo.handle}
        />
        <ReRibbitButton
          ribbitInfo={ribbitInfo}
          currentHandle={mainUser.userHandle}
        />

        <RibbitReactionButtons
          ribbitInfo={ribbitInfo}
          currentHandle={mainUser.userHandle}
        />
        <div
          className="action-button-wrapper"
          onClick={copyRibbitLinkToClipboard}
        >
          <svg viewBox="0 0 24 24">
            <g>
              <path
                fill="#71767B"
                d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      {!mainUser.userHandle ? null : (
        <RibbitPanelReplyInput
          mainUser={mainUser}
          addNewComment={addNewComment}
          ribbitInfo={ribbitInfo}
        />
      )}
      <BackgroundTransparent
        isVisible={openDelete}
        toggleVisibility={setOpenDelete}
      />
    </div>
  );
};

export default RibbitPanelDisplay;
