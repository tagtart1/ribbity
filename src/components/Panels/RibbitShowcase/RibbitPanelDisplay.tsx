import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../../../scripts/firebaseConfig";
import {
  get12hourFromTimestamp,
  getDateStringFromTimestamp,
  getTimestamp,
  isValidString,
} from "../../../scripts/HelperFns";
import "../../../styles/RibbitPanelDisplay.css";

import RibbitReactionButtons from "../../Ribbit/RibbitReactionButtons";
import RibbitReplyButton from "../../Ribbit/RibbitReplyButton";
import { toast } from "react-hot-toast";
import BackgroundTransparent from "../../Misc/BackgroundTransparent";
import DeleteOptionDropdown from "../../Ribbit/DeleteOptionDropdown";
import useDeleteRibbit from "../../useDeleteRibbit";
import { RibbitType, RibbityUser } from "../../../Ribbity.types";
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

  const notifySuccess = () => toast("Your reply was sent.");
  const notifyClipboard = () => toast("Copied to clipboard");
  const inputRef: any = useRef();

  const autoGrowTextArea = (e: any): void => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const openDeleteOption = (): void => {
    if (mainUser.userHandle !== ribbitInfo.handle) return;
    setOpenDelete(true);
  };

  const handleSubmitReply = async (e: any): Promise<void> => {
    e.preventDefault();
    // Check for invalid data
    if (!isValidString(inputRef.current.value)) return;
    const ribbitsRef: CollectionReference = collection(db, "twats");

    const comment: RibbitType = {
      handle: mainUser.userHandle,
      userName: mainUser.userName,
      dislikedBy: {},
      likedBy: {},
      userProfileImg: mainUser.profileImgUrl,
      text: inputRef.current.value,
      timeInMillisecond: Date.now(),
      replyingTo: {
        id: ribbitInfo.id,
        handle: ribbitInfo.handle,
        all: [...ribbitInfo.replyingTo.all, ribbitInfo.id],
      },
      timeStamp: getTimestamp(),
      isComment: true,
      id: "",
    };

    const commentRef: DocumentReference = await addDoc(ribbitsRef, comment);
    e.target.reset();
    inputRef.current.style.height = "fit-content";
    comment.id = commentRef.id;
    notifySuccess();
    addNewComment(comment);
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
            <p className="user-name">{ribbitInfo.userName}</p>
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
      <p className="text">{ribbitInfo.text}</p>
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
        <div className="action-button-wrapper reribbit-action-button ">
          <svg viewBox="0 0 24 24">
            <g>
              <path
                fill="#71767B"
                d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
              ></path>
            </g>
          </svg>
        </div>

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
        <form
          className="ribbit-reply-form"
          onSubmit={handleSubmitReply}
          autoComplete="off"
        >
          <div className="reply-form-left-side">
            <img src={mainUser.profileImgUrl} alt="Main User" />
            <textarea
              id="ribbit-reply-input"
              placeholder="Ribbit Your Reply"
              autoComplete="off"
              maxLength={160}
              rows={1}
              onInput={autoGrowTextArea}
              ref={inputRef}
            />
          </div>
          <button>Reply</button>
        </form>
      )}
      <BackgroundTransparent
        isVisible={openDelete}
        toggleVisibility={setOpenDelete}
      />
    </div>
  );
};

export default RibbitPanelDisplay;
