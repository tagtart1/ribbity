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
import EmptyRibbitList from "../../Misc/EmptyRibbitList";

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

  const [ribbitList, setRibbitList] = useState<any>([]);
  const { handle, tab } = useParams();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  const getUserRibbits = async () => {
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
      setRibbitList([]);
      return;
    }
    // Query replies by

    let ribbits: any = [];
    const ribbitSnapshot = await getDocs(q);
    ribbitSnapshot.forEach(async (doc) => {
      const ribbit: any = doc.data();

      ribbit.id = doc.id;
      ribbits.push(ribbit);
    });

    setRibbitList(sortByTimeInSecondsDescending(ribbits));
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
          <EmptyRibbitList
            tab="likes"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );
      case undefined:
        return (
          <EmptyRibbitList
            tab="twats"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );
      case "replies":
        return (
          <EmptyRibbitList
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
    getUserRibbits();
    await getViewedUser("no_load");
    setIsLoading(false);
  };
  // For when the user edits their profile
  const handleProfileUpdates = async () => {
    // Safe to use URL handle since you can only edit when inside your own profile
    // Reget the user
    const user: any = await getUserInfo(handle);

    setCurrentUser(user);
    // Change all ribbits with updated info
    const q = query(collection(db, "twats"), where("handle", "==", handle));
    const ribbits = await getDocs(q);
    ribbits.forEach(async (docSnap) => {
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
    getUserRibbits();
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
        <div className="username-ribbit-count">
          <h1>{visitedUserInfo.userName}</h1>
          <p>
            {ribbitList.length}{" "}
            {tab === "likes"
              ? ribbitList.length === 1
                ? "Like"
                : "Likes"
              : "Ribbits"}
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

      <div className="user-ribbit-feed">
        {tab === "media" ? (
          <WorkInProgress />
        ) : ribbitList.length < 1 ? (
          emptyTabSwitch()
        ) : (
          ribbitList.map((doc: any) => {
            return (
              <Ribbit
                ribbitInfo={doc}
                isDeletable={
                  currentUser.userHandle === doc.handle ? true : false
                }
                currentHandle={currentUser.userHandle}
                refreshRibbits={getUserRibbits}
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
