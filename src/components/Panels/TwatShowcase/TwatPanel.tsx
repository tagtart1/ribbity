import {
  collection,
  doc,
  getDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../scripts/firebaseConfig";
import "../../../styles/TwatPanel.css";
import Ribbit from "../../Ribbit/Ribbit";
import TwatPanelDisplay from "./TwatPanelDisplay";
import TwatPanelHeader from "./TwatPanelHeader";
import LoadingPanel from "../../Misc/LoadingPanel";
import InvalidRoutePanel from "../../Misc/InvalidRoutePanel";

const TwatPanel = ({ mainUser }: any) => {
  const { handle, twatId } = useParams();
  const [twatInfo, setTwatInfo] = useState<any>();
  const [comments, setComments] = useState<any>([]);
  const [parentTwats, setParentTwats] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const retrieveTwatInfo = async (shouldLoad?: string) => {
    if (!db || !twatId) return;
    if (shouldLoad === undefined) setIsLoading(true);
    const infoRef = doc(db, "twats", twatId);
    // Query by the replyingTo ID
    const commentsQuery = query(
      collection(db, "twats"),
      where("replyingTo.id", "==", twatId)
    );

    const commentsSnap = await getDocs(commentsQuery);
    const infoSnap = await getDoc(infoRef);

    if (infoSnap.exists()) {
      const twat = infoSnap.data();

      twat.id = twatId;

      setTwatInfo(twat);
      retrieveParentTwats(twat);
    }

    const currentComments: any = [];
    commentsSnap.forEach((doc) => {
      const comment = doc.data();
      comment.id = doc.id;
      currentComments.push(comment);
    });
    setComments(currentComments);
    setIsLoading(false);
  };

  const retrieveParentTwats = async (twat: any) => {
    if (twat.replyingTo.all.length === 0) {
      setParentTwats([]);
      return;
    }

    const results: any = [];
    const queries = [];
    for (let i = 0; i < twat.replyingTo.all.length; i += 1) {
      const docRef = doc(db, "twats", twat.replyingTo.all[i]);
      queries.push(docRef);
    }

    const snapshots = await Promise.all(queries.map((query) => getDoc(query)));

    snapshots.forEach((snapshot) => {
      if (snapshot.exists()) {
        const twat = snapshot.data();
        twat.id = snapshot.id;
        results.push(twat);
      } else {
        throw new Error("Could not find parent twat by id");
      }
    });

    setParentTwats(results);
  };
  // Adds the newest made comment to the top of the comment section, locally. Upon refresh then retrieveTwatInfo will sort the comment section again
  const addNewComment = (comment: any) => {
    const commentsCopy = [...comments];
    commentsCopy.unshift(comment);
    setComments(commentsCopy);
  };

  const refreshTwats = () => {
    retrieveTwatInfo("no_load");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    retrieveTwatInfo();
  }, [twatId]);
  if (isLoading) return <LoadingPanel />;
  if (!twatInfo) return <InvalidRoutePanel />;

  return (
    <div className="twat-panel-container">
      <TwatPanelHeader />
      <div className="twat-thread-display-container">
        {parentTwats.map((twat: any) => {
          return (
            <Ribbit
              twatInfo={twat}
              isDeletable={twat.handle === mainUser.userHandle ? true : false}
              currentHandle={mainUser.userHandle}
              refreshTwats={retrieveTwatInfo}
              isThreaded={true}
              key={twat.id}
              inShowcase={true}
            />
          );
        })}
      </div>
      <TwatPanelDisplay
        twatInfo={twatInfo}
        mainUser={mainUser}
        addNewComment={addNewComment}
        key={twatInfo.id}
      />
      {comments.map((comment: any) => {
        return (
          <Ribbit
            twatInfo={comment}
            isDeletable={comment.handle === mainUser.userHandle ? true : false}
            currentHandle={mainUser.userHandle}
            refreshTwats={refreshTwats}
            isThreaded={false}
            key={comment.id}
            inShowcase={true}
          />
        );
      })}
    </div>
  );
};

export default TwatPanel;
