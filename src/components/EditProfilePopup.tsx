import "../styles/EditProfilePopup.css";
import placeholderBanner from "../media/1080x360.jpg";
import placeholderPfp from "../media/defaultpfp.jpg";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../scripts/firebaseConfig";

interface EditProfilePopupProps {
  isVisible: boolean;
  userName: string;
  bio: string;
  location: string;
  docId: string;
}

const EditProfilePopup = ({
  isVisible,
  userName,
  bio,
  location,
  docId,
}: EditProfilePopupProps) => {
  const handleSubmitProfileEdits = async (e: any) => {
    e.preventDefault();
    const userInfoRef = doc(db, "user-info", docId);
    await updateDoc(userInfoRef, {
      userName: (document.getElementById("edit-name-input") as HTMLInputElement)
        .value,
    });
    console.log(docId);
    console.log("hi");
  };

  if (!isVisible) return null;
  return (
    <div className="edit-profile-popup-container">
      <form className="edit-profile-popup" onSubmit={handleSubmitProfileEdits}>
        <header>
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <div className="backout-button">
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
          <img src={placeholderBanner} alt="User banner" />
        </div>
        <div className="current-user-profile-image">
          <img src={placeholderPfp} alt="User profile" />
        </div>
        <div className="edit-profile-inputs">
          <div className="edit-profile-input-div">
            <input
              type={"text"}
              maxLength={50}
              minLength={1}
              id="edit-name-input"
              placeholder=" "
              defaultValue={userName}
            />
            <label htmlFor="edit-name-input">Name</label>
          </div>
          <div className="edit-profile-input-div bio-input-div">
            <textarea
              maxLength={160}
              minLength={1}
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
              maxLength={50}
              minLength={1}
              id="edit-location-input"
              placeholder=" "
              defaultValue={location}
            />
            <label htmlFor="edit-location-input">Location</label>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditProfilePopup;
