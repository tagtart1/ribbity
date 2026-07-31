import "../../../styles/ProfilePanel.css";
import ProfilePanelInfo from "./ProfilePanelInfo";
import ProfilePanelNav from "./ProfilePanelNavbar";

import { ReactNode, useEffect, useState } from "react";
import { getUserInfo } from "../../../scripts/firebaseHelperFns";

import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  Query,
  QuerySnapshot,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import Ribbit from "../../Ribbit/Ribbit";

import {
  sortByTimeInSecondsDescending,
  sortRibbitsWithReRibbits,
} from "../../../scripts/HelperFns";
import WorkInProgress from "../../Misc/WorkInProgress";
import InvalidRoutePanel from "../../Misc/InvalidRoutePanel";
import Spinner from "../../Misc/Spinner";
import LoadingPanel from "../../Misc/LoadingPanel";
import EmptyRibbitList from "../../Misc/EmptyRibbitList";
import { RibbitType, RibbityUser } from "../../../Ribbity.types";
import RibbityVerifyIcon from "../../../media/svg/RibbityVerifyIcon";
import RibbitButtonFixed from "../../Mobile/RibbitButtonFixed";

type QuerySnap = QuerySnapshot<DocumentData>;
type DocRef = DocumentReference<DocumentData>;

const ProfilePanel = ({
  currentUser,
  setCurrentUser,
  setShowWhoToFollow,
}: any) => {
  // This is the user in which the :handle route param corresponds to, could be main user
  const [visitedUserInfo, setVisitedUserInfo] = useState<RibbityUser>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Another loading state that doesnt show a loading icon, used for switching tabs
  const [isLoadingInternal, setIsLoadingInternal] = useState<boolean>(true);

  const [ribbitList, setRibbitList] = useState<RibbitType[]>([]);
  const { handle, tab } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  const getUserRibbits = async (): Promise<void> => {
    let grabReRibbits: boolean = false;
    let reribbitQ: Query | null = null;
    let q: Query;
    setIsLoadingInternal(true);
    if (tab === "ribbits" || tab === undefined) {
      q = query(
        collection(db, "ribbits"),
        where("handle", "==", handle),
        where("isComment", "==", false)
      );
      reribbitQ = query(
        collection(db, "ribbits"),
        where(`reribbitedBy.${handle}`, "!=", null)
      );
      grabReRibbits = true;
    } else if (tab === "likes") {
      q = query(
        collection(db, "ribbits"),
        where(`likedBy.${handle}`, "==", true)
      );
    } else if (tab === "replies") {
      q = query(
        collection(db, "ribbits"),
        where("handle", "==", handle),
        where("isComment", "==", true),
        where(`replyingTo.handle`, "!=", handle)
      );
    } else if (tab === "media") {
      q = query(
        collection(db, "ribbits"),
        where("handle", "==", handle),

        where("mediaUrl", "!=", "")
      );
    } else {
      setRibbitList([]);
      return;
    }
    // Query replies by

    let ribbits: RibbitType[] = [];
    const ribbitSnapshot: QuerySnap = await getDocs(q);
    ribbitSnapshot.forEach((doc: any) => {
      const ribbit: RibbitType = doc.data();

      ribbit.id = doc.id;
      ribbits.push(ribbit);
    });

    if (grabReRibbits) {
      if (reribbitQ != null) {
        const reribbitSnapshot = await getDocs(reribbitQ);

        reribbitSnapshot.forEach((doc: any) => {
          const ribbit: RibbitType = doc.data();

          ribbit.id = doc.id;
          ribbits.push(ribbit);
        });
      }
      setRibbitList(sortRibbitsWithReRibbits(ribbits, handle));
      setIsLoadingInternal(false);
      return;
    }

    setRibbitList(sortByTimeInSecondsDescending(ribbits));
    setIsLoadingInternal(false);
  };

  const emptyTabSwitch = (): ReactNode => {
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

      case "replies":
        return (
          <EmptyRibbitList
            tab="replies"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );

      case "media":
        return (
          <EmptyRibbitList
            tab="media"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );
      default:
        return (
          <EmptyRibbitList
            tab="ribbits"
            isMainUser={currentUser.userHandle === handle}
            visitedUserHandle={handle}
          />
        );
    }
  };

  const getViewedUser = async (shouldLoad?: string): Promise<void> => {
    if (shouldLoad === undefined) setIsLoading(true);
    const user: RibbityUser | null | undefined = await getUserInfo(handle);

    setVisitedUserInfo(user);
    setIsLoading(false);
  };

  const refreshUserUI = async (): Promise<void> => {
    getViewedUser("no_load");
    // This will refresh the entire application with updates follower counts and queries

    const mainUser: RibbityUser | null | undefined = await getUserInfo(
      currentUser.userHandle
    );
    setCurrentUser(mainUser);
  };
  // Grabs a user's info based on the link param
  const getUserFromUrlParam = async (showLoad?: string): Promise<void> => {
    if (showLoad === undefined) {
      setIsLoading(true);
    }
    getUserRibbits();
    await getViewedUser("no_load");
    setIsLoading(false);
  };
  // For when the user edits their profile
  const handleProfileUpdates = async (): Promise<void> => {
    // Safe to use URL handle since you can only edit when inside your own profile
    // Reget the user
    const user: RibbityUser | undefined = await getUserInfo(handle);
    if (!user.userHandle) return;
    setCurrentUser(user);
    // Change all ribbits with updated info
    const q: Query = query(
      collection(db, "ribbits"),
      where("handle", "==", handle)
    );
    const ribbits: QuerySnap = await getDocs(q);
    ribbits.forEach(async (docSnap: any) => {
      const docRef: DocRef = doc(db, "ribbits", docSnap.id);

      await updateDoc(docRef, {
        userName: user?.userName,
        userProfileImg: user?.profileImgUrl,
      });
    });
    // Reget the ribbits and user
    getUserFromUrlParam("no_load");

    setShowEditProfile(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const q: Query = query(
      collection(db, "ribbits"),
      where("handle", "==", handle),
      orderBy("timeInMillisecond", "desc")
    );

    const unsub = onSnapshot(q, (snapshot: QuerySnap) => {
      if (tab === "likes " || tab === "replies" || tab === "media") return; // Assures we dont pull all ribbits into wrong tab

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          getUserFromUrlParam("no_load");
        }
        if (change.type === "modified") {
          console.log("hey modfied a ribbit");
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
  if (!visitedUserInfo || !visitedUserInfo.userHandle)
    return <InvalidRoutePanel />;
  return (
    <main className="profile-panel-container">
      <header className="profile-panel-top-header">
        <button
          className="back-arrow"
          onClick={() => {
            navigate(-1);
          }}
          aria-label="navigate back"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                fill="#EFF3F4"
                d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
              ></path>
            </g>
          </svg>
        </button>
        <div className="username-ribbit-count">
          <h1 className="username-profile-top-group">
            <span className="user-name">{visitedUserInfo.userName}</span>
            {visitedUserInfo.userHandle === currentUser.userHandle ? (
              currentUser.isVerified ? (
                <span className="verified-icon">
                  <RibbityVerifyIcon />
                </span>
              ) : null
            ) : visitedUserInfo.isVerified ? (
              <span className="verified-icon">
                <RibbityVerifyIcon />
              </span>
            ) : null}
          </h1>
          <p>
            {ribbitList.length}{" "}
            {tab === "likes"
              ? ribbitList.length === 1
                ? "Like"
                : "Likes"
              : "Ribbits"}
          </p>
        </div>
      </header>
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
        {ribbitList.length < 1
          ? emptyTabSwitch()
          : ribbitList.map((doc: any) => {
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
                  isReRibbit={
                    doc.reribbitedBy[visitedUserInfo.userHandle] != null
                      ? true
                      : false
                  }
                  ReRibbitedByInfo={{
                    userName: visitedUserInfo.userName,
                    userHandle: visitedUserInfo.userHandle,
                  }}
                />
              );
            })}
      </div>
      <RibbitButtonFixed />
    </main>
  );
};

export default ProfilePanel;
