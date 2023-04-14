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
import RibbitPanelDisplay from "./RibbitPanelDisplay";
import RibbitPanelHeader from "./RibbitPanelHeader";
import LoadingPanel from "../../Misc/LoadingPanel";
import InvalidRoutePanel from "../../Misc/InvalidRoutePanel";

const RibbitPanel = ({ mainUser }: any) => {
  const { handle, ribbitId } = useParams();
  const [ribbitInfo, setRibbitInfo] = useState<any>();
  const [comments, setComments] = useState<any>([]);
  const [parentRibbits, setParentRibbits] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const retrieveRibbitInfo = async (shouldLoad?: string) => {
    if (!db || !ribbitId) return;
    if (shouldLoad === undefined) setIsLoading(true);
    const infoRef = doc(db, "twats", ribbitId);
    // Query by the replyingTo ID
    const commentsQuery = query(
      collection(db, "twats"),
      where("replyingTo.id", "==", ribbitId)
    );

    const commentsSnap = await getDocs(commentsQuery);
    const infoSnap = await getDoc(infoRef);

    if (infoSnap.exists()) {
      const twat = infoSnap.data();

      twat.id = ribbitId;

      setRibbitInfo(twat);
      retrieveParentRibbits(twat);
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

  const retrieveParentRibbits = async (twat: any) => {
    if (twat.replyingTo.all.length === 0) {
      setParentRibbits([]);
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

    setParentRibbits(results);
  };
  // Adds the newest made comment to the top of the comment section, locally. Upon refresh then retrieveTwatInfo will sort the comment section again
  const addNewComment = (comment: any) => {
    const commentsCopy = [...comments];
    commentsCopy.unshift(comment);
    setComments(commentsCopy);
  };

  const refreshRibbits = () => {
    retrieveRibbitInfo("no_load");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    retrieveRibbitInfo();
  }, [ribbitId]);
  if (isLoading) return <LoadingPanel />;
  if (!ribbitInfo) return <InvalidRoutePanel />;

  return (
    <div className="twat-panel-container">
      <RibbitPanelHeader />
      <div className="twat-thread-display-container">
        {parentRibbits.map((twat: any) => {
          return (
            <Ribbit
              twatInfo={twat}
              isDeletable={twat.handle === mainUser.userHandle ? true : false}
              currentHandle={mainUser.userHandle}
              refreshTwats={retrieveRibbitInfo}
              isThreaded={true}
              key={twat.id}
              inShowcase={true}
            />
          );
        })}
      </div>
      <RibbitPanelDisplay
        ribbitInfo={ribbitInfo}
        mainUser={mainUser}
        addNewComment={addNewComment}
        key={ribbitInfo.id}
      />
      {comments.map((comment: any) => {
        return (
          <Ribbit
            twatInfo={comment}
            isDeletable={comment.handle === mainUser.userHandle ? true : false}
            currentHandle={mainUser.userHandle}
            refreshTwats={refreshRibbits}
            isThreaded={false}
            key={comment.id}
            inShowcase={true}
          />
        );
      })}
    </div>
  );
};

export default RibbitPanel;
