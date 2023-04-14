import "../../../styles/HomePanel.css";
import { signOutUser } from "../../../scripts/firebaseHelperFns";
import HomePanelNavbar from "./HomePanelNavbar";
import ExploreRibbitTopic from "../Explore/ExploreTweetTopic";
import HomePanelRibbitInput from "./HomePanelRibbitInput";
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
  const [ribbitList, setRibbitList] = useState<any>({});
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const [tab, setTab] = useState<string>("For you");

  const fetchRibbits = async (q: any) => {
    let ribbits: any = {};
    const ribbitSnapshot = await getDocs(q);
    ribbitSnapshot.forEach((doc) => {
      const ribbit: any = doc.data();
      ribbit.id = doc.id;
      ribbits[ribbit.id] = ribbit;
    });
    return ribbits;
  };

  const removeRibbitLocal = (tab: any, id: string) => {
    const copyList = { ...ribbitList };
    console.log(copyList[id]);
    delete copyList[id];
    setRibbitList(copyList);
  };

  const addRibbitLocal = (id: string, twatInfo: any) => {
    const ribbit = twatInfo;
    ribbit.id = id;
    const newTwat = { [id]: ribbit };

    setRibbitList((prevState: any) => ({ ...newTwat, ...prevState }));
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

      let twats: any = await fetchRibbits(q);

      setRibbitList(twats);
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
            if (ribbitList[change.doc.id]) return;
            console.log("addition");
            addRibbitLocal(change.doc.id, change.doc.data());
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
        <HomePanelRibbitInput currentUser={currentUser} />

        <div>
          {Object.keys(ribbitList).map((doc: any) => {
            return (
              <Ribbit
                twatInfo={ribbitList[doc]}
                isDeletable={
                  currentUser.userHandle === ribbitList[doc].handle
                    ? true
                    : false
                }
                currentHandle={currentUser.userHandle}
                isThreaded={false}
                key={ribbitList[doc].id}
                refreshTwats={removeRibbitLocal}
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
