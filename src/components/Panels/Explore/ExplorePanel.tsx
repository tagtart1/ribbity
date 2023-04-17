import "../../../styles/ExplorePanel.css";
import ExplorePanelNavbar from "./ExplorePanelNavbar";
import ExplorePanelSearch from "./ExplorePanelSearch";
import ExploreTopicFeedRandom from "./ExploreTopicFeedRandom";

import { useState, useEffect } from "react";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import Ribbit from "../../Ribbit/Ribbit";
import LoadingPanel from "../../Misc/LoadingPanel";

const ExplorePanel = () => {
  const [ribbitsList, setRibbitsList] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const allRibbitsQuery = query(collection(db, "twats"), limit(30));
    const fetchRibbits = async (q: any) => {
      let ribbits: any = [];
      const ribbitSnapshot = await getDocs(q);
      ribbitSnapshot.forEach((doc) => {
        const ribbit: any = doc.data();
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
          ribbitsList.map((twat: any) => {
            return (
              <Ribbit
                isDeletable={false}
                isThreaded={false}
                inShowcase={false}
                ribbitInfo={twat}
                currentHandle=""
                key={twat.id}
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
