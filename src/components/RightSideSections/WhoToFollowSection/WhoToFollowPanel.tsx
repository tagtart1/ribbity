import "../../../styles/WhoToFollow.css";
import RecommendedFollow from "./RecommendedFollow";
import ShowMoreButton from "../ShowMoreButton";
import { useEffect, useState } from "react";
import { collection, limit, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../scripts/firebaseConfig";
import { useParams } from "react-router-dom";

const WhoToFollowPanel = ({ currentUser, setCurrentUser, isVisible }: any) => {
  const [recommendList, setRecommendList] = useState<any>([]);
  const { handle } = useParams();

  useEffect(() => {
    const getUsersToFollow = async () => {
      if (!currentUser.following) return;
      const followingArray = Object.keys(currentUser.following);

      const q = query(
        collection(db, "user-info"),

        where("userHandle", "not-in", followingArray),
        limit(2)
      );
      const toFollowSnapshot = await getDocs(q);
      const toFollowList: any = [];
      toFollowSnapshot.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        toFollowList.push(user);
      });
      setRecommendList(toFollowList);
    };

    getUsersToFollow();
  }, [currentUser.following, handle]);

  if (!currentUser || recommendList.length === 0) return null;
  return (
    <div className={!isVisible ? "display-off" : "who-to-follow-container"}>
      <h1>Who to follow</h1>
      {recommendList.map((user: any, index: number) => {
        return (
          <div key={index}>
            <RecommendedFollow recommendedUser={user} mainUser={currentUser} />
          </div>
        );
      })}

      <ShowMoreButton />
    </div>
  );
};

export default WhoToFollowPanel;
