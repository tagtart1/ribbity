import "../../../styles/WhoToFollow.css";
import RecommendedFollow from "./RecommendedFollow";
import ShowMoreButton from "../ShowMoreButton";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  query,
  where,
  getDocs,
  Query,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import { useParams } from "react-router-dom";
import { RibbityUser } from "../../../Ribbity.types";

interface WhoToFollowPanelProps {
  mainUser: RibbityUser;
  isVisible: boolean;
}

type FBQuery = Query<DocumentData>;
type FBSnap = QuerySnapshot<DocumentData>;

const WhoToFollowPanel = ({ mainUser, isVisible }: WhoToFollowPanelProps) => {
  const [recommendList, setRecommendList] = useState<RibbityUser[]>([]);
  const { handle } = useParams();

  useEffect(() => {
    const getUsersToFollow = async (): Promise<void> => {
      if (!mainUser.following) return;
      const followingArray: string[] = Object.keys(mainUser.following);

      const q: FBQuery = query(
        collection(db, "user-info"),

        where("userHandle", "not-in", followingArray),
        limit(2)
      );
      const toFollowSnapshot: FBSnap = await getDocs(q);
      const toFollowList: RibbityUser[] = [];
      toFollowSnapshot.forEach((doc: any) => {
        const user: RibbityUser = doc.data();
        user.id = doc.id;
        toFollowList.push(user);
      });
      setRecommendList(toFollowList);
    };

    getUsersToFollow();
  }, [mainUser.following, handle]);

  if (!mainUser || recommendList.length === 0) return null;
  return (
    <aside className={!isVisible ? "display-off" : "who-to-follow-container"}>
      <h1>Who to follow</h1>
      <ul className="who-to-follow-list">
        {recommendList.map((user: RibbityUser, index: number) => {
          return (
            <div key={index}>
              <RecommendedFollow recommendedUser={user} mainUser={mainUser} />
            </div>
          );
        })}
      </ul>

      <ShowMoreButton />
    </aside>
  );
};

export default WhoToFollowPanel;
