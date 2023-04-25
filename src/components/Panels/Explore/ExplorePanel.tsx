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

interface ExplorePanelProps {
  mainUser: RibbityUser;
}

// Type alias
type FBQuery = Query<DocumentData>;
type FBQuerySnap = QuerySnapshot<DocumentData>;

const ExplorePanel = ({ mainUser }: ExplorePanelProps) => {
  const [ribbitsList, setRibbitsList] = useState<RibbitType[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const allRibbitsQuery: FBQuery = query(
      collection(db, "ribbits"),
      limit(30)
    );
    const fetchRibbits = async (q: FBQuery): Promise<void> => {
      let ribbits: RibbitType[] = [];

      const ribbitSnapshot: FBQuerySnap = await getDocs(q);

      ribbitSnapshot.forEach((doc: any) => {
        const ribbit: RibbitType = doc.data();
        ribbit.id = doc.id;
        ribbits.push(ribbit);
      });
      setRibbitsList(ribbits);
    };
    setIsLoading(true);
    fetchRibbits(allRibbitsQuery);

    setIsLoading(false);
  }, []);

  if (isLoading) return <LoadingPanel />;
  return (
    <div className="explore-panel-container">
      <div className="explore-panel-header">
        <ExplorePanelSearch />
        <ExplorePanelNavbar setActiveTab={setActiveTab} />
      </div>
      <div className="explore-main-feed">
        {activeTab === 0 ? (
          ribbitsList.map((ribbit: RibbitType) => {
            return (
              <Ribbit
                isDeletable={mainUser.userHandle === ribbit.handle}
                isThreaded={false}
                inShowcase={false}
                ribbitInfo={ribbit}
                currentHandle={mainUser.userHandle}
                key={ribbit.id}
                isReRibbit={false}
              />
            );
          })
        ) : (
          <ExploreTopicFeedRandom />
        )}
      </div>
    </div>
  );
};

export default ExplorePanel;
