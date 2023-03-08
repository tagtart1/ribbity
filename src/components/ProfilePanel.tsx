import "../styles/ProfilePanel.css";
import ProfilePanelInfo from "./ProfilePanelInfo";
import ProfilePanelNav from "./ProfilePanelNavbar";
import testBanner from "../media/1080x360.jpg";
import { useEffect, useState } from "react";
import { getUserHandle, getUserInfo } from "../scripts/firebaseHelperFns";

import {
  useNavigate,
  useParams,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";

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

import defaultBannerImg from "../media/defaultBanner.png";

// Still need features to change pfp picture, profile banner, userName, and bio
const ProfilePanel = ({
  currentUser,
  setCurrentUser,
  setShowWhoToFollow,
}: any) => {
  const [visitedUserInfo, setVisitedUserInfo] = useState<any>();
  const [twatList, setTwatList] = useState<any>({});
  const { handle, tab } = useParams();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  const getUserTwats = async (tab?: string) => {
    let q: any;
    if (tab === "twats" || tab === undefined) {
      q = query(
        collection(db, "twats"),
        where("handle", "==", handle),
        orderBy("timeInMillisecond", "desc")
      );
    } else if (tab === "likes") {
      q = query(
        collection(db, "twats"),
        where("likedBy", "array-contains", handle),
        orderBy("timeInMillisecond", "desc")
      );
    }

    let twats: any = {};
    const twatSnapshot = await getDocs(q);
    twatSnapshot.forEach((doc) => {
      const twat: any = doc.data();
      twat.id = doc.id;
      twats[twat.id] = twat;
    });
    setTwatList(twats);
  };

  const getViewedUser = async () => {
    const user = await getUserInfo(handle);

    setVisitedUserInfo(user);
  };

  const refreshUserUI = async () => {
    getViewedUser();
    // This will refresh the entire application with updates follower counts and queries

    const mainUser = await getUserInfo(currentUser.userHandle);
    setCurrentUser(mainUser);
  };
  // Grabs a user's info based on the link param
  const getUserFromUrlParam = async () => {
    getUserTwats(tab);
    getViewedUser();
  };

  const handleProfileUpdates = async () => {
    // Safe to use URL handle since you can only edit when inside your own profile
    // Reget the user
    const user: any = await getUserInfo(handle);

    setCurrentUser(user);
    // Change all twats with updates info
    const q = query(collection(db, "twats"), where("handle", "==", handle));
    const twats = await getDocs(q);
    twats.forEach(async (docSnap) => {
      const docRef = doc(db, "twats", docSnap.id);

      await updateDoc(docRef, {
        userName: user?.userName,
        userProfileImg: user?.profileImgUrl,
      });
    });
    // Reget the twats and user
    getUserFromUrlParam();

    setShowEditProfile(false);
  };

  useEffect(() => {
    const q = query(
      collection(db, "twats"),
      where("handle", "==", handle),
      orderBy("timeInMillisecond", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (tab === "likes") return; // Assures we dont pull all twats into wrong tab, may need readjustmust if adding media
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("snapshot!");
          getUserFromUrlParam();
        }
      });
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Prevents reccommending users while already at a user
    if (handle !== currentUser.userHandle) {
      setShowWhoToFollow(false);
    } else setShowWhoToFollow(true);

    getUserFromUrlParam();

    return () => {
      setShowWhoToFollow(true);
    };
  }, [handle, tab]);

  if (!currentUser || !visitedUserInfo) return <div className="loading"></div>;
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
          <h1>{visitedUserInfo.userName}</h1>
          <p>{Object.keys(twatList).length} Tweets</p>
        </div>
      </div>
      <img
        className="user-banner"
        src={visitedUserInfo.bannerImgUrl || defaultBannerImg}
        alt="User Banner"
      />
      <ProfilePanelInfo
        visitedUser={visitedUserInfo}
        currentUser={currentUser}
        showEditPopup={showEditProfile}
        setEditPopup={setShowEditProfile}
        updateChanges={handleProfileUpdates}
        refreshUserUI={refreshUserUI}
      />
      <ProfilePanelNav />

      <div className="user-twat-feed">
        {Object.keys(twatList).map((doc: any, index: number) => {
          return (
            <div key={index}>
              {currentUser.userHandle === twatList[doc].handle ? (
                <Twat
                  twatInfo={twatList[doc]}
                  isDeletable={true}
                  currentHandle={currentUser.userHandle}
                  refreshTwats={getUserTwats}
                />
              ) : (
                <Twat
                  twatInfo={twatList[doc]}
                  isDeletable={false}
                  currentHandle={currentUser.userHandle}
                  refreshTwats={getUserTwats}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePanel;
