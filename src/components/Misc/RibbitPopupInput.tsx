import { useState } from "react";

import "../../styles/RibbitPopupInput.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../scripts/firebaseConfig";
import { getTimestamp, isValidString } from "../../scripts/HelperFns";
import toast from "react-hot-toast";
import ReactDOM from "react-dom";
import { RibbityUser } from "../../Ribbity.types";

interface RibbitPopupInputProps {
  isVisible: boolean;
  toggleVisibility: Function;
  mainUser: RibbityUser;
}

// Type aliases
type ClickDivEvent = React.MouseEvent<HTMLDivElement>;
type SubmitFormEvent = React.FormEvent<HTMLFormElement>;

const RibbitPopupInput = ({
  isVisible,
  toggleVisibility,
  mainUser,
}: RibbitPopupInputProps) => {
  const [inputLength, setInputLength] = useState<Number>(0);

  const notifySuccess = () => toast("Your Ribbit was sent.");
  const notifyError = () => toast.error("Your Ribbit failed to send.");

  const handleOffSideClick = (e: ClickDivEvent): void => {
    if (
      e.target === document.querySelector(".ribbit-popup-input-container") &&
      e.buttons === 1
    ) {
      document.documentElement.style.overflowY = "visible";
      toggleVisibility(false);
      setInputLength(0);
    }
  };

  const handleSubmitRibbit = async (e: SubmitFormEvent): Promise<void> => {
    e.preventDefault();

    const input: HTMLInputElement = document.getElementById(
      "ribbit-popup-input"
    ) as HTMLInputElement;

    if (!isValidString(input.value)) return;
    try {
      await addDoc(collection(db, "ribbits"), {
        text: input.value,
        timeStamp: getTimestamp(),
        handle: mainUser.userHandle,
        userName: mainUser.userName,
        userProfileImg: mainUser.profileImgUrl,
        timeInMillisecond: Date.now(),
        likedBy: {},
        dislikedBy: {},
        isComment: false,
        replyingTo: {
          id: "",
          handle: "",
          all: [],
        },
        creatorId: mainUser.id,
        reribbitedBy: {},
      });

      notifySuccess();
      setInputLength(0);
      toggleVisibility(false);
    } catch (error) {
      notifyError();
      console.error("Error saving tweet to Firebase DB", error);
    }

    document.documentElement.style.overflowY = "visible";
  };

  const popupRoot: HTMLElement | null = document.getElementById("popup-root");

  if (!isVisible || !popupRoot) return null;
  return ReactDOM.createPortal(
    <div
      className="ribbit-popup-input-container"
      onMouseDown={handleOffSideClick}
    >
      <div className="ribbit-popup-input-wrapper">
        <div className="backout-button">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            onClick={() => {
              document.documentElement.style.overflowY = "visible";
              toggleVisibility(false);
              setInputLength(0);
            }}
          >
            <g>
              <path
                fill="#FFF"
                d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"
              ></path>
            </g>
          </svg>
        </div>
        <div className="ribbit-popup-input-main">
          <img src={mainUser.profileImgUrl} alt="user" />

          <form
            className="popup-input-main-right"
            onSubmit={handleSubmitRibbit}
          >
            <textarea
              maxLength={160}
              placeholder="What's happening?"
              id="ribbit-popup-input"
              onInput={(e) => {
                setInputLength(e.currentTarget.value.length);
              }}
            ></textarea>
            <span className="ribbit-reply-status">
              <svg viewBox="0 0 24 24">
                <g>
                  <path
                    fill="#1D9BF0"
                    d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.25 10.48L10.5 17.5l-2-1.5v-3.5L7.5 9 5.03 7.59c1.42-2.24 3.89-3.75 6.72-3.84L11 6l-2 .5L8.5 9l5 1.5-1.75 1.73zM17 14v-3l-1.5-3 2.88-1.23c1.17 1.42 1.87 3.24 1.87 5.23 0 1.3-.3 2.52-.83 3.61L17 14z"
                  ></path>
                </g>
              </svg>
              <span>Everyone can reply</span>
            </span>
            <div className="popup-bottom-row">
              <div className="popup-media-option-icons">
                <div className="popup-media-option-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        fill="#1D9BF0"
                        d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="popup-media-option-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        fill="#1D9BF0"
                        d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="popup-bottom-right-button">
                <span className="popup-input-length">
                  {`${inputLength}`} / 160
                </span>
                <button type="submit" className="ribbit-button">
                  Ribbit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    popupRoot
  );
};

export default RibbitPopupInput;
