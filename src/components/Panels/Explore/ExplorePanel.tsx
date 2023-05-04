import "../../../styles/ExplorePanel.css";
import ExplorePanelNavbar from "./ExplorePanelNavbar";
import ExplorePanelSearch from "./ExplorePanelSearch";
import ExploreTopicFeedRandom from "./ExploreTopicFeedRandom";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  limit,
  getDocs,
  Query,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import Ribbit from "../../Ribbit/Ribbit";
import LoadingPanel from "../../Misc/LoadingPanel";
import { RibbitType, RibbityUser } from "../../../Ribbity.types";
import RibbitButtonFixed from "../../Mobile/RibbitButtonFixed";

interface ExplorePanelProps {
  mainUser: RibbityUser;
}

interface RibbitListState {
  [key: string]: RibbitType;
}

// Type alias
type FBQuery = Query<DocumentData>;
type FBQuerySnap = QuerySnapshot<DocumentData>;

const ExplorePanel = ({ mainUser }: ExplorePanelProps) => {
  const [ribbitsList, setRibbitsList] = useState<RibbitListState>({});
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const allRibbitsQuery: FBQuery = query(
      collection(db, "ribbits"),
      limit(30)
    );
    const fetchRibbits = async (q: FBQuery): Promise<void> => {
      let ribbits: RibbitListState = {};

      const ribbitSnapshot: FBQuerySnap = await getDocs(q);

      ribbitSnapshot.forEach((doc: any) => {
        const ribbit: RibbitType = doc.data();
        ribbit.id = doc.id;
        ribbits[ribbit.id] = ribbit;
      });
      setRibbitsList(ribbits);
    };
    setIsLoading(true);
    fetchRibbits(allRibbitsQuery);

    setIsLoading(false);
  }, []);

  const removeRibbitLocal = (tab: any, id: string): void => {
    const copyList = { ...ribbitsList };

    delete copyList[id];
    setRibbitsList(copyList);
  };

  if (isLoading) return <LoadingPanel />;
  return (
    <main className="explore-panel-container">
      <div className="explore-panel-header">
        <ExplorePanelSearch />
        <ExplorePanelNavbar setActiveTab={setActiveTab} />
      </div>
      <div className="explore-main-feed">
        {activeTab === 0 ? (
          Object.keys(ribbitsList).map((docId: string) => {
            return (
              <Ribbit
                isDeletable={mainUser.userHandle === ribbitsList[docId].handle}
                isThreaded={false}
                inShowcase={false}
                ribbitInfo={ribbitsList[docId]}
                currentHandle={mainUser.userHandle}
                key={ribbitsList[docId].id}
                isReRibbit={false}
                refreshRibbits={removeRibbitLocal}
              />
            );
          })
        ) : (
          <ExploreTopicFeedRandom />
        )}
      </div>
      <RibbitButtonFixed />
    </main>
  );
};

export default ExplorePanel;
