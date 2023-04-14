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
  const [twatsList, setTwatsList] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const allTwatsQuery = query(collection(db, "twats"), limit(30));
    const fetchTwats = async (q: any) => {
      let twats: any = [];
      const twatSnapshot = await getDocs(q);
      twatSnapshot.forEach((doc) => {
        const twat: any = doc.data();
        twat.id = doc.id;
        twats.push(twat);
      });
      setTwatsList(twats);
    };
    setIsLoading(true);
    fetchTwats(allTwatsQuery);

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
          twatsList.map((twat: any) => {
            return (
              <Ribbit
                isDeletable={false}
                isThreaded={false}
                inShowcase={false}
                twatInfo={twat}
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
