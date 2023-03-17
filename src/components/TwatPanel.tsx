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
import { db } from "../scripts/firebaseConfig";
import "../styles/TwatPanel.css";
import Twat from "./Twat";
import TwatPanelDisplay from "./TwatPanelDisplay";
import TwatPanelHeader from "./TwatPanelHeader";

const TwatPanel = ({ mainUser }: any) => {
  const { handle, twatId } = useParams();
  const [twatInfo, setTwatInfo] = useState<any>();
  const [comments, setComments] = useState<any>([]);

  const retrieveTwatInfo = async () => {
    if (!db || !twatId) return;
    const infoRef = doc(db, "twats", twatId);
    // SHOVE ALL COMMENTS UNDER THE TWATS COLLECTION IF A TWAT IS A COMMENT IT WILL HAVE A REPLYING TO FIELD WHICH HOLD THE ID SO U CAN QUERY ALL COMMENTS WHICH ARE REPLYING TO CERTAIN ID ETC ETC. this will allow, u to chain replies and still maintain likes and stuff
    const commentsQuery = query(
      collection(db, "twats"),
      where("replyingTo", "==", twatId)
    );

    const commentsSnap = await getDocs(commentsQuery);
    const infoSnap = await getDoc(infoRef);

    if (infoSnap.exists()) {
      const twat = infoSnap.data();

      twat.id = twatId;

      setTwatInfo(twat);
    }
    const currentComments: any = [];
    commentsSnap.forEach((doc) => {
      const comment = doc.data();
      comment.id = doc.id;
      currentComments.push(comment);
    });
    setComments(currentComments);
  };
  // Adds the newest made comment to the top of the comment section, locally. Upon refresh then retrieveTwatInfo will sort the comment section again
  const addNewComment = (comment: any) => {
    const commentsCopy = [...comments];
    commentsCopy.unshift(comment);
    setComments(commentsCopy);
  };

  useEffect(() => {
    retrieveTwatInfo();
  }, [twatId]);
  if (!twatInfo) return <div style={{ width: "600px" }}></div>;

  return (
    <div className="twat-panel-container">
      <TwatPanelHeader />
      <TwatPanelDisplay
        twatInfo={twatInfo}
        mainUser={mainUser}
        addNewComment={addNewComment}
      />
      {comments.map((comment: any, index: number) => {
        return (
          <div key={index}>
            {comment.handle === mainUser.userHandle ? (
              <Twat
                twatInfo={comment}
                isDeletable={true}
                currentHandle={mainUser.userHandle}
                refreshTwats={retrieveTwatInfo}
              />
            ) : (
              <Twat
                twatInfo={comment}
                isDeletable={false}
                currentHandle={mainUser.userHandle}
                refreshTwats={retrieveTwatInfo}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TwatPanel;
