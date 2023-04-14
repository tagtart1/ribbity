import "../../../styles/EditProfilePopup.css";
import placeholderBanner from "../media/1080x360.jpg";
import placeholderPfp from "../media/defaultpfp.jpg";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../scripts/firebaseConfig";
import { useState } from "react";

import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Spinner from "../../Misc/Spinner";

interface EditProfilePopupProps {
  isVisible: boolean;
  userName: string;
  bio: string;
  location: string;
  docId: string;
  setShowEditProfile: Function;
  updateChanges: Function;
  profileImg: string;
  profileImgPath: string;
  bannerImg: string;
  bannerImgPath: string;
}

const EditProfilePopup = ({
  isVisible,
  userName,
  bio,
  location,
  docId,
  setShowEditProfile,
  updateChanges,
  profileImg,
  profileImgPath,
  bannerImg,
  bannerImgPath,
}: EditProfilePopupProps) => {
  const [editsValid, setEditsValid] = useState<boolean>(true);
  const [selectedProfileImgFile, setSelectedProfileImgFile] = useState<any>();
  const [selectedBannerImgFile, setSelectedBannerImgFile] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitProfileEdits = async (e: any) => {
    e.preventDefault();
    if (!editsValid) return;
    const userInfoRef = doc(db, "user-info", docId);
    let locationValue: string = (
      document.getElementById("edit-location-input") as HTMLInputElement
    ).value
      .replace(/\s+/g, " ")
      .trim();

    let userNameValue: string = (
      document.getElementById("edit-name-input") as HTMLInputElement
    ).value
      .replace(/\s+/g, " ")
      .trim();
    let bioValue: string = (
      document.getElementById("edit-bio-input") as HTMLInputElement
    ).value;

    // Replace white space entries with empty string to dismiss bad input
    if (!bioValue.replace(/\s/g, "").length) {
      bioValue = "";
    }

    if (!locationValue.replace(/\s/g, "").length) {
      locationValue = "";
    }
    let publicImgUrl: any = profileImg;
    let profileImgPathNew: any = profileImgPath;
    let publicbannerImg: any = bannerImg;
    let bannerImgPathNew: any = bannerImgPath;
    // Upload new profile image to storage if there is a newely selected Image
    if (selectedProfileImgFile) {
      //If a path is available delete the old user image from Storage
      if (profileImgPathNew) {
        const oldProfileImageRef = ref(getStorage(), profileImgPathNew);
        deleteObject(oldProfileImageRef);
      }
      // Save new image into Storage
      const filePath: string = `${userInfoRef.id}/${selectedProfileImgFile.name}`;
      const newProfileImgRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(
        newProfileImgRef,
        selectedProfileImgFile
      );
      publicImgUrl = await getDownloadURL(newProfileImgRef);
      profileImgPathNew = fileSnapshot.metadata.fullPath;
    }

    if (selectedBannerImgFile) {
      if (bannerImgPath) {
        const oldBannerImageRef = ref(getStorage(), bannerImgPathNew);
        deleteObject(oldBannerImageRef);
      }
      const filePath: string = `${userInfoRef.id}/${selectedBannerImgFile.name}`;
      const newBannerImgRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(
        newBannerImgRef,
        selectedBannerImgFile
      );

      publicbannerImg = await getDownloadURL(newBannerImgRef);
      bannerImgPathNew = fileSnapshot.metadata.fullPath;
    }

    // Update the user in DB
    setIsLoading(true);
    await updateDoc(userInfoRef, {
      userName: userNameValue,
      bio: bioValue,
      location: locationValue,
      profileImgUrl: publicImgUrl,
      profileImgPath: profileImgPathNew,
      bannerImgUrl: publicbannerImg,
      bannerImgPath: bannerImgPathNew,
    });

    // Callsback to the parent components to do a state change
    await updateChanges();
    setIsLoading(false);
  };

  const handleUsernameVaidation = (e: any) => {
    const input = e.target;
    const saveBtn = document.querySelector(`.save-edit-profile-button`);

    if (!input.value.replace(/\s/g, "").length) {
      console.log("poop fil this out");
      saveBtn?.classList.add("invalid-save-button");
      input.parentElement.parentElement.classList.add("invalid-input");
      setEditsValid(false);
    } else {
      setEditsValid(true);
      saveBtn?.classList.remove("invalid-save-button");
      input.parentElement.parentElement.classList.remove("invalid-input");
    }
  };

  const handleProfileImgSelection = (e: any) => {
    // Showcase a preview based on local URL and save the file to State to be used to upload to DB
    const imageFiles = e.target.files;
    if (imageFiles.length > 0) {
      setSelectedProfileImgFile(imageFiles[0]);
      // Set preview
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement: any = document.querySelector(
        ".user-profile-image-edit-preview"
      );
      if (imagePreviewElement) imagePreviewElement.src = imageSrc;
    }
  };

  const handleBannerImgSelection = (e: any) => {
    const imageFiles = e.target.files;
    if (imageFiles.length > 0) {
      setSelectedBannerImgFile(imageFiles[0]);
      // Set Preview

      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement: any = document.getElementById(
        "user-profile-banner-edit-preview"
      );
      if (imagePreviewElement) imagePreviewElement.src = imageSrc;
    }
  };

  if (!isVisible) return null;
  return (
    <div className="edit-profile-popup-container">
      <form
        className="edit-profile-popup"
        onSubmit={handleSubmitProfileEdits}
        autoComplete="off"
      >
        {isLoading ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <>
            <header>
              <div
                style={{ display: "flex", alignItems: "center", gap: "28px" }}
              >
                <div
                  className="backout-button"
                  onClick={() => {
                    setShowEditProfile(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        fill="#EFF3F4"
                        d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <h1 className="edit-profile-h1">Edit profile</h1>
              </div>
              <button type="submit" className="save-edit-profile-button">
                Save
              </button>
            </header>
            <div className="current-user-banner">
              <img
                src={bannerImg}
                alt="User banner"
                id="user-profile-banner-edit-preview"
              />
              <div className="profile-banner-input-container">
                <label
                  htmlFor="profile-banner-input"
                  className="banner-file-upload"
                >
                  <input
                    className="profile-banner-input"
                    accept="image/jpeg,image/png,image/webp"
                    type={"file"}
                    id="profile-banner-input"
                    onChange={handleBannerImgSelection}
                  />
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"
                      ></path>
                    </g>
                  </svg>
                </label>
              </div>
            </div>
            <div className="current-user-profile-image">
              <img
                src={profileImg}
                alt="User profile"
                className="user-profile-image-edit-preview"
              />
              <div className="profile-image-input-container">
                <label
                  htmlFor="profile-image-input"
                  className="image-file-upload"
                >
                  <input
                    className="profile-image-input"
                    accept="image/jpeg,image/png,image/webp"
                    type={"file"}
                    id="profile-image-input"
                    onChange={handleProfileImgSelection}
                  />
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"
                      ></path>
                    </g>
                  </svg>
                </label>
              </div>
            </div>
            <div className="edit-profile-inputs">
              <div className="name-input-wrapper">
                <div className="edit-profile-input-div">
                  <input
                    type={"text"}
                    maxLength={50}
                    id="edit-name-input"
                    placeholder=" "
                    defaultValue={userName}
                    onInput={handleUsernameVaidation}
                  />
                  <label htmlFor="edit-name-input">Name</label>
                </div>
              </div>
              <div className="edit-profile-input-div bio-input-div">
                <textarea
                  maxLength={160}
                  id="edit-bio-input"
                  placeholder=" "
                  defaultValue={bio}
                />
                <label className="bio-label" htmlFor="edit-bio-input">
                  Bio
                </label>
              </div>
              <div className="edit-profile-input-div">
                <input
                  type={"text"}
                  maxLength={30}
                  id="edit-location-input"
                  placeholder=" "
                  defaultValue={location}
                />
                <label htmlFor="edit-location-input">Location</label>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
export default EditProfilePopup;
