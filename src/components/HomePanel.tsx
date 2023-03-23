import "../styles/HomePanel.css";
import { signOutUser } from "../scripts/firebaseHelperFns";
import HomePanelNavbar from "./HomePanelNavbar";
import ExploreTweetTopic from "./ExploreTweetTopic";
import HomePanelTweetInput from "./HomePanelTweetInput";
import { useEffect, useState } from "react";
import {
  collection,
  where,
  orderBy,
  limit,
  query,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../scripts/firebaseConfig";
import Twat from "./Twat";

interface HomePanelProps {
  currentUser?: {
    profileImgUrl: string;
    following: {
      [key: string]: boolean;
    };
  };
}

const Home = ({ currentUser }: any) => {
  const [twatList, setTwatList] = useState<any>({});
  const [followingQuery, setFollowingQuery] = useState<any>();
  const [tab, setTab] = useState<string>("For you");

  const fetchTwats = async (q: any) => {
    let twats: any = {};
    const twatSnapshot = await getDocs(q);
    twatSnapshot.forEach((doc) => {
      const twat: any = doc.data();
      twat.id = doc.id;
      twats[twat.id] = twat;
    });
    return twats;
  };

  useEffect(() => {
    const queryFollowingTwats = async () => {
      if (!currentUser || tab !== "Following") return;
      const following = Object.keys(currentUser.following);

      if (following.length === 0) return;

      const q = query(
        collection(db, "twats"),
        where("handle", "in", following),
        orderBy("timeInMillisecond", "desc"),
        limit(40)
      );

      let twats: any = await fetchTwats(q);

      setTwatList(twats);
    };

    queryFollowingTwats();
  }, [currentUser, tab]);

  useEffect(() => {
    // Make sure current user is there
    if (Object.keys(currentUser).length === 0) return;
    const following = Object.keys(currentUser.following);
    if (following.length === 0) return;

    const q = query(
      collection(db, "twats"),
      where("handle", "in", following),
      orderBy("timeInMillisecond", "desc"),
      limit(40)
    );
    const unsub = onSnapshot(q, async (snapshot) => {
      let twats = await fetchTwats(q);
      setTwatList(twats);
    });

    return () => unsub();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="home-panel-container">
      <div className="home-panel-header">
        <HomePanelNavbar setTab={setTab} />
      </div>
      <div className="home-panel-main-feed">
        <HomePanelTweetInput currentUser={currentUser} />
        {tab !== "Following" ? (
          <div>
            <ExploreTweetTopic
              topicTitle="$AAPL"
              tweets={5300}
              trendingTopic="Businesss and finance"
            />
            <ExploreTweetTopic
              topicTitle="$AAPL"
              tweets={5300}
              trendingTopic="Businesss and finance"
            />
          </div>
        ) : (
          <div>
            {Object.keys(twatList).map((doc: any, index: number) => {
              return (
                <div key={index}>
                  {currentUser.userHandle === twatList[doc].handle ? (
                    <Twat
                      twatInfo={twatList[doc]}
                      isDeletable={true}
                      currentHandle={currentUser.userHandle}
                      isThreaded={false}
                    />
                  ) : (
                    <Twat
                      twatInfo={twatList[doc]}
                      isDeletable={false}
                      currentHandle={currentUser.userHandle}
                      isThreaded={false}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
