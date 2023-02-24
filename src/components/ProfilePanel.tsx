import "../styles/ProfilePanel.css";
import ProfilePanelInfo from "./ProfilePanelInfo";
import ProfilePanelNav from "./ProfilePanelNavbar";
import testBanner from "../media/1080x360.jpg";
import { useEffect, useState } from "react";
import { getUserInfo } from "../scripts/firebaseHelperFns";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import useForceUpdate from "./useForceUpdate";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../scripts/firebaseConfig";
import Twat from "./Twat";
import { convertCompilerOptionsFromJson } from "typescript";

interface Twats {
  handle: string;
  text: string;
  timeStamp: {
    date: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    months: number;
    seconds: number;
    years: number;
  };
  timeInMillisecond: number;
}

// Still need features to change pfp picture, profile banner, userName, and bio
const ProfilePanel = ({ currentUser, setCurrentUser }: any) => {
  const forceUpdate = useForceUpdate();
  const [userInfo, setUserInfo] = useState<any>([]);
  const [twatList, setTwatList] = useState<any>({});
  const { handle } = useParams();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  const getUserTwats = async (user: any) => {
    const q = query(
      collection(db, "twats"),
      where("handle", "==", user.userHandle),
      orderBy("timeInMillisecond")
    );
    let twats: any = {};

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          delete twats[change.doc.id];
        } else if (change.type === "added") {
          const twat = change.doc.data();

          twat.id = change.doc.id;
          const twatToAdd: any = {};
          twatToAdd[change.doc.id] = twat;
          twats = Object.assign(twatToAdd, twats);
        } else {
          twats[change.doc.id].userName = change.doc.data().userName;
        }
      });

      setTwatList(twats);
      // Force update because the snapshot listener isnt causing re-render despite setting state each time correctly
      forceUpdate();
    });

    return () => unsub();
  };
  // Grabs a user's info based on the link param
  const getUserFromUrlParam = async () => {
    const user = await getUserInfo(handle);

    setUserInfo(user);
    getUserTwats(user);
  };

  const handleProfileUpdates = async () => {
    getUserFromUrlParam();
    // Safe to use URL handle since you can only edit when inside your own profile
    const user: any = await getUserInfo(handle);

    setCurrentUser(user);
    const q = query(
      collection(db, "twats"),
      where("handle", "==", currentUser.userHandle)
    );

    const twats = await getDocs(q);
    twats.forEach(async (docSnap) => {
      const docRef = doc(db, "twats", docSnap.id);

      await updateDoc(docRef, {
        userName: user?.userName,
      });
    });

    setShowEditProfile(false);
  };
  useEffect(() => {
    getUserFromUrlParam();
  }, []);

  if (!currentUser) return null;
  return (
    <div className="profile-panel-container">
      <div className="profile-panel-top-header">
        <div
          className="back-arrow"
          onClick={() => {
            navigate(-1);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#EFF3F4"
                d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
              ></path>
            </g>
          </svg>
        </div>
        <div className="username-tweet-count">
          <h1>{userInfo.userName}</h1>
          <p>{Object.keys(twatList).length} Tweets</p>
        </div>
      </div>
      <img className="test-box" src={testBanner} alt="test" />
      <ProfilePanelInfo
        user={userInfo}
        currentHandle={currentUser.userHandle}
        showEditPopup={showEditProfile}
        setEditPopup={setShowEditProfile}
        updateChanges={handleProfileUpdates}
      />
      <ProfilePanelNav />
      <div className="user-twat-feed">
        {Object.keys(twatList).map((doc: any, index: number) => {
          return (
            <div key={index}>
              {currentUser.userHandle === twatList[doc].handle ? (
                <Twat twatInfo={twatList[doc]} isDeletable={true} />
              ) : (
                <Twat twatInfo={twatList[doc]} isDeletable={false} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePanel;
