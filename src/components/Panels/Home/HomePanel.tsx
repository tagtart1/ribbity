import "../../../styles/HomePanel.css";
import HomePanelNavbar from "./HomePanelNavbar";
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
  Query,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import Ribbit from "../../Ribbit/Ribbit";
import { RibbitType, RibbityUser } from "../../../Ribbity.types";

import RibbitButtonFixed from "../../Mobile/RibbitButtonFixed";

interface HomePanelProps {
  mainUser: RibbityUser;
}

interface RibbitListState {
  [key: string]: RibbitType;
}

// Type alias
type FBQuery = Query<DocumentData>;
type FBQuerySnap = QuerySnapshot<DocumentData>;

const Home = ({ mainUser }: HomePanelProps) => {
  const [ribbitList, setRibbitList] = useState<RibbitListState>({});
  // Ensures the snapshot doesnt always subscribe when not needed
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [tab, setTab] = useState<string>("For you");

  // Grab the ribbits from the firebase DB
  const fetchRibbits = async (q: FBQuery): Promise<RibbitListState> => {
    let ribbits: RibbitListState = {};
    const ribbitSnapshot: FBQuerySnap = await getDocs(q);
    ribbitSnapshot.forEach((doc: any) => {
      const ribbit: RibbitType = doc.data();
      ribbit.id = doc.id;
      ribbits[ribbit.id] = ribbit;
    });
    return ribbits;
  };
  // Remove the ribbit from the UI when a user deletes it
  const removeRibbitLocal = (tab: any, id: string): void => {
    const copyList = { ...ribbitList };

    delete copyList[id];
    setRibbitList(copyList);
  };
  // Add ribbit to the UI after the user ribbits
  const addRibbitLocal = (id: string, ribbitInfo: RibbitType): void => {
    const ribbit: RibbitType = ribbitInfo;
    ribbit.id = id;
    const newRibbit = { [id]: ribbit };

    setRibbitList((prevState: any) => ({ ...newRibbit, ...prevState }));
  };

  useEffect(() => {
    // Query the ribbits for the 'Following' tab inside home panel
    const queryFollowingRibbits = async (): Promise<void> => {
      if (!mainUser) return;
      const following: string[] = Object.keys(mainUser.following);

      let q: FBQuery;
      if (tab !== "Following") {
        q = query(
          collection(db, "ribbits"),
          limit(20),

          orderBy("timeInMillisecond", "desc")
        );
      } else {
        q = query(
          collection(db, "ribbits"),
          where("handle", "in", following),
          where("isComment", "==", false),
          orderBy("timeInMillisecond", "desc"),
          limit(40)
        );
      }

      let ribbits: RibbitListState = await fetchRibbits(q);

      setRibbitList(ribbits);
    };
    queryFollowingRibbits();
  }, [mainUser, tab]);

  useEffect(() => {
    const q = query(
      collection(db, "ribbits"),
      limit(20),

      orderBy("timeInMillisecond", "desc")
    );
    // Listens for any new ribbits in the DB to add to the UI
    const unsub = onSnapshot(q, (snapshot: FBQuerySnap) => {
      if (isFirstRender) {
        setIsFirstRender(false);
      } else {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === "added") {
            if (
              ribbitList[change.doc.id] ||
              change.doc.data().handle !== mainUser.userHandle
            )
              return;

            addRibbitLocal(change.doc.id, change.doc.data());
            console.log(change.doc.data().handle);
          }
        });
      }
    });

    return () => {
      unsub();
    };
  }, [isFirstRender]);

  if (!mainUser) return null;

  return (
    <main className="home-panel-container">
      <div className="home-panel-header">
        <HomePanelNavbar setTab={setTab} />
      </div>
      <div className="home-panel-main-feed">
        <HomePanelRibbitInput mainUser={mainUser} />

        <div>
          {Object.keys(ribbitList).map((doc: any) => {
            return (
              <Ribbit
                ribbitInfo={ribbitList[doc]}
                isDeletable={
                  mainUser.userHandle === ribbitList[doc].handle ? true : false
                }
                currentHandle={mainUser.userHandle}
                isThreaded={false}
                key={ribbitList[doc].id}
                refreshRibbits={removeRibbitLocal}
                inShowcase={false}
                isReRibbit={false}
              />
            );
          })}
        </div>
      </div>
      <RibbitButtonFixed />
    </main>
  );
};

export default Home;
