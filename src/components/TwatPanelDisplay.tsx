import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../scripts/firebaseConfig";
import {
  get12hourFromTimestamp,
  getDateStringFromTimestamp,
  getTimestamp,
} from "../scripts/HelperFns";
import "../styles/TwatPanelDisplay.css";

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
  const handleSubmitReply = async (e: any) => {
    e.preventDefault();
    // Get the text from the comment input box
    const inputElementValue = document.getElementById(
      "twat-reply-input"
    ) as HTMLInputElement;
    const inputValue = inputElementValue.value;

    const twatsRef = collection(db, "twats");

    console.log(twatInfo.id);

    const comment = {
      handle: mainUser.userHandle,
      userName: mainUser.userName,
      likedBy: {},
      userProfileImg: mainUser.profileImgUrl,
      text: inputValue,
      timeInMillisecond: Date.now(),
      replyingTo: twatInfo.id,
      timeStamp: getTimestamp(),
      isComment: true,
      id: "",
    };

    const commentRef = await addDoc(twatsRef, comment);
    comment.id = commentRef.id;

    addNewComment(comment);
  };

  return (
    <div className="twat-panel-display-container">
      <div className="header">
        <div className="user-info">
          <img src={twatInfo.userProfileImg} alt="User" />
          <div>
            <p className="user-name">{twatInfo.userName}</p>
            <p className="user-handle">@{twatInfo.handle}</p>
          </div>
        </div>
        <div className="more-button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
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
        <div className="action-button-wrapper">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#71767B"
                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
              ></path>
            </g>
          </svg>
        </div>
        <div className="action-button-wrapper">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#71767B"
                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
              ></path>
            </g>
          </svg>
        </div>
        <div className="action-button-wrapper">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#71767B"
                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
              ></path>
            </g>
          </svg>
        </div>
        <div className="action-button-wrapper">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#71767B"
                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <form
        className="twat-reply-form"
        onSubmit={handleSubmitReply}
        autoComplete="off"
      >
        <div className="reply-form-left-side">
          <img src={mainUser.profileImgUrl} alt="Main User" />
          <input
            id="twat-reply-input"
            placeholder="Twat your reply"
            maxLength={160}
          />
        </div>
        <button>Reply</button>
      </form>
    </div>
  );
};

export default TwatPanelDisplay;
