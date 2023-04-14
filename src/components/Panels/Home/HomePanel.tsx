import "../../../styles/HomePanel.css";
import { signOutUser } from "../../../scripts/firebaseHelperFns";
import HomePanelNavbar from "./HomePanelNavbar";
import ExploreTweetTopic from "../Explore/ExploreTweetTopic";
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
import { db } from "../../../scripts/firebaseConfig";
import Ribbit from "../../Ribbit/Ribbit";

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
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

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

  const removeTwatLocal = (tab: any, id: string) => {
    const copyList = { ...twatList };
    console.log(copyList[id]);
    delete copyList[id];
    setTwatList(copyList);
  };

  const addTwatLocal = (id: string, twatInfo: any) => {
    const twat = twatInfo;
    twat.id = id;
    const newTwat = { [id]: twat };

    setTwatList((prevState: any) => ({ ...newTwat, ...prevState }));
  };

  useEffect(() => {
    const queryFollowingTwats = async () => {
      if (!currentUser) return;
      const following = Object.keys(currentUser.following);

      let q;
      if (tab !== "Following") {
        q = query(collection(db, "twats"), limit(30));
      } else {
        q = query(
          collection(db, "twats"),
          where("handle", "in", following),
          where("isComment", "==", false),
          orderBy("timeInMillisecond", "desc"),
          limit(40)
        );
      }

      let twats: any = await fetchTwats(q);

      setTwatList(twats);
    };
    queryFollowingTwats();
  }, [currentUser, tab]);

  useEffect(() => {
    const q = query(
      collection(db, "twats"),
      where("handle", "==", currentUser.userHandle)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (isFirstRender) {
        console.log("firsted");
        setIsFirstRender(false);
      } else {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            if (twatList[change.doc.id]) return;
            console.log("addition");
            addTwatLocal(change.doc.id, change.doc.data());
          }
        });
      }
    });

    return () => {
      unsub();
    };
  }, [isFirstRender]);

  if (!currentUser) return null;

  return (
    <div className="home-panel-container">
      <div className="home-panel-header">
        <HomePanelNavbar setTab={setTab} />
      </div>
      <div className="home-panel-main-feed">
        <HomePanelTweetInput currentUser={currentUser} />

        <div>
          {Object.keys(twatList).map((doc: any) => {
            return (
              <Ribbit
                twatInfo={twatList[doc]}
                isDeletable={
                  currentUser.userHandle === twatList[doc].handle ? true : false
                }
                currentHandle={currentUser.userHandle}
                isThreaded={false}
                key={twatList[doc].id}
                refreshTwats={removeTwatLocal}
                inShowcase={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
