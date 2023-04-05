import { query, collection, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../scripts/firebaseConfig";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUserInfo } from "../../../../scripts/firebaseHelperFns";
import "../../../../styles/UserFollowPanel.css";
import UserFollowPanelMember from "./UserFollowPanelMember";
import InvalidRoutePanel from "../../../Misc/InvalidRoutePanel";
import LoadingPanel from "../../../Misc/LoadingPanel";
import { act } from "react-dom/test-utils";
import EmptyTwatList from "../../../Misc/EmptyTwatList";

interface TabProps {
  tabNum: number;
  title: string;
  handleTabSelect: Function;
  activeTab: number;
}

interface UserFollowPanelProps {
  startTab: string;
  mainUser: any;
}

const UserFollowPanel = ({ startTab, mainUser }: UserFollowPanelProps) => {
  const [activeTab, setActiveTab] = useState<number>(-1);
  const [visitedUser, setVisitedUser] = useState<any>(null);
  const [followLists, setFollowLists] = useState<any>();
  const [activeList, setActiveList] = useState<number>(
    startTab === "following" ? 1 : 2
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { handle } = useParams();
  const navigate = useNavigate();

  const followerQuery = query(
    collection(db, "user-info"),
    where(`followers.${handle}`, "==", true)
  );
  const followingQuery = query(
    collection(db, "user-info"),
    where(`following.${handle}`, "==", true)
  );

  const handleTabSelect = (tabNum: number): void => {
    if (tabNum === activeTab) return;
    navigate(`/${handle}/${tabNum === 1 ? "following" : "followers"}`);
  };

  useEffect(() => {
    if (startTab === "followers") {
      setActiveList(0);
      setActiveTab(0);
      return;
    }
    setActiveList(1);
    setActiveTab(1);
  }, [startTab]);

  useEffect(() => {
    const retrieveUser = async () => {
      const user = await getUserInfo(handle);
      setVisitedUser(user);
    };

    const getFollowLists = async () => {
      const followingList: any = [];
      const followersList: any = [];
      const followingSnap = await getDocs(followingQuery);
      const followersSnap = await getDocs(followerQuery);

      followingSnap.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        if (user.userHandle === handle) return;
        followingList.push(user);
      });

      followersSnap.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;

        followersList.push(user);
      });

      const results: any = [followingList, followersList];
      setFollowLists(results);
    };

    const retrieveUserData = async () => {
      setIsLoading(true);
      await getFollowLists();
      await retrieveUser();
      setIsLoading(false);
    };
    retrieveUserData();
  }, [handle]);
  if (isLoading) return <LoadingPanel />;
  if (activeTab === -1 || !visitedUser || !followLists)
    return <InvalidRoutePanel />;
  return (
    <div className="user-follow-panel">
      <header>
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
        <div className="user-info">
          <h3>{visitedUser.userName}</h3>
          <p>@{visitedUser.userHandle}</p>
        </div>
      </header>
      <nav>
        <ul className="user-follow-panel-navbar">
          <Tab
            tabNum={0}
            title="Followers"
            activeTab={activeTab}
            handleTabSelect={handleTabSelect}
          />
          <Tab
            tabNum={1}
            title="Following"
            activeTab={activeTab}
            handleTabSelect={handleTabSelect}
          />
        </ul>
      </nav>
      {followLists[activeList].length < 1 ? (
        <EmptyTwatList
          isMainUser={!mainUser ? false : mainUser.userHandle === handle}
          visitedUserHandle={handle}
          tab={startTab}
        />
      ) : (
        followLists[activeList].map((userDoc: any) => {
          return (
            <UserFollowPanelMember
              mainUser={mainUser}
              userInfo={userDoc}
              key={userDoc.id}
            />
          );
        })
      )}
    </div>
  );
};

const Tab: React.FC<TabProps> = ({
  tabNum,
  title,
  handleTabSelect,
  activeTab,
}) => (
  <li onClick={() => handleTabSelect(tabNum)}>
    <span className={activeTab === tabNum ? "selected-follow-panel-tab" : ""}>
      {title}
    </span>
  </li>
);

export default UserFollowPanel;
