import "../../../styles/ProfilePanel.css";
import ProfilePanelInfo from "./ProfilePanelInfo";
import ProfilePanelNav from "./ProfilePanelNavbar";
import testBanner from "../media/1080x360.jpg";
import { useEffect, useState } from "react";
import { getUserHandle, getUserInfo } from "../../../scripts/firebaseHelperFns";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";

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
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import Ribbit from "../../Ribbit/Ribbit";

import { sortByTimeInSecondsDescending } from "../../../scripts/HelperFns";
import WorkInProgress from "../../Misc/WorkInProgress";
import InvalidRoutePanel from "../../Misc/InvalidRoutePanel";
import Spinner from "../../Misc/Spinner";
import LoadingPanel from "../../Misc/LoadingPanel";
import EmptyTwatList from "../../Misc/EmptyTwatList";

// Still need features to change pfp picture, profile banner, userName, and bio
const ProfilePanel = ({
  currentUser,
  setCurrentUser,
  setShowWhoToFollow,
}: any) => {
  // This is the user in which the :handle route param corresponds to, could be main user
  const [visitedUserInfo, setVisitedUserInfo] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Another loading state that doesnt show a loading icon, used for switching tabs
  const [isLoadingInternal, setIsLoadingInternal] = useState<boolean>(true);

  const [twatList, setTwatList] = useState<any>([]);
  const { handle, tab } = useParams();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  const getUserTwats = async () => {
    let q: any;
    setIsLoadingInternal(true);
    if (tab === "twats" || tab === undefined) {
      q = query(
        collection(db, "twats"),
        where("handle", "==", handle),
        where("isComment", "==", false)
      );
    } else if (tab === "likes") {
      q = query(
        collection(db, "twats"),
        where(`likedBy.${handle}`, "==", true)
      );
    } else if (tab === "replies") {
      q = query(
        collection(db, "twats"),
        where("handle", "==", handle),
        where("isComment", "==", true),
        where(`replyingTo.handle`, "!=", handle)
      );
    } else {
      setTwatList([]);
      return;
    }
    // Query replies by

    let twats: any = [];
    const twatSnapshot = await getDocs(q);
    twatSnapshot.forEach(async (doc) => {
      const twat: any = doc.data();

      twat.id = doc.id;
      twats.push(twat);
    });

    setTwatList(sortByTimeInSecondsDescending(twats));
    setIsLoadingInternal(false);
  };

  const emptyTabSwitch = () => {
    if (isLoadingInternal)
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Spinner />
        </div>
      );
    switch (tab) {
      case "likes":
        return (
          <EmptyTwatList
            tab="likes"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );
      case undefined:
        return (
          <EmptyTwatList
            tab="twats"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );
      case "replies":
        return (
          <EmptyTwatList
            tab="replies"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );
    }
  };

  const getViewedUser = async (shouldLoad?: string) => {
    if (shouldLoad === undefined) setIsLoading(true);
    const user = await getUserInfo(handle);

    setVisitedUserInfo(user);
    setIsLoading(false);
  };

  const refreshUserUI = async () => {
    getViewedUser("no_load");
    // This will refresh the entire application with updates follower counts and queries

    const mainUser = await getUserInfo(currentUser.userHandle);
    setCurrentUser(mainUser);
  };
  // Grabs a user's info based on the link param
  const getUserFromUrlParam = async (showLoad?: string) => {
    if (showLoad === undefined) {
      setIsLoading(true);
    }
    getUserTwats();
    await getViewedUser("no_load");
    setIsLoading(false);
  };
  // For when the user edits their profile
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
    getUserFromUrlParam("no_load");

    setShowEditProfile(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
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
          getUserFromUrlParam("no_load");
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
  }, [handle]);

  useEffect(() => {
    getUserTwats();
  }, [tab]);

  if (isLoading) return <LoadingPanel />;
  if (!visitedUserInfo) return <InvalidRoutePanel />;
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
          <p>
            {twatList.length}{" "}
            {tab === "likes"
              ? twatList.length === 1
                ? "Like"
                : "Likes"
              : "Twats"}
          </p>
        </div>
      </div>
      <img
        className="user-banner"
        src={visitedUserInfo.bannerImgUrl}
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
        {tab === "media" ? (
          <WorkInProgress />
        ) : twatList.length < 1 ? (
          emptyTabSwitch()
        ) : (
          twatList.map((doc: any) => {
            return (
              <Ribbit
                twatInfo={doc}
                isDeletable={
                  currentUser.userHandle === doc.handle ? true : false
                }
                currentHandle={currentUser.userHandle}
                refreshTwats={getUserTwats}
                isThreaded={false}
                key={doc.id}
                inShowcase={false}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProfilePanel;
