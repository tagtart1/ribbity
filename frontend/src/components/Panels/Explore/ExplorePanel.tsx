import "../../../styles/ExplorePanel.css";
import ExplorePanelNavbar from "./ExplorePanelNavbar";
import ExplorePanelSearch from "./ExplorePanelSearch";
import ExploreTopicFeedRandom from "./ExploreTopicFeedRandom";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  limit,
  orderBy,
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

// Type alias
type FBQuery = Query<DocumentData>;
type FBQuerySnap = QuerySnapshot<DocumentData>;

const EXPLORE_SEED_KEY = "ribbity-explore-feed-seed";
const FOUR_HOURS_IN_MS = 4 * 60 * 60 * 1000;
const CANDIDATE_LIMIT = 75;
const FEED_LIMIT = 30;

const getExploreSeed = (): number => {
  const now = Date.now();

  try {
    const storedSeed = JSON.parse(
      localStorage.getItem(EXPLORE_SEED_KEY) || "null"
    );

    if (
      typeof storedSeed?.value === "number" &&
      storedSeed.expiresAt > now
    ) {
      return storedSeed.value;
    }
  } catch {
    // Fall through to a fresh in-memory seed when storage is unavailable.
  }

  const value = Math.floor(Math.random() * 2147483647);

  try {
    localStorage.setItem(
      EXPLORE_SEED_KEY,
      JSON.stringify({ value, expiresAt: now + FOUR_HOURS_IN_MS })
    );
  } catch {
    // The feed still works when localStorage is unavailable.
  }

  return value;
};

const getSeededRandom = (id: string, seed: number): number => {
  let hash = seed;

  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), 16777619);
  }

  return (hash >>> 0) / 4294967295;
};

const getExploreScore = (
  ribbit: RibbitType,
  seed: number,
  mainUser: RibbityUser
): number => {
  const age = Math.max(0, Date.now() - ribbit.timeInMillisecond);
  const recency = Math.max(0, 1 - age / (7 * 24 * 60 * 60 * 1000));
  const likes = Object.keys(ribbit.likedBy || {}).length;
  const dislikes = Object.keys(ribbit.dislikedBy || {}).length;
  const reribbits = Object.keys(ribbit.reribbitedBy || {}).length;
  const positiveEngagement = Math.max(0, likes + reribbits * 2 - dislikes);
  const engagement = Math.min(
    1,
    Math.log1p(positiveEngagement) / Math.log(11)
  );
  const relevance =
    ribbit.handle !== mainUser.userHandle &&
    mainUser.following?.[ribbit.handle]
      ? 1
      : 0;
  const random = getSeededRandom(ribbit.id, seed);

  return recency * 0.4 + engagement * 0.25 + relevance * 0.15 + random * 0.2;
};

const ExplorePanel = ({ mainUser }: ExplorePanelProps) => {
  const [ribbitsList, setRibbitsList] = useState<RibbitType[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const allRibbitsQuery: FBQuery = query(
      collection(db, "ribbits"),
      orderBy("timeInMillisecond", "desc"),
      limit(CANDIDATE_LIMIT)
    );
    const fetchRibbits = async (q: FBQuery): Promise<void> => {
      const ribbits: RibbitType[] = [];

      const ribbitSnapshot: FBQuerySnap = await getDocs(q);

      ribbitSnapshot.forEach((doc: any) => {
        const ribbit: RibbitType = doc.data();
        ribbit.id = doc.id;
        ribbits.push(ribbit);
      });

      const seed = getExploreSeed();
      setRibbitsList(
        ribbits
          .sort(
            (a, b) =>
              getExploreScore(b, seed, mainUser) -
              getExploreScore(a, seed, mainUser)
          )
          .slice(0, FEED_LIMIT)
      );
    };
    setIsLoading(true);
    fetchRibbits(allRibbitsQuery).finally(() => setIsLoading(false));
  }, [mainUser]);

  const removeRibbitLocal = (tab: any, id: string): void => {
    setRibbitsList((ribbits) =>
      ribbits.filter((ribbit) => ribbit.id !== id)
    );
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
