import {
  collection,
  doc,
  getDoc,
  query,
  getDocs,
  where,
  DocumentReference,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../scripts/firebaseConfig";
import "../../../styles/RibbitPanel.css";
import Ribbit from "../../Ribbit/Ribbit";
import RibbitPanelDisplay from "./RibbitPanelDisplay";
import RibbitPanelHeader from "./RibbitPanelHeader";
import LoadingPanel from "../../Misc/LoadingPanel";
import InvalidRoutePanel from "../../Misc/InvalidRoutePanel";
import { RibbitType, RibbityUser } from "../../../Ribbity.types";

interface RibbitPanelProps {
  mainUser: RibbityUser;
}

const RibbitPanel = ({ mainUser }: RibbitPanelProps) => {
  const { handle, ribbitId } = useParams();
  const [ribbitInfo, setRibbitInfo] = useState<RibbitType>();
  const [comments, setComments] = useState<RibbitType[]>([]);
  const [parentRibbits, setParentRibbits] = useState<RibbitType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const retrieveRibbitInfo = async (shouldLoad?: string): Promise<void> => {
    if (!db || !ribbitId) return;
    if (shouldLoad === undefined) setIsLoading(true);
    const infoRef: DocumentReference = doc(db, "ribbits", ribbitId);
    // Query by the replyingTo ID
    const commentsQuery: Query = query(
      collection(db, "ribbits"),
      where("replyingTo.id", "==", ribbitId)
    );

    const commentsSnap: QuerySnapshot = await getDocs(commentsQuery);
    const infoSnap: DocumentSnapshot = await getDoc(infoRef);

    if (infoSnap.exists()) {
      const ribbit: RibbitType = infoSnap.data() as RibbitType;

      ribbit.id = ribbitId;

      setRibbitInfo(ribbit);
      retrieveParentRibbits(ribbit);
    }

    const currentComments: RibbitType[] = [];
    commentsSnap.forEach((doc: QueryDocumentSnapshot) => {
      const comment: RibbitType = doc.data() as RibbitType;
      comment.id = doc.id;
      currentComments.push(comment);
    });
    setComments(currentComments);
    setIsLoading(false);
  };

  const retrieveParentRibbits = async (ribbit: RibbitType): Promise<void> => {
    if (ribbit.replyingTo.all.length === 0) {
      setParentRibbits([]);
      return;
    }

    const results: RibbitType[] = [];
    const queries: DocumentReference[] = [];
    for (let i = 0; i < ribbit.replyingTo.all.length; i += 1) {
      const docRef = doc(db, "ribbits", ribbit.replyingTo.all[i]);
      queries.push(docRef);
    }

    const snapshots: DocumentSnapshot[] = await Promise.all(
      queries.map((query) => getDoc(query))
    );

    snapshots.forEach((snapshot) => {
      if (snapshot.exists()) {
        const ribbit: RibbitType = snapshot.data() as RibbitType;
        ribbit.id = snapshot.id;
        results.push(ribbit);
      } else {
        throw new Error("Could not find parent ribbit by id");
      }
    });

    setParentRibbits(results);
  };
  // Adds the newest made comment to the top of the comment section, locally. Upon refresh then retrieveRibbitInfo will sort the comment section again
  const addNewComment = (comment: RibbitType): void => {
    const commentsCopy: RibbitType[] = [...comments];
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
    <div className="ribbit-panel-container">
      <RibbitPanelHeader />
      <div className="ribbit-thread-display-container">
        {parentRibbits.map((ribbit: any) => {
          return (
            <Ribbit
              ribbitInfo={ribbit}
              isDeletable={ribbit.handle === mainUser.userHandle ? true : false}
              currentHandle={mainUser.userHandle}
              refreshRibbits={retrieveRibbitInfo}
              isThreaded={true}
              key={ribbit.id}
              inShowcase={true}
              isReRibbit={false}
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
            ribbitInfo={comment}
            isDeletable={comment.handle === mainUser.userHandle ? true : false}
            currentHandle={mainUser.userHandle}
            refreshRibbits={refreshRibbits}
            isThreaded={false}
            key={comment.id}
            inShowcase={true}
            isReRibbit={false}
          />
        );
      })}
    </div>
  );
};

export default RibbitPanel;
