import { addDoc, collection } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../../../scripts/firebaseConfig";
import {
  get12hourFromTimestamp,
  getDateStringFromTimestamp,
  getTimestamp,
  isValidString,
} from "../../../scripts/HelperFns";
import "../../../styles/TwatPanelDisplay.css";

import TwatReactionButtons from "../../Ribbit/TwatReactionButtons";
import TwatReplyButton from "../../Ribbit/TwatReplyButton";
import { toast } from "react-hot-toast";
import BackgroundTransparent from "../../Misc/BackgroundTransparent";
import DeleteOptionDropdown from "../../Ribbit/DeleteOptionDropdown";
import useDeleteRibbit from "../../useDeleteRibbit";
interface TwatPanelDisplayProps {
  twatInfo: any;
  mainUser: any;
  addNewComment: Function;
}

const TwatPanelDisplay = ({
  twatInfo,
  mainUser,
  addNewComment,
}: TwatPanelDisplayProps) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const deleteTwat = useDeleteRibbit({
    twatInfo,
    inShowcase: true,
  });

  const notifySuccess = () => toast("Your reply was sent.");
  const notifyClipboard = () => toast("Copied to clipboard");
  const inputRef: any = useRef();

  const autoGrowTextArea = (e: any) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const openDeleteOption = () => {
    if (mainUser.userHandle !== twatInfo.handle) return;
    setOpenDelete(true);
  };

  const handleSubmitReply = async (e: any) => {
    e.preventDefault();
    // Check for invalid data
    if (!isValidString(inputRef.current.value)) return;
    const twatsRef = collection(db, "twats");

    console.log(twatInfo.id);

    const comment = {
      handle: mainUser.userHandle,
      userName: mainUser.userName,
      dislikedBy: {},
      likedBy: {},
      userProfileImg: mainUser.profileImgUrl,
      text: inputRef.current.value,
      timeInMillisecond: Date.now(),
      replyingTo: {
        id: twatInfo.id,
        handle: twatInfo.handle,
        all: [...twatInfo.replyingTo.all, twatInfo.id],
      },
      timeStamp: getTimestamp(),
      isComment: true,
      id: "",
    };

    const commentRef = await addDoc(twatsRef, comment);
    e.target.reset();
    inputRef.current.style.height = "fit-content";
    comment.id = commentRef.id;
    notifySuccess();
    addNewComment(comment);
  };

  const handleDeleteTwat = async () => {
    deleteTwat();
    setOpenDelete(false);
  };

  const copyTwatLinkToClipboard = () => {
    const currentPath = window.location.href;

    navigator.clipboard.writeText(currentPath);
    notifyClipboard();
  };

  return (
    <div className="twat-panel-display-container">
      <div className="header">
        <div className="user-info">
          <img
            src={twatInfo.userProfileImg}
            alt="User"
            className="threaded-profile-img"
          />
          <div>
            <p className="user-name">{twatInfo.userName}</p>
            <p className="user-handle">@{twatInfo.handle}</p>
          </div>
        </div>
        <div className="more-button" onClick={openDeleteOption}>
          <DeleteOptionDropdown
            isVisible={openDelete}
            deleteTwat={handleDeleteTwat}
          />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                className="twat-path"
                fill="#71767B"
                d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <p className="text">{twatInfo.text}</p>
      <div className="date-posted">
        {" "}
        {get12hourFromTimestamp(twatInfo.timeStamp)} ·{" "}
        {getDateStringFromTimestamp(twatInfo.timeStamp)}
      </div>
      <div className="action-buttons">
        <TwatReplyButton twatId={twatInfo.id} twatHandle={twatInfo.handle} />
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

        <TwatReactionButtons
          twatInfo={twatInfo}
          currentHandle={mainUser.userHandle}
        />
        <div
          className="action-button-wrapper"
          onClick={copyTwatLinkToClipboard}
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
          className="twat-reply-form"
          onSubmit={handleSubmitReply}
          autoComplete="off"
        >
          <div className="reply-form-left-side">
            <img src={mainUser.profileImgUrl} alt="Main User" />
            <textarea
              id="twat-reply-input"
              placeholder="Twat Your Reply"
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

export default TwatPanelDisplay;
