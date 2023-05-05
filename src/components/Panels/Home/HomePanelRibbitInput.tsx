import "../../../styles/HomePanelRibbitInput.css";

import { getProfilePicUrl } from "../../../scripts/firebaseHelperFns";
import { useRef, useState, useEffect } from "react";
import { getTimestamp, isValidString } from "../../../scripts/HelperFns";
import {
  DocumentReference,
  addDoc,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import { RibbitType, RibbityUser } from "../../../Ribbity.types";
import { toast } from "react-hot-toast";
import {
  StorageReference,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import CloseCross from "../../../media/svg/CloseCross";

interface HomePanelRibbitInputProps {
  mainUser: RibbityUser;
}

// Type aliases

type ChangeInputEvent = React.ChangeEvent<HTMLTextAreaElement>;

const HomePanelRibbitInput = ({ mainUser }: HomePanelRibbitInputProps) => {
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreviewImageString, setPreviewAttachedImageString] =
    useState<string>("");
  const imagePreviewElement: any = useRef();
  const inputRef: any = useRef();
  const notifySuccess = () => toast("Your ribbit was sent.");
  const notifyError = () => toast("Your ribbit failed to post.");

  const autoGrowTextArea = (e: ChangeInputEvent) => {
    const textarea = e.target as HTMLElement;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight - 17 + "px";
  };

  const removeAttachedMedia = (e: any): void => {
    setAttachedFile(null);
    setPreviewAttachedImageString("");
  };

  const handleAttachedImage = (e: any): void => {
    const imageFiles: File[] = e.target.files;
    if (imageFiles.length > 0) {
      // Show the selected image in the ribbit input box

      setAttachedFile(imageFiles[0]);
      const imageSrc: string = URL.createObjectURL(imageFiles[0]);
      setPreviewAttachedImageString(imageSrc);
    }
  };
  // Add new Ribbit to DB if valid
  const handleSubmitRibbit = async (e: any) => {
    e.preventDefault();

    if (!isValidString(inputRef.current.value) && !attachedFile) return;
    const newRibbitRef: DocumentReference = doc(collection(db, "ribbits"));
    let uploadedFileUrl: string = "";
    let uploadFilePath: string = "";

    if (attachedFile) {
      const filePath: string = `ribbits/${newRibbitRef.id}/${attachedFile.name}`;
      const newImageRef: StorageReference = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(
        newImageRef,
        attachedFile
      );
      uploadedFileUrl = await getDownloadURL(newImageRef);
      uploadFilePath = fileSnapshot.metadata.fullPath;
    }

    const newRibbit: RibbitType = {
      text: inputRef.current.value,
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
      id: "",
      creatorId: mainUser.id,
      reribbitedBy: {},
      isVerified: mainUser.isVerified,
      mediaPath: uploadFilePath,
      mediaUrl: uploadedFileUrl,
    };

    try {
      await setDoc(newRibbitRef, newRibbit);
      notifySuccess();
    } catch (error) {
      console.log(error);
      notifyError();
    }
    setAttachedFile(null);
    setPreviewAttachedImageString("");
    e.target.reset();
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoGrowTextArea(e);
  };

  useEffect(() => {
    if (attachedPreviewImageString && attachedFile) {
      imagePreviewElement.current.src = attachedPreviewImageString;
    }
  }, [attachedFile, attachedPreviewImageString]);

  return (
    <form className="home-ribbit-input-container" onSubmit={handleSubmitRibbit}>
      <img
        src={mainUser?.profileImgUrl || getProfilePicUrl()}
        className="user-profile-image-home-input"
        alt="user profile"
        referrerPolicy="no-referrer"
      />
      <div className="home-ribbit-right-column">
        <div style={{ width: "100%" }}>
          <textarea
            id="home-ribbit-input"
            placeholder="What's Happening?"
            autoComplete="off"
            maxLength={160}
            rows={1}
            onInput={handleInput}
            ref={inputRef}
          />
          {attachedFile ? (
            <div className="attached-home-media-preview-wrapper">
              <img
                src=""
                alt="attached media"
                ref={imagePreviewElement}
                className="attached-home-media-preview"
              />
              <button
                className="delete-home-attached-media"
                aria-label="remove attached media"
                onClick={removeAttachedMedia}
              >
                <CloseCross />
              </button>
            </div>
          ) : null}
        </div>
        <div className="home-ribbit-buttom-row">
          <div className="media-option-icons">
            <label className="media-option-icon" htmlFor="home-image-input">
              <input
                id="home-image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label="attach an image"
                onChange={handleAttachedImage}
              />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path
                    fill="rgb(58, 219, 125)"
                    d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"
                  ></path>
                </g>
              </svg>
            </label>
            <div className="media-option-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path
                    fill="rgb(58, 219, 125)"
                    d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
          <button className="ribbit-input-submit-button">Ribbit</button>
        </div>
      </div>
    </form>
  );
};

export default HomePanelRibbitInput;
